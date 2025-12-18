export const todosKeys = {
  all: () => ['todos'] as const,
  lists: () => [...todosKeys.all(), 'list'] as const,
  listByDate: (date: number) => [...todosKeys.lists(), { date }] as const,
  details: (id: string) => [...todosKeys.all(), 'detail', id] as const,
};
