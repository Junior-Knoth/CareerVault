import './Toast.scss';
import { classNames } from '../../../utils/classNames';
import type { ToastMessage } from './types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <article
      className={classNames('toast', `toast--${toast.variant}`)}
      role="status"
      aria-live="polite"
    >
      <div className="toastContent">
        {toast.title && <strong>{toast.title}</strong>}
        <p>{toast.message}</p>
      </div>
      <button
        className="toastClose"
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificacao"
      >
        x
      </button>
    </article>
  );
}
