import { UseMutationOptions } from '@tanstack/react-query';
import { Dispatch } from 'react';

/**
 * Small helper to attach loading dispatch calls for mutations.
 * Usage: {...withLoading(dispatch, setLoading)} inside useMutation options.
 */
export const withLoading = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  dispatch: Dispatch<any>,
  setLoadingAction: (loading: boolean) => any,
) => {
  return {
    onMutate: () => {
      dispatch(setLoadingAction(true));
      return undefined as unknown as TContext;
    },
    onSettled: () => dispatch(setLoadingAction(false)),
  } as Partial<UseMutationOptions<TData, TError, TVariables, TContext>>;
};

// Purpose: Standardize dispatching loading state around mutations.
// Behavior: It returns onMutate and onSettled callbacks you can spread into useMutation({ ...withLoading(dispatch, setLoading), mutationFn, onSuccess }).
// Benefit: Keeps mutation options DRY and ensures consistent UI loading behavior across modules.
