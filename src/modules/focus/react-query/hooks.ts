import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { focusRepository, FocusSession, FocusStats } from '../repository';
import { focusKeys } from './keys';
import { useDispatch } from 'react-redux';
import { startFocusMode, stopFocusMode } from '../store/focusSlice';
import { useEffect, useState } from 'react';

export const useActiveSession = () => {
  return useQuery<FocusSession | null>({
    queryKey: focusKeys.activeSession(),
    queryFn: () => focusRepository.getActiveSession(),
    refetchInterval: data => {
      // Stop polling when no active session to save battery
      if (!data) return false;

      // Poll every 10 seconds to check for expiration
      // UI timer handles per-second countdown separately
      return 10000;
    },
    staleTime: 5000,
  });
};

export const useFocusTimer = () => {
  const { data: session } = useActiveSession();
  const qc = useQueryClient();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (!session) return;

    // Immediately sync currentTime when session changes
    setCurrentTime(Date.now());

    // Local timer for smooth UI countdown
    const timerId = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      // Client-side expiration check
      if (now >= session.endTime) {
        clearInterval(timerId);
        // Trigger manual refetch to cleanup expired session
        qc.invalidateQueries({ queryKey: focusKeys.activeSession() });
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [session, qc]);

  if (!session) return null;

  const remainingSeconds = Math.max(
    0,
    Math.floor((session.endTime - currentTime) / 1000),
  );

  const progress =
    session.duration > 0 ? 1 - remainingSeconds / session.duration : 0;

  return {
    session,
    remainingSeconds,
    progress,
    totalSeconds: session.duration,
  };
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
