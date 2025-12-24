export interface ScheduleNotificationInput {
  id: string;
  title: string;
  body?: string;
  timestamp: number; // dueDate (ms)
}

export const NOTIFICATION_CHANNEL_ID = 'todo-reminders';
