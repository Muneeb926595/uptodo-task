import { storageService, StorageKeys } from '../../services/storage';
import dayjs from 'dayjs';
import { notificationService } from '../../services/notifications';
import { todoRepository } from '../../todo/repository/todo-repository';

export type FocusSession = {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  completed: boolean;
  createdAt: number;
};

export type FocusStats = {
  today: number; // seconds
  thisWeek: number[]; // 7 days, seconds per day
  totalSessions: number;
};

type FocusSessionMap = Record<string, FocusSession>;

class FocusRepository {
  private SESSIONS_KEY = StorageKeys.FOCUS_SESSIONS;
  private ACTIVE_SESSION_KEY = StorageKeys.ACTIVE_FOCUS_SESSION;

  private async loadSessions(): Promise<FocusSessionMap> {
    const map = await storageService.getItem<FocusSessionMap>(
      this.SESSIONS_KEY,
      {},
    );
    return map ?? {};
  }

  private async saveSessions(map: FocusSessionMap) {
    await storageService.setItem(this.SESSIONS_KEY, map);
  }

  async createSession(duration: number): Promise<FocusSession> {
    const now = Date.now();
    const session: FocusSession = {
      id: `focus_${now}`,
      startTime: now,
      endTime: now + duration * 1000,
      duration,
      completed: false,
      createdAt: now,
    };

    const map = await this.loadSessions();
    map[session.id] = session;
    await this.saveSessions(map);
    await storageService.setItem(this.ACTIVE_SESSION_KEY, session);

    // Suppress only notifications that would fire during this focus session
    const todos = await todoRepository.getAll();
    await notificationService.suppressNotifications(todos, session.endTime);

    return session;
  }

  async getActiveSession(): Promise<FocusSession | null> {
    const session = await storageService.getItem<FocusSession | null>(
      this.ACTIVE_SESSION_KEY,
    );

    if (session && session.endTime > Date.now()) {
      return session;
    }

    // Clean up expired session - mark as completed since user finished the full duration
    if (session) {
      await this.completeSession(session.id, true);
    }

    return null;
  }

  async completeSession(id: string, completed: boolean): Promise<void> {
    const map = await this.loadSessions();
    if (map[id]) {
      const session = map[id];
      const now = Date.now();

      // Calculate actual duration in seconds
      const actualDuration = Math.floor((now - session.startTime) / 1000);

      // Use the minimum of actual duration or planned duration
      // (in case session runs past endTime, cap it at planned duration)
      session.duration = Math.min(actualDuration, session.duration);
      session.completed = completed;

      await this.saveSessions(map);
    }
    await storageService.removeItem(this.ACTIVE_SESSION_KEY);

    // Restore notifications
    await notificationService.restoreNotifications();
  }

  async getStats(weekOffset: number = 0): Promise<FocusStats> {
    const map = await this.loadSessions();
    const sessions = Object.values(map).filter(s => s.completed);

    // Today's stats
    const todayStart = dayjs().startOf('day').valueOf();
    const todayEnd = dayjs().endOf('day').valueOf();
    const todaySessions = sessions.filter(
      s => s.startTime >= todayStart && s.startTime <= todayEnd,
    );
    const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    // Week stats with offset (0 = this week, -1 = last week, etc.)
    const weekStart = dayjs().add(weekOffset, 'week').startOf('week').valueOf();
    const weekEnd = dayjs().add(weekOffset, 'week').endOf('week').valueOf();
    const thisWeekData = new Array(7).fill(0);

    sessions.forEach(session => {
      const sessionTime = session.startTime;
      // Check if session is within the specified week (inclusive)
      if (sessionTime >= weekStart && sessionTime <= weekEnd) {
        const dayIndex = dayjs(sessionTime).day(); // 0 = Sunday, 6 = Saturday
        thisWeekData[dayIndex] += session.duration;
      }
    });

    return {
      today: todayTotal,
      thisWeek: thisWeekData,
      totalSessions: sessions.length,
    };
  }

  async getAllSessions(): Promise<FocusSession[]> {
    const map = await this.loadSessions();
    return Object.values(map).sort((a, b) => b.startTime - a.startTime);
  }
}

export const focusRepository = new FocusRepository();
