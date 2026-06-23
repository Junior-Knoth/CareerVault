import { useCallback, useMemo, useState } from 'react';
import ToastContainer from './ToastContainer';
import { ToastContext } from './ToastContext';
import type { ToastInput, ToastMessage } from './types';

interface ToastProviderProps {
  children: React.ReactNode;
}

const DEFAULT_TOAST_DURATION = 5000;

function createToastId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: ToastInput) => {
      const id = createToastId();
      const duration = toast.duration ?? DEFAULT_TOAST_DURATION;

      setToasts((currentToasts) => [...currentToasts, { ...toast, id, duration }]);

      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast],
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, clearToasts }),
    [toasts, addToast, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}
