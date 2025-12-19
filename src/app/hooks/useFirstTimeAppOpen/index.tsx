import { useEffect, useState } from 'react';
import { StorageKeys, storageService } from '../../../modules/services/storage';

export const useFirstTimeAppOpen = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const isFirstTimeValue = await storageService.getItem(
          StorageKeys.IS_APP_OPEND_FIRSTTIME,
        );

        if (!isFirstTimeValue) {
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error while checking first-time status:', error);
        setIsFirstTime(false); // Default to false on error
      }
    };

    checkFirstTime();
  }, []);

  return isFirstTime;
};
