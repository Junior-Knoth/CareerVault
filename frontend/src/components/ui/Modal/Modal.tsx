import './Modal.scss';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.body.classList.add('noScroll');
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('noScroll');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modalOverlay" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modalHeader">
          <h2 id="modal-title">{title}</h2>
          <button className="modalClose" type="button" onClick={onClose} aria-label="Fechar modal">
            x
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
