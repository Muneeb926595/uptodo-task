import { storageService, StorageKeys } from '../../services/storage';
import { Todo } from '../../todo/types/todo.types';
import { generateId } from '../../../app/utils/id';
import { notificationService } from '../../services/notifications';
import { categoriesRepository } from '../../categories/repository';

type TodoMap = Record<string, Todo>;

class TodoRepository {
  private async load(): Promise<TodoMap> {
    const map = (await storageService.getItem<TodoMap>(
      StorageKeys.TODOS,
      {},
    )) as TodoMap;
    return map ?? {};
  }

  private async save(map: TodoMap) {
    await storageService.setItem(StorageKeys.TODOS, map);
  }

  async getAll(): Promise<Todo[]> {
    const map = await this.load();
    const now = Date.now();

    // 1 Load categories once
    const categories = await categoriesRepository.getAll();
    const categoryMap = new Map(categories?.map?.(c => [c?.id, c]));

    return Object.values(map)
      .filter(todo => !todo?.deletedAt)
      .map(todo => ({
        ...todo,

        // 2 Populate category
        category: categoryMap?.get?.(todo?.categoryId),

        // 3 Derived helpers
        isOverdue: !todo?.isCompleted && todo?.dueDate < now,
      }))
      .sort((a, b) => {
        // Higher priority first
        if (a?.priority !== b?.priority) {
          return b?.priority - a?.priority;
        }

        // Earlier due date first
        if (a?.dueDate !== b?.dueDate) {
          return a?.dueDate - b?.dueDate;
        }

        // Stable fallback
        return a?.createdAt - b?.createdAt;
      });
  }

  async getById(id: string): Promise<Todo | null> {
    const map = await this.load();
    return map?.[id] ?? null;
  }

  async getByCategory(categoryId: string): Promise<Todo[]> {
    const all = await this.getAll();
    return all?.filter?.(t => t?.categoryId === categoryId && !t?.deletedAt);
  }

  async getForDate(dateTimestamp: number): Promise<Todo[]> {
    // dateTimestamp should be midnight UTC/MS of requested day
    const all = await this.getAll();
    const start = new Date(dateTimestamp).setHours(0, 0, 0, 0);
    const end = new Date(dateTimestamp).setHours(23, 59, 59, 999);
    return all?.filter?.(t => t?.dueDate >= start && t?.dueDate <= end);
  }

  async getOverdue(now: number = Date.now()): Promise<Todo[]> {
    const all = await this.getAll();
    return all?.filter?.(t => !t?.isCompleted && t?.dueDate < now);
  }

  async create(payload: Partial<Todo>): Promise<Todo> {
    const map = await this.load();
    const id = payload.id ?? generateId();
    const now = Date.now();
    const todo: Todo = {
      id,
      title: payload?.title ?? 'Untitled',
      description: payload?.description,
      dueDate: payload?.dueDate ?? now,
      todoTime: payload?.todoTime,
      timezone:
        payload?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      priority: payload?.priority ?? 3,
      status:
        payload?.status ??
        (payload?.isCompleted ? ('COMPLETED' as any) : ('PENDING' as any)),
      categoryId: payload?.categoryId ?? '',
      parentId: payload?.parentId ?? null,
      isCompleted: !!payload?.isCompleted,
      hasSubTasks: !!payload?.hasSubTasks,
      createdAt: now,
      updatedAt: now,
      completedAt: payload?.completedAt ?? null,
      deletedAt: null,
    } as Todo;

    // schedule notification
    const notificationId = await notificationService.scheduleForTodo(todo);
    if (notificationId) {
      todo.notificationId = notificationId;
    }
    map[id] = todo;
    await this.save(map);
    return todo;
  }

  async update(id: string, patch: Partial<Todo>): Promise<Todo | null> {
    const map = await this.load();
    const existing = map?.[id];
    if (!existing) return null;

    const updated: Todo = {
      ...existing,
      ...patch,
      updatedAt: Date.now(),
    } as Todo;

    const notificationId =
      patch?.dueDate || patch?.isCompleted !== undefined
        ? await notificationService.rescheduleTodo(updated)
        : updated?.notificationId;

    updated.notificationId = notificationId ?? undefined;

    map[id] = updated;
    await this.save(map);
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    const map = await this.load();
    const existing = map?.[id];
    if (!existing) return;

    await notificationService.cancelForTodo(existing);

    existing.deletedAt = Date.now();
    existing.updatedAt = Date.now();
    map[id] = existing;
    await this.save(map);
  }

  async restore(id: string): Promise<void> {
    const map = await this.load();
    const existing = map?.[id];
    if (!existing) return;

    // Remove deletedAt to restore the todo
    delete existing.deletedAt;
    existing.updatedAt = Date.now();

    // Reschedule notification if needed
    if (existing.dueDate && existing.dueDate > Date.now()) {
      const notificationId = await notificationService.scheduleForTodo(
        existing,
      );
      existing.notificationId = notificationId ?? undefined;
    }

    map[id] = existing;
    await this.save(map);
  }

  // Additional helper: bulk replace (used by sync/migrations)
  async replaceAll(todos: Todo[]) {
    const map: TodoMap = {};
    todos?.forEach?.(t => (map[t.id] = t));
    await this.save(map);
  }

  /**
   * Import todos with merge strategy
   * @param todos - Todos to import
   * @param strategy - 'merge' (keep existing + add new) or 'replace' (delete all, import new)
   */
  async importTodos(
    todos: Todo[],
    strategy: 'merge' | 'replace' = 'merge',
  ): Promise<{ imported: number; skipped: number; errors: number }> {
    const map = await this.load();
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    if (strategy === 'replace') {
      // Clear existing todos
      Object.keys(map).forEach(key => delete map[key]);
    }

    for (const todo of todos) {
      try {
        if (strategy === 'merge' && map[todo.id]) {
          // Skip if already exists in merge mode
          skipped++;
          continue;
        }

        // Clean up the todo (remove derived fields)
        const cleanTodo: Todo = {
          ...todo,
          category: undefined,
          isOverdue: undefined,
          updatedAt: Date.now(),
        };

        // Reschedule notifications for future todos
        if (cleanTodo.dueDate > Date.now() && !cleanTodo.isCompleted) {
          const notificationId = await notificationService.scheduleForTodo(
            cleanTodo,
          );
          cleanTodo.notificationId = notificationId ?? undefined;
        }

        map[todo.id] = cleanTodo;
        imported++;
      } catch (error) {
        console.error(`Error importing todo ${todo.id}:`, error);
        errors++;
      }
    }

    await this.save(map);
    return { imported, skipped, errors };
  }
}

export const todoRepository = new TodoRepository();
