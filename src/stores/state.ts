import { User } from '../types';

export interface FocusState {
  isActive: boolean;
  duration: number; // in seconds
  startTime: number | null;
  endTime: number | null;
  notificationsSuppressed: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
