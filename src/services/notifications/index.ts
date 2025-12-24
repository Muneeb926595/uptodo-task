import { NotifeeAdapter } from './notifee-adapter';
import NotificationService from './notification-service';

export const notificationService = new NotificationService(
  new NotifeeAdapter(),
);
