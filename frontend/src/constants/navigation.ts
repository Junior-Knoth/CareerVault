export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    id: 'overview',
    label: 'Visao geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
      { id: 'seasons', label: 'Temporadas', href: '#seasons' },
    ],
  },
  {
    id: 'club',
    label: 'Clube',
    items: [
      { id: 'squad', label: 'Elenco', href: '#squad' },
      { id: 'players', label: 'Jogadores', href: '#players' },
      { id: 'academy', label: 'Academia', href: '#academy' },
      { id: 'club-matches', label: 'Partidas', href: '#club-matches' },
      { id: 'competitions', label: 'Competicoes', href: '#competitions' },
      { id: 'trophies', label: 'Trofeus', href: '#trophies' },
      { id: 'transfers', label: 'Transferencias', href: '#transfers' },
    ],
  },
  {
    id: 'national-teams',
    label: 'Selecoes',
    items: [
      { id: 'national-teams', label: 'Equipes nacionais', href: '#national-teams' },
      { id: 'callups', label: 'Convocacoes', href: '#callups' },
      { id: 'national-matches', label: 'Partidas', href: '#national-matches' },
      { id: 'national-stats', label: 'Estatisticas', href: '#national-stats' },
    ],
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    items: [
      { id: 'comparison', label: 'Comparador', href: '#comparison' },
      { id: 'rankings', label: 'Rankings', href: '#rankings' },
      { id: 'import-data', label: 'Importar dados', href: '#import-data' },
    ],
  },
  {
    id: 'settings',
    label: 'Configuracoes',
    items: [{ id: 'settings', label: 'Configuracoes', href: '#settings' }],
  },
];
