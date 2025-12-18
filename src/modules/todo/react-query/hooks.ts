import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoRepository } from '../../todo/repository/todo-repository';
import { todosKeys } from './keys';
import { Todo } from '../../todo/types/todo.types';
import { withLoading } from '../../../app/services/reactQuery/mutationHelpers';
import { useDispatch } from 'react-redux';

export const useTodos = () => {
  return useQuery<Todo[]>({
    queryKey: todosKeys.all(),
    queryFn: () => todoRepository.getAll(),
  });
};

export const useTodosByDate = (date: number) => {
  return useQuery<Todo[]>({
    queryKey: todosKeys.listByDate(date),
    queryFn: () => todoRepository.getForDate(date),
  });
};

export const useTodo = (id?: string) => {
  return useQuery<Todo | null>({
    queryKey: todosKeys.details(id ?? ''),
    queryFn: () => (id ? todoRepository.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

export const useCreateTodo = () => {
  const qc = useQueryClient();
  return useMutation<Todo, any, Partial<Todo>>({
    mutationFn: payload => todoRepository.create(payload),
    onSuccess: todo => {
      qc.invalidateQueries({ queryKey: todosKeys.all() });
      qc.setQueryData(todosKeys.details(todo.id), todo);
    },
  });
};

export const useUpdateTodo = () => {
  const qc = useQueryClient();
  return useMutation<Todo | null, any, { id: string; patch: Partial<Todo> }>({
    mutationFn: ({ id, patch }) => todoRepository.update(id, patch),
    onSuccess: updated => {
      if (updated) {
        qc.invalidateQueries({ queryKey: todosKeys.all() });
        qc.setQueryData(todosKeys.details(updated.id), updated);
      }
    },
  });
};

export const useDeleteTodo = () => {
  const qc = useQueryClient();
  return useMutation<void, any, string>({
    mutationFn: id => todoRepository.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: todosKeys.all() }),
  });
};

export default useTodos;
