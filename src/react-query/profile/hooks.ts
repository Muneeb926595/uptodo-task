import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileRepository } from '../../repository/profile';
import { profileKeys } from './keys';
import { UserProfile } from '../../types/profile.types';

export const useProfile = () => {
  return useQuery<UserProfile | null>({
    queryKey: profileKeys.details(),
    queryFn: () => profileRepository.getProfile(),
  });
};

export const useAppLockStatus = () => {
  return useQuery<boolean>({
    queryKey: profileKeys.appLock(),
    queryFn: () => profileRepository.isAppLockEnabled(),
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation<UserProfile | null, any, Partial<UserProfile>>({
    mutationFn: payload => profileRepository.updateProfile(payload),
    onSuccess: updated => {
      if (updated) {
        qc.setQueryData(profileKeys.details(), updated);
        qc.invalidateQueries({ queryKey: profileKeys.all() });
      }
    },
  });
};

export const useEnableAppLock = () => {
  const qc = useQueryClient();
  return useMutation<void, any, string>({
    mutationFn: biometricType => profileRepository.enableAppLock(biometricType),
    onSuccess: () => {
      qc.setQueryData(profileKeys.appLock(), true);
      qc.invalidateQueries({ queryKey: profileKeys.all() });
    },
  });
};

export const useDisableAppLock = () => {
  const qc = useQueryClient();
  return useMutation<void, any, void>({
    mutationFn: () => profileRepository.disableAppLock(),
    onSuccess: () => {
      qc.setQueryData(profileKeys.appLock(), false);
      qc.invalidateQueries({ queryKey: profileKeys.all() });
    },
  });
};
