import { Todo } from '../../todo/types';
import { NotificationAdapter } from './notification-adapter';
import { storageService, StorageKeys } from '../storage';

type SavedNotification = {
  id: string;
  todoId: string;
  title: string;
  body?: string;
  timestamp: number;
};

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

  // ===== Focus Mode Support =====

  /**
   * Suppress notifications that would fire during the focus session
   * Only notifications between now and focusEndTime are suppressed
   * @param todos - All todos to check for notifications
   * @param focusEndTime - Timestamp when focus session ends
   */
  async suppressNotifications(
    todos: Todo[],
    focusEndTime: number,
  ): Promise<void> {
    // Get currently scheduled notification IDs
    const scheduledIds = await this.adapter.getScheduledIds();
    const now = Date.now();

    // Only suppress notifications that would fire DURING the focus session
    const notificationsToSuppress: SavedNotification[] = todos
      ?.filter?.(
        todo =>
          scheduledIds?.includes?.(todo?.id) &&
          !todo?.isCompleted &&
          !todo?.deletedAt &&
          todo?.dueDate >= now && // Not in the past
          todo?.dueDate <= focusEndTime, // Would fire during focus session
      )
      .map(todo => ({
        id: todo?.id,
        todoId: todo?.id,
        title: 'Todo Due',
        body: todo?.title,
        timestamp: todo?.dueDate,
      }));

    // Save to storage
    await storageService.setItem(
      StorageKeys.SUPPRESSED_NOTIFICATIONS,
      notificationsToSuppress,
    );

    // Cancel only the notifications that would fire during focus
    for (const notification of notificationsToSuppress) {
      await this.adapter.cancel(notification?.id);
    }
  }

  /**
   * Restore previously suppressed notifications
   */
  async restoreNotifications(): Promise<void> {
    // Get saved notifications
    const saved = await storageService.getItem<SavedNotification[]>(
      StorageKeys.SUPPRESSED_NOTIFICATIONS,
      [],
    );

    if (!saved || saved.length === 0) return;

    // Reschedule each notification if still valid
    const now = Date.now();
    for (const notification of saved) {
      if (notification.timestamp > now) {
        await this.adapter.schedule({
          id: notification.todoId,
          title: notification.title,
          body: notification.body,
          timestamp: notification.timestamp,
        });
      }
    }

    // Clear saved notifications
    await storageService.removeItem(StorageKeys.SUPPRESSED_NOTIFICATIONS);
  }

  /**
   * Check if notifications are currently suppressed
   */
  async areNotificationsSuppressed(): Promise<boolean> {
    const saved = await storageService.getItem<SavedNotification[]>(
      StorageKeys.SUPPRESSED_NOTIFICATIONS,
    );
    return saved !== null && saved.length > 0;
  }
}

export default NotificationService;
