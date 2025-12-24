import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardEvents = () => {
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [keyboardSize, setKeyboardSize] = useState(0);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  const _keyboardDidShow = (e: any) => {
    setIsKeyboardShow(true);
    setKeyboardSize(Math.round(e?.endCoordinates?.height));
  };

  const _keyboardDidHide = () => {
    setIsKeyboardShow(false);
    setKeyboardSize(0);
  };

  return [isKeyboardShow, keyboardSize];
};
