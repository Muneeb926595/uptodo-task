import { useEffect, useState } from 'react';
import StorageHelper, { StorageKeys } from '../../data/mmkv-storage';

export const useFirstTimeVisit = (storageKey: StorageKeys) => {
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    async function checkIfFirstTime() {
      const hasVisited = await StorageHelper.getItem(storageKey);

      if (!hasVisited) {
        await StorageHelper.setItem(storageKey, 'true');
        setIsFirstTime(true);
      }
    }

    checkIfFirstTime();
  }, [storageKey]);

  return isFirstTime;
};
