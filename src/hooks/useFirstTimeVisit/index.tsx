import { useEffect, useState } from 'react';
import { storageService, StorageKeys } from '../../services/storage';

export const useFirstTimeVisit = (storageKey: StorageKeys) => {
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    async function checkIfFirstTime() {
      const hasVisited = await storageService.getItem(storageKey);

      if (!hasVisited) {
        await storageService.setItem(storageKey, 'true');
        setIsFirstTime(true);
      }
    }

    checkIfFirstTime();
  }, [storageKey]);

  return isFirstTime;
};
