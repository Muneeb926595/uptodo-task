import { Todo } from '../../../../types';

export const buildTodoListItems = (
  todos: Todo[],
  collapsed: {
    today: boolean;
    completed: boolean;
  },
): any[] => {
  const items: any[] = [];

  const todayTodos = todos?.filter?.(t => !t?.isCompleted && !t?.deletedAt);

  const completedTodos = todos?.filter?.(t => t?.isCompleted && !t?.deletedAt);

  // TODAY
  items.push({
    type: 'header',
    id: 'header-today',
    title: 'Today',
  });

  if (!collapsed.today) {
    todayTodos?.forEach?.(todo =>
      items.push({
        type: 'todo',
        id: todo?.id,
        todo,
      }),
    );
  }

  // COMPLETED
  items.push({
    type: 'header',
    id: 'header-completed',
    title: 'Completed',
  });

  if (!collapsed.completed) {
    completedTodos?.forEach?.(todo =>
      items.push({
        type: 'todo',
        id: todo?.id,
        todo,
      }),
    );
  }

  return items;
};
