import './Drawer.scss';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export default function Drawer({ isOpen, onClose, title, children, width = '400px' }: DrawerProps) {
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
    <div className="drawerOverlay" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        style={{ width }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawerHeader">
          <h2 id="drawer-title">{title}</h2>
          <button className="drawerClose" type="button" onClick={onClose} aria-label="Fechar painel">
            x
          </button>
        </div>
        <div className="drawerBody">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}
