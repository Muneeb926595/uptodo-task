import StorageHelper, { StorageKeys } from '../../../app/data/mmkv-storage';
import { Todo } from '../../todo/types/todo.types';
import { generateId } from '../../../app/utils/id';
import { notificationService } from '../../services/notifications';
import { categoriesRepository } from '../../categories/repository';

type TodoMap = Record<string, Todo>;

class TodoRepository {
  private async load(): Promise<TodoMap> {
    const map = (await StorageHelper.getItem<TodoMap>(
      StorageKeys.TODOS,
      {},
    )) as TodoMap;
    return map ?? {};
  }

  private async save(map: TodoMap) {
    await StorageHelper.setItem(StorageKeys.TODOS, map);
  }

  async getAll(): Promise<Todo[]> {
    const map = await this.load();
    const now = Date.now();

    // 1️⃣ Load categories once
    const categories = await categoriesRepository.getAll();
    const categoryMap = new Map(categories?.map?.(c => [c?.id, c]));

    return Object.values(map)
      .filter(todo => !todo?.deletedAt)
      .map(todo => ({
        ...todo,

        // 2️⃣ Populate category
        category: categoryMap?.get?.(todo?.categoryId),

        // 3️⃣ Derived helpers
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

    // 🔔 schedule notification
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

  // Additional helper: bulk replace (used by sync/migrations)
  async replaceAll(todos: Todo[]) {
    const map: TodoMap = {};
    todos?.forEach?.(t => (map[t.id] = t));
    await this.save(map);
  }
}

export const todoRepository = new TodoRepository();
