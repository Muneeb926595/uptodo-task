import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../views/components/toast';

interface ToastContextType {
  showToast: (
    message: string,
    actionLabel?: string,
    onActionPress?: () => void,
  ) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [actionLabel, setActionLabel] = useState<string | undefined>();
  const [onActionPress, setOnActionPress] = useState<
    (() => void) | undefined
  >();

  const showToast = useCallback(
    (msg: string, action?: string, callback?: () => void) => {
      setMessage(msg);
      setActionLabel(action);
      setOnActionPress(() => callback);
      setVisible(true);
    },
    [],
  );

  const hideToast = useCallback(() => {
    setVisible(false);
    setMessage('');
    setActionLabel(undefined);
    setOnActionPress(undefined);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={message}
        visible={visible}
        onHide={hideToast}
        actionLabel={actionLabel}
        onActionPress={onActionPress}
        duration={5000}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
