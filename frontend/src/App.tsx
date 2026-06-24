import { Route, Routes } from 'react-router-dom';
import { navigationItems } from './constants/navigation';
import { AppShell } from './layout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import PlaceholderPage from './pages/PlaceholderPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import PlayersPage from './pages/PlayersPage';
import SavesPage from './pages/SavesPage';
import TeamsPage from './pages/TeamsPage';

function App() {
  const placeholderItems = navigationItems.filter(
    (item) => !['/', '/saves', '/equipes', '/clube/jogadores'].includes(item.path),
  );

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/saves" element={<SavesPage />} />
        <Route path="/equipes" element={<TeamsPage />} />
        <Route path="/clube/jogadores" element={<PlayersPage />} />
        <Route path="/clube/jogadores/:playerId" element={<PlayerProfilePage />} />
        {placeholderItems.map((item) => (
          <Route key={item.id} path={item.path} element={<PlaceholderPage item={item} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
