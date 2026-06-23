import { Route, Routes } from 'react-router-dom';
import { navigationItems } from './constants/navigation';
import { AppShell } from './layout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import PlaceholderPage from './pages/PlaceholderPage';
import SavesPage from './pages/SavesPage';

function App() {
  const placeholderItems = navigationItems.filter((item) => !['/', '/saves'].includes(item.path));

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/saves" element={<SavesPage />} />
        {placeholderItems.map((item) => (
          <Route key={item.id} path={item.path} element={<PlaceholderPage item={item} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
