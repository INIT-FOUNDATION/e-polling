import React, { createContext } from 'react';
import { showNotification, hideNotification } from '@mantine/notifications';

interface ToastContextType {
  showToast: (message: string, title?: string, type?: 'default' | 'success' | 'error' | 'warning') => void;
  hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showToast = (message: string, title?: string, type: 'default' | 'success' | 'error' | 'warning' = 'default', autoClose = 3000) => {
    showNotification({
      title,
      message,
      color: type,
      autoClose,
    });
  };

  const hideToast = (id: string) => {
    hideNotification(id);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};
