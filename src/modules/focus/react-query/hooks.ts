import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { focusRepository, FocusSession, FocusStats } from '../repository';
import { focusKeys } from './keys';
import { useDispatch } from 'react-redux';
import { startFocusMode, stopFocusMode } from '../store/focusSlice';

export const useActiveSession = () => {
  return useQuery<FocusSession | null>({
    queryKey: focusKeys.activeSession(),
    queryFn: () => focusRepository.getActiveSession(),
    refetchInterval: 1000, // Refetch every second to keep timer updated
  });
};

export const useFocusStats = () => {
  return useQuery<FocusStats>({
    queryKey: focusKeys.stats(),
    queryFn: () => focusRepository.getStats(),
  });
};

export const useStartFocus = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<FocusSession, any, number>({
    mutationFn: (duration: number) => focusRepository.createSession(duration),
    onSuccess: session => {
      qc.setQueryData(focusKeys.activeSession(), session);
      dispatch(
        startFocusMode({
          duration: session.duration,
          startTime: session.startTime,
          endTime: session.endTime,
        }),
      );
    },
  });
};

export const useStopFocus = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, any, { completed: boolean }>({
    mutationFn: async ({ completed }) => {
      const session = await focusRepository.getActiveSession();
      if (session) {
        await focusRepository.completeSession(session.id, completed);
      }
    },
    onSuccess: () => {
      qc.setQueryData(focusKeys.activeSession(), null);
      qc.invalidateQueries({ queryKey: focusKeys.stats() });
      dispatch(stopFocusMode());
    },
  });
};

export const useCancelFocus = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation<void, any, void>({
    mutationFn: () => focusRepository.cancelActiveSession(),
    onSuccess: () => {
      qc.setQueryData(focusKeys.activeSession(), null);
      dispatch(stopFocusMode());
    },
  });
};
