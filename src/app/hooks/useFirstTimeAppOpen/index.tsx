import { useEffect, useState } from 'react';
import { StorageKeys, storageService } from '../../../modules/services/storage';

export const useFirstTimeAppOpen = () => {
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const isFirstTimeValue = await storageService.getItem(
          StorageKeys.IS_APP_OPEND_FIRSTTIME,
        );

        if (!isFirstTimeValue) {
          setIsFirstTime(true);
          await storageService.setItem(
            StorageKeys.IS_APP_OPEND_FIRSTTIME,
            'false',
          );
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error while checking first-time status:', error);
      }
    };

    checkFirstTime();
  }, []);

  return isFirstTime;
};
