// Category types - only category-specific types belong here
// Todo-related types (TodoStatus, AttachmentType, etc.) are in todo.types.ts

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
