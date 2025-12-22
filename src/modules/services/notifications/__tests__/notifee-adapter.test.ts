/**
 * Notifee Adapter Test Suite
 *
 * Tests the adapter implementation for @notifee/react-native library
 */

import notifee, { TriggerType } from '@notifee/react-native';
import { NotifeeAdapter } from '../notifee-adapter';
import {
  ScheduleNotificationInput,
  NOTIFICATION_CHANNEL_ID,
} from '../notifications.types';

// Mock the @notifee/react-native library
jest.mock('@notifee/react-native');

describe('NotifeeAdapter', () => {
  let adapter: NotifeeAdapter;
  let mockNotifee: jest.Mocked<typeof notifee>;

  beforeEach(() => {
    adapter = new NotifeeAdapter();
    mockNotifee = notifee as jest.Mocked<typeof notifee>;
    jest.clearAllMocks();
  });

  describe('requestPermission', () => {
    it('should return true when permission is granted (status >= 1)', async () => {
      // Arrange
      mockNotifee.requestPermission.mockResolvedValue({
        authorizationStatus: 2, // Authorized
      } as any);

      // Act
      const result = await adapter.requestPermission();

      // Assert
      expect(notifee.requestPermission).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return true when permission status is 1', async () => {
      // Arrange
      mockNotifee.requestPermission.mockResolvedValue({
        authorizationStatus: 1,
      } as any);

      // Act
      const result = await adapter.requestPermission();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when permission is denied (status 0)', async () => {
      // Arrange
      mockNotifee.requestPermission.mockResolvedValue({
        authorizationStatus: 0,
      } as any);

      // Act
      const result = await adapter.requestPermission();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when permission is not determined (status -1)', async () => {
      // Arrange
      mockNotifee.requestPermission.mockResolvedValue({
        authorizationStatus: -1,
      } as any);

      // Act
      const result = await adapter.requestPermission();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('schedule', () => {
    it('should schedule a notification with correct parameters', async () => {
      // Arrange
      const input: ScheduleNotificationInput = {
        id: 'todo-123',
        title: 'Todo Reminder',
        body: 'Complete your task',
        timestamp: Date.now() + 3600000, // 1 hour from now
      };
      mockNotifee.createTriggerNotification.mockResolvedValue('notif-456');

      // Act
      const result = await adapter.schedule(input);

      // Assert
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        {
          title: input.title,
          body: input.body,
          android: { channelId: NOTIFICATION_CHANNEL_ID },
          ios: {
            foregroundPresentationOptions: {
              alert: true,
              sound: true,
              badge: true,
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: input.timestamp,
          alarmManager: { allowWhileIdle: true },
        },
      );
      expect(result).toBe('notif-456');
    });

    it('should create trigger with TIMESTAMP type', async () => {
      // Arrange
      const input: ScheduleNotificationInput = {
        id: 'todo-789',
        title: 'Test',
        body: 'Test Body',
        timestamp: 1234567890,
      };
      mockNotifee.createTriggerNotification.mockResolvedValue('notif-789');

      // Act
      await adapter.schedule(input);

      // Assert
      const triggerArg = (notifee.createTriggerNotification as jest.Mock).mock
        .calls[0][1];
      expect(triggerArg.type).toBe(TriggerType.TIMESTAMP);
      expect(triggerArg.timestamp).toBe(input.timestamp);
      expect(triggerArg.alarmManager.allowWhileIdle).toBe(true);
    });

    it('should include Android channel ID', async () => {
      // Arrange
      const input: ScheduleNotificationInput = {
        id: 'todo-1',
        title: 'Title',
        body: 'Body',
        timestamp: Date.now(),
      };
      mockNotifee.createTriggerNotification.mockResolvedValue('notif-1');

      // Act
      await adapter.schedule(input);

      // Assert
      const notificationArg = (notifee.createTriggerNotification as jest.Mock)
        .mock.calls[0][0];
      expect(notificationArg.android.channelId).toBe(NOTIFICATION_CHANNEL_ID);
    });

    it('should include iOS foreground presentation options', async () => {
      // Arrange
      const input: ScheduleNotificationInput = {
        id: 'todo-2',
        title: 'iOS Test',
        body: 'iOS Body',
        timestamp: Date.now(),
      };
      mockNotifee.createTriggerNotification.mockResolvedValue('notif-2');

      // Act
      await adapter.schedule(input);

      // Assert
      const notificationArg = (notifee.createTriggerNotification as jest.Mock)
        .mock.calls[0][0];
      expect(notificationArg.ios.foregroundPresentationOptions).toEqual({
        alert: true,
        sound: true,
        badge: true,
      });
    });

    it('should return the notification ID from notifee', async () => {
      // Arrange
      const input: ScheduleNotificationInput = {
        id: 'todo-3',
        title: 'Test',
        body: 'Test',
        timestamp: Date.now(),
      };
      const expectedId = 'generated-notif-id-12345';
      mockNotifee.createTriggerNotification.mockResolvedValue(expectedId);

      // Act
      const result = await adapter.schedule(input);

      // Assert
      expect(result).toBe(expectedId);
    });
  });

  describe('cancel', () => {
    it('should cancel a notification by ID', async () => {
      // Arrange
      const notificationId = 'notif-123';
      mockNotifee.cancelNotification.mockResolvedValue(undefined);

      // Act
      await adapter.cancel(notificationId);

      // Assert
      expect(notifee.cancelNotification).toHaveBeenCalledWith(notificationId);
    });

    it('should handle multiple cancel calls', async () => {
      // Arrange
      mockNotifee.cancelNotification.mockResolvedValue(undefined);

      // Act
      await adapter.cancel('notif-1');
      await adapter.cancel('notif-2');
      await adapter.cancel('notif-3');

      // Assert
      expect(notifee.cancelNotification).toHaveBeenCalledTimes(3);
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notif-1');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notif-2');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notif-3');
    });
  });

  describe('cancelAll', () => {
    it('should cancel all notifications', async () => {
      // Arrange
      mockNotifee.cancelAllNotifications.mockResolvedValue(undefined);

      // Act
      await adapter.cancelAll();

      // Assert
      expect(notifee.cancelAllNotifications).toHaveBeenCalled();
    });

    it('should call cancelAllNotifications only once', async () => {
      // Arrange
      mockNotifee.cancelAllNotifications.mockResolvedValue(undefined);

      // Act
      await adapter.cancelAll();

      // Assert
      expect(notifee.cancelAllNotifications).toHaveBeenCalledTimes(1);
    });
  });

  describe('getScheduledIds', () => {
    it('should return array of scheduled notification IDs', async () => {
      // Arrange
      const mockScheduled = [
        { notification: { id: 'notif-1', title: 'Todo 1' } },
        { notification: { id: 'notif-2', title: 'Todo 2' } },
        { notification: { id: 'notif-3', title: 'Todo 3' } },
      ];
      mockNotifee.getTriggerNotifications.mockResolvedValue(
        mockScheduled as any,
      );

      // Act
      const result = await adapter.getScheduledIds();

      // Assert
      expect(notifee.getTriggerNotifications).toHaveBeenCalled();
      expect(result).toEqual(['notif-1', 'notif-2', 'notif-3']);
    });

    it('should filter out notifications without IDs', async () => {
      // Arrange
      const mockScheduled = [
        { notification: { id: 'notif-1', title: 'Todo 1' } },
        { notification: { id: null, title: 'Todo 2' } },
        { notification: { id: 'notif-3', title: 'Todo 3' } },
        { notification: { title: 'Todo 4' } }, // No id property
      ];
      mockNotifee.getTriggerNotifications.mockResolvedValue(
        mockScheduled as any,
      );

      // Act
      const result = await adapter.getScheduledIds();

      // Assert
      expect(result).toEqual(['notif-1', 'notif-3']);
    });

    it('should return empty array when no notifications scheduled', async () => {
      // Arrange
      mockNotifee.getTriggerNotifications.mockResolvedValue([]);

      // Act
      const result = await adapter.getScheduledIds();

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle undefined and null IDs', async () => {
      // Arrange
      const mockScheduled = [
        { notification: { id: undefined, title: 'Todo 1' } },
        { notification: { id: null, title: 'Todo 2' } },
        { notification: { id: '', title: 'Todo 3' } },
        { notification: { id: 'notif-valid', title: 'Todo 4' } },
      ];
      mockNotifee.getTriggerNotifications.mockResolvedValue(
        mockScheduled as any,
      );

      // Act
      const result = await adapter.getScheduledIds();

      // Assert
      expect(result).toEqual(['notif-valid']);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete notification lifecycle', async () => {
      // Arrange - Request permission
      mockNotifee.requestPermission.mockResolvedValue({
        authorizationStatus: 2,
      } as any);

      // Act & Assert - Request permission
      const hasPermission = await adapter.requestPermission();
      expect(hasPermission).toBe(true);

      // Arrange - Schedule notification
      const input: ScheduleNotificationInput = {
        id: 'todo-1',
        title: 'Test Todo',
        body: 'Complete this task',
        timestamp: Date.now() + 1800000,
      };
      mockNotifee.createTriggerNotification.mockResolvedValue('notif-123');

      // Act & Assert - Schedule
      const notifId = await adapter.schedule(input);
      expect(notifId).toBe('notif-123');

      // Arrange - Get scheduled
      mockNotifee.getTriggerNotifications.mockResolvedValue([
        { notification: { id: 'notif-123', title: 'Test Todo' } },
      ] as any);

      // Act & Assert - Get scheduled
      const scheduled = await adapter.getScheduledIds();
      expect(scheduled).toContain('notif-123');

      // Act & Assert - Cancel
      mockNotifee.cancelNotification.mockResolvedValue(undefined);
      await adapter.cancel('notif-123');
      expect(notifee.cancelNotification).toHaveBeenCalledWith('notif-123');
    });
  });
});
