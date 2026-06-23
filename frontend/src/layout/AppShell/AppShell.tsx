import { useState } from 'react';
import './AppShell.scss';
import { navigationSections } from '../../constants/navigation';
import { classNames } from '../../utils/classNames';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState('dashboard');

  function handleNavigate(itemId: string) {
    setActiveItemId(itemId);
    setIsSidebarOpen(false);
  }

  return (
    <div className={classNames('appShell', isSidebarOpen && 'appShell--sidebarOpen')}>
      <button
        className="appShellOverlay"
        type="button"
        aria-label="Fechar navegacao"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className="appSidebar" aria-label="Navegacao principal">
        <div className="appSidebarBrand">
          <span className="appSidebarMark" aria-hidden="true">
            CV
          </span>
          <div>
            <strong>CareerVault</strong>
            <span>Arquivo de carreira</span>
          </div>
        </div>

        <nav className="appSidebarNav">
          {navigationSections.map((section) => (
            <section className="appSidebarSection" key={section.id}>
              <h2>{section.label}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <a
                      className={classNames(
                        'appSidebarLink',
                        activeItemId === item.id && 'appSidebarLink--active',
                      )}
                      href={item.href}
                      aria-current={activeItemId === item.id ? 'page' : undefined}
                      onClick={() => handleNavigate(item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </aside>

      <div className="appShellMain">
        <header className="appTopbar">
          <button
            className="appMenuButton"
            type="button"
            aria-label="Abrir navegacao"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(true)}
          >
            Menu
          </button>

          <div className="appContextBar" aria-label="Contexto ativo">
            <span>Save: nenhum</span>
            <span>Equipe: nenhuma</span>
            <span>Temporada: nenhuma</span>
          </div>
        </header>

        <div className="appShellContent">{children}</div>
      </div>
    </div>
  );
}
