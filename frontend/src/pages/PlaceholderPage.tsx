import { Badge, EmptyState, PageHeader, Panel } from '../components/ui';
import type { NavigationItem } from '../constants/navigation';
import './Page.scss';

interface PlaceholderPageProps {
  item: NavigationItem;
}

export default function PlaceholderPage({ item }: PlaceholderPageProps) {
  return (
    <div className="page">
      <PageHeader
        title={item.label}
        subtitle={item.description}
        actions={<Badge variant="info">Modulo futuro</Badge>}
      />

      <Panel title="Em preparacao">
        <EmptyState
          message={`${item.label} ainda nao foi implementado`}
          description="Esta rota ja existe para estabilizar a navegacao enquanto os CRUDs e fluxos de dominio entram nas proximas fases."
        />
      </Panel>
    </div>
  );
}
