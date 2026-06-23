import { useEffect, useState } from 'react';
import './App.css';
import { Badge, EmptyState, LoadingState, PageHeader, Panel } from './components/ui';
import { AppShell } from './layout';
import { getHealth } from './services/api';

function App() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    async function checkApi() {
      setStatus('loading');

      try {
        await getHealth();
        setStatus('success');
      } catch {
        setStatus('error');
      }
    }

    checkApi();
  }, []);

  return (
    <AppShell>
      <main className="app">
        <PageHeader
          title="CareerVault"
          subtitle="Base local para preservar saves, temporadas, elencos e estatisticas de carreira."
          actions={
            <Badge
              variant={status === 'success' ? 'success' : status === 'error' ? 'danger' : 'info'}
            >
              API {status === 'success' ? 'online' : status === 'error' ? 'offline' : 'checando'}
            </Badge>
          }
        />

        <Panel title="Status da aplicacao">
          {status === 'loading' && <LoadingState message="Verificando conexao com a API..." />}

          {status === 'success' && (
            <EmptyState
              message="Frontend e API conectados"
              description="A fundacao visual esta pronta para receber os proximos fluxos do CareerVault."
            />
          )}

          {status === 'error' && (
            <EmptyState
              message="API indisponivel"
              description="Inicie o backend FastAPI para ativar a verificacao de saude local."
            />
          )}
        </Panel>
      </main>
    </AppShell>
  );
}

export default App;
