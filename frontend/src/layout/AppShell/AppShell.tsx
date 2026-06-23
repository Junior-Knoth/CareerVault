import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './AppShell.scss';
import Select from '../../components/ui/Select/Select';
import { navigationSections } from '../../constants/navigation';
import { useActiveCareer } from '../../context';
import { classNames } from '../../utils/classNames';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    saves,
    teams,
    activeSaveId,
    activeTeamId,
    isLoading,
    setActiveSaveId,
    setActiveTeamId,
  } = useActiveCareer();

  const saveOptions = saves.map((save) => ({ value: String(save.id), label: save.name }));
  const teamOptions = teams.map((team) => ({ value: String(team.id), label: team.name }));

  function handleNavigate() {
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
        <Link className="appSidebarBrand" to="/" onClick={handleNavigate}>
          <span className="appSidebarMark" aria-hidden="true">
            CV
          </span>
          <div>
            <strong>CareerVault</strong>
            <span>Arquivo de carreira</span>
          </div>
        </Link>

        <nav className="appSidebarNav">
          {navigationSections.map((section) => (
            <section className="appSidebarSection" key={section.id}>
              <h2>{section.label}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      className={({ isActive }) =>
                        classNames('appSidebarLink', isActive && 'appSidebarLink--active')
                      }
                      to={item.path}
                      onClick={handleNavigate}
                    >
                      {item.label}
                    </NavLink>
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
            <label className="appContextField" htmlFor="active-save">
              <span>Save</span>
              <Select
                id="active-save"
                value={activeSaveId}
                onChange={setActiveSaveId}
                options={saveOptions}
                placeholder="Nenhum save"
                disabled={isLoading || saves.length === 0}
              />
            </label>

            <label className="appContextField" htmlFor="active-team">
              <span>Equipe</span>
              <Select
                id="active-team"
                value={activeTeamId}
                onChange={setActiveTeamId}
                options={teamOptions}
                placeholder="Nenhuma equipe"
                disabled={isLoading || !activeSaveId || teams.length === 0}
              />
            </label>

            <div className="appContextStatic">
              <span>Temporada</span>
              <strong>Nenhuma</strong>
            </div>
          </div>
        </header>

        <main className="appShellContent">{children}</main>
      </div>
    </div>
  );
}
