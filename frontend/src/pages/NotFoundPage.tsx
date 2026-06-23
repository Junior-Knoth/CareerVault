import { Link } from 'react-router-dom';
import { EmptyState, PageHeader, Panel } from '../components/ui';
import './Page.scss';

export default function NotFoundPage() {
  return (
    <div className="page">
      <PageHeader
        title="Pagina nao encontrada"
        subtitle="A rota solicitada nao existe no CareerVault."
      />

      <Panel>
        <EmptyState
          message="Nada registrado aqui"
          description="Volte ao dashboard para continuar navegando pela estrutura principal."
          action={
            <Link className="pageActionLink" to="/">
              Voltar ao dashboard
            </Link>
          }
        />
      </Panel>
    </div>
  );
}
