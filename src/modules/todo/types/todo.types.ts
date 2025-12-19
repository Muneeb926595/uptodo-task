export const PRIORITY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];

export enum TodoStatus {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Archived = 'ARCHIVED',
}

export enum AttachmentType {
  Image = 'IMAGE',
}

export enum NotificationStatus {
  Scheduled = 'SCHEDULED',
  Fired = 'FIRED',
  Cancelled = 'CANCELLED',
}

export type Category = {
  id: string; // uuid
  name: string; // "Work", "Home", etc
  icon?: string; // icon name or image uri
  color: string; // hex color
  isSystem: boolean; // true for predefined enums
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null; // soft delete
};

export enum TodoCategory {
  Grocery = 'Grocery',
  Work = 'Work',
  Sport = 'Sport',
  Design = 'Design',
  University = 'University',
  Social = 'Social',
  Music = 'Music',
  Health = 'Health',
  Movie = 'Movie',
  Home = 'Home',
}

export type Todo = {
  id: string; // uuid
  title: string;
  description?: string;

  // Attachments
  attachments?: Array<string>;

  // Date & time
  dueDate: number; // timestamp (ms)
  todoTime?: string; // "16:45" (UI-friendly)
  timezone: string; // important for notifications

  priority: PriorityLevel;
  status: TodoStatus;

  categoryId: string; // FK -> Category.id
  category?: Category; // Populated category

  // Hierarchy
  parentId?: string | null; // for sub-tasks

  // Flags
  isCompleted: boolean;
  hasSubTasks: boolean;

  // optional tags, recurrence & sync metadata
  tags?: string[];
  recurrence?: string | null; // rrule or simple recurrence expression

  // sync metadata (helpful when synchronizing with remote)
  syncStatus?: 'PENDING' | 'SYNCED' | 'ERROR';
  syncedAt?: number | null;
  version?: number; // incremented on each local update for conflict resolution

  // Sync & lifecycle
  createdAt: number;
  updatedAt: number;
  completedAt?: number | null;
  deletedAt?: number | null; // SOFT DELETE

  // Derived helpers (optional but useful)
  isOverdue?: boolean;

  // Notifications
  notificationId?: string;
};

// Why todoTime + dueDate?
// 	•	dueDate → sorting, calendar, notifications
// 	•	todoTime → UI formatting & editing

export type TodoAttachment = {
  id: string;
  todoId: string; // FK -> Todo.id
  type: AttachmentType; // IMAGE
  uri: string; // local file path
  thumbnailUri?: string;

  createdAt: number;
  deletedAt?: number | null; // soft delete
};

export type TodoNotification = {
  id: string;
  todoId: string;

  fireAt: number; // timestamp
  platformId?: string; // iOS/Android notification id

  status: NotificationStatus;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
};

export type AppSettings = {
  notificationsEnabled: boolean;
  defaultPriority: PriorityLevel;
  startWeekOnMonday: boolean;

  createdAt: number;
  updatedAt: number;
};

// MMKV_KEYS = {
//   TODOS: 'todos', // Record<string, Todo>
//   CATEGORIES: 'categories', // Record<string, Category>
//   ATTACHMENTS: 'attachments', // Record<string, TodoAttachment>
//   NOTIFICATIONS: 'notifications', // Record<string, TodoNotification>
//   SETTINGS: 'settings',
// };

// getActiveTodos()
// getTodosByCategory(categoryId)
// getTodosForDate(date)
// getOverdueTodos()
// getSubTasks(todoId)
