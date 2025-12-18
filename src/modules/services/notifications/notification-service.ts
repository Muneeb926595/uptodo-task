import { Todo } from '../../todo/types';
import { NotificationAdapter } from './notification-adapter';

class NotificationService {
  constructor(private adapter: NotificationAdapter) {}

  async ensurePermissions() {
    return this.adapter.requestPermission();
  }

  async scheduleForTodo(todo: Todo): Promise<string | null> {
    if (todo.isCompleted) return null;
    if (todo.deletedAt) return null;
    if (todo.dueDate <= Date.now()) return null;

    return this.adapter.schedule({
      id: todo?.id,
      title: 'Todo Due',
      body: todo?.title,
      timestamp: todo?.dueDate,
    });
  }

  async rescheduleTodo(todo: Todo): Promise<string | null> {
    if (todo.notificationId) {
      await this.adapter.cancel(todo.notificationId);
    }
    return this.scheduleForTodo(todo);
  }

  async cancelForTodo(todo: Todo): Promise<void> {
    if (!todo.notificationId) return;
    await this.adapter.cancel(todo.notificationId);
  }

  async resyncAll(todos: Todo[]) {
    await this.adapter.cancelAll();

    for (const todo of todos) {
      if (!todo.isCompleted && !todo.deletedAt && todo.dueDate > Date.now()) {
        await this.scheduleForTodo(todo);
      }
    }
  }
}

export default NotificationService;
