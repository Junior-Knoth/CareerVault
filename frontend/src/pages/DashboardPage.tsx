import { useEffect, useState } from 'react';
import { Badge, EmptyState, LoadingState, PageHeader, Panel } from '../components/ui';
import { useActiveCareer } from '../context';
import { getHealth } from '../services/api';
import './Page.scss';

export default function DashboardPage() {
  const { activeSave, activeTeam } = useActiveCareer();
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
    <div className="page">
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

      <Panel title="Contexto ativo">
        {activeSave ? (
          <EmptyState
            message={activeSave.name}
            description={
              activeTeam
                ? `Equipe ativa: ${activeTeam.name}`
                : 'Nenhuma equipe ativa selecionada para este save.'
            }
          />
        ) : (
          <EmptyState
            message="Nenhum save ativo"
            description="Crie ou selecione um save para carregar equipes e futuros dados de carreira."
          />
        )}
      </Panel>
    </div>
  );
}
