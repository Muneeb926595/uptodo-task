import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesRepository } from '../../repository/categories';
import { categoriesKeys } from './keys';
import { Category } from '../../types/categories.types';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: categoriesKeys.all(),
    queryFn: () => categoriesRepository.getAll(),
  });
};

export const useCategory = (id?: string) => {
  return useQuery<Category | null>({
    queryKey: categoriesKeys.detail(id ?? ''),
    queryFn: () =>
      id ? categoriesRepository.getById(id) : Promise.resolve(null),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation<Category, any, Partial<Category>>({
    mutationFn: payload => categoriesRepository.create(payload),
    onSuccess: cat => {
      qc.invalidateQueries({ queryKey: categoriesKeys.all() });
      qc.setQueryData(categoriesKeys.detail(cat.id), cat);
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation<
    Category | null,
    any,
    { id: string; patch: Partial<Category> }
  >({
    mutationFn: ({ id, patch }) => categoriesRepository.update(id, patch),
    onSuccess: updated => {
      if (updated) {
        qc.invalidateQueries({ queryKey: categoriesKeys.all() });
        qc.setQueryData(categoriesKeys.detail(updated.id), updated);
      }
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation<void, any, string>({
    mutationFn: id => categoriesRepository.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriesKeys.all() }),
  });
};

export default useCategories;
