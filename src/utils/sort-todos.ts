import { Todo } from '../types';
import { TodoSortOption } from '../views/screens/todo/components';

export const sortTodos = (
  todos: Todo[],
  sortOption: TodoSortOption,
): Todo[] => {
  if (!todos || todos.length === 0) return [];

  const todosCopy = [...todos];

  switch (sortOption) {
    case TodoSortOption.PRIORITY_HIGH_LOW:
      return todosCopy.sort((a, b) => {
        // Higher number = higher priority
        return (b.priority || 0) - (a.priority || 0);
      });

    case TodoSortOption.PRIORITY_LOW_HIGH:
      return todosCopy.sort((a, b) => {
        // Lower number = lower priority
        return (a.priority || 0) - (b.priority || 0);
      });

    case TodoSortOption.DATE_NEWEST:
      return todosCopy.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

    case TodoSortOption.DATE_OLDEST:
      return todosCopy.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB;
      });

    case TodoSortOption.TITLE_A_Z:
      return todosCopy.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      });

    case TodoSortOption.TITLE_Z_A:
      return todosCopy.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleB.localeCompare(titleA);
      });

    case TodoSortOption.DEFAULT:
    default:
      return todosCopy;
  }
};
