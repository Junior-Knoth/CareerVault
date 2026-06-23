export type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
  duration?: number;
}

export type ToastInput = Omit<ToastMessage, 'id'>;

export interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}
