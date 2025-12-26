import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

import {
  NOTIFICATION_CHANNEL_ID,
  ScheduleNotificationInput,
} from './notifications.types';
import { NotificationAdapter } from './notification-adapter';

export class NotifeeAdapter implements NotificationAdapter {
  constructor() {
    this.createNotificationChannel();
  }

  private async createNotificationChannel(): Promise<void> {
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: 'Todo Reminders',
      sound: 'default',
      importance: 4, // AndroidImportance.HIGH
      vibration: true,
    });
  }

  async requestPermission(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  }

  async schedule(input: ScheduleNotificationInput): Promise<string> {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: input.timestamp,
      alarmManager: { allowWhileIdle: true },
    };

    const id = await notifee.createTriggerNotification(
      {
        title: input.title,
        body: input.body,
        android: { channelId: NOTIFICATION_CHANNEL_ID },
        // iOS: To show on ios when in foreground mode
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            sound: true,
            badge: true,
          },
        },
      },
      trigger,
    );

    return id;
  }

  async cancel(notificationId: string): Promise<void> {
    await notifee.cancelNotification(notificationId);
  }

  async cancelAll(): Promise<void> {
    await notifee.cancelAllNotifications();
  }

  async getScheduledIds(): Promise<string[]> {
    const scheduled = await notifee.getTriggerNotifications();
    return scheduled
      .map(trigger => trigger.notification.id)
      .filter((id): id is string => Boolean(id));
  }
}
