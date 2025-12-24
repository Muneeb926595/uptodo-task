export const categoriesKeys = {
  all: () => ['categories'] as const,
  detail: (id: string) => [...categoriesKeys.all(), 'detail', id] as const,
};
