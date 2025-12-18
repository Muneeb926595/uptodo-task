import { ScheduleNotificationInput } from './notifications.types';

export interface NotificationAdapter {
  requestPermission(): Promise<boolean>;
  schedule(input: ScheduleNotificationInput): Promise<string>;
  cancel(notificationId: string): Promise<void>;
  cancelAll(): Promise<void>;
  getScheduledIds(): Promise<string[]>;
}
