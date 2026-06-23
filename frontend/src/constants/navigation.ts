export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  description: string;
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
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/',
        description: 'Visao inicial do save ativo, status da API e atalhos principais.',
      },
      {
        id: 'saves',
        label: 'Saves',
        path: '/saves',
        description: 'Crie e gerencie universos independentes de carreira.',
      },
      {
        id: 'teams',
        label: 'Equipes',
        path: '/equipes',
        description: 'Cadastre clubes e selecoes dentro de cada save.',
      },
      {
        id: 'seasons',
        label: 'Temporadas',
        path: '/temporadas',
        description: 'Cadastro e historico de temporadas por save e equipe.',
      },
    ],
  },
  {
    id: 'club',
    label: 'Clube',
    items: [
      {
        id: 'squad',
        label: 'Elenco',
        path: '/clube/elenco',
        description: 'Elenco historico da equipe por temporada.',
      },
      {
        id: 'players',
        label: 'Jogadores',
        path: '/clube/jogadores',
        description: 'Cadastro e consulta de jogadores independentes de equipe fixa.',
      },
      {
        id: 'academy',
        label: 'Academia',
        path: '/clube/academia',
        description: 'Acompanhamento de promessas e jogadores formados no clube.',
      },
      {
        id: 'club-matches',
        label: 'Partidas',
        path: '/clube/partidas',
        description: 'Registro de partidas-chave sem exigir calendario completo.',
      },
      {
        id: 'competitions',
        label: 'Competicoes',
        path: '/clube/competicoes',
        description: 'Competicoes disputadas em cada temporada.',
      },
      {
        id: 'trophies',
        label: 'Trofeus',
        path: '/clube/trofeus',
        description: 'Titulos conquistados por equipe, temporada e competicao.',
      },
      {
        id: 'transfers',
        label: 'Transferencias',
        path: '/clube/transferencias',
        description: 'Entradas, saidas, emprestimos e valores de mercado.',
      },
    ],
  },
  {
    id: 'national-teams',
    label: 'Selecoes',
    items: [
      {
        id: 'national-teams',
        label: 'Equipes nacionais',
        path: '/selecoes/equipes',
        description: 'Selecoes nacionais tratadas como equipes do save.',
      },
      {
        id: 'callups',
        label: 'Convocacoes',
        path: '/selecoes/convocacoes',
        description: 'Listas de convocados agrupadas por funcao escolhida.',
      },
      {
        id: 'national-matches',
        label: 'Partidas',
        path: '/selecoes/partidas',
        description: 'Partidas-chave e ciclos internacionais.',
      },
      {
        id: 'national-stats',
        label: 'Estatisticas',
        path: '/selecoes/estatisticas',
        description: 'Historico internacional por jogador e selecao.',
      },
    ],
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    items: [
      {
        id: 'comparison',
        label: 'Comparador',
        path: '/ferramentas/comparador',
        description: 'Comparacao de jogadores, temporadas e saves.',
      },
      {
        id: 'rankings',
        label: 'Rankings',
        path: '/ferramentas/rankings',
        description: 'Rankings configuraveis por metricas e filtros.',
      },
      {
        id: 'import-data',
        label: 'Importar dados',
        path: '/ferramentas/importar-dados',
        description: 'Entrada futura para importacao manual, JSON e CSV.',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Configuracoes',
    items: [
      {
        id: 'settings',
        label: 'Configuracoes',
        path: '/configuracoes',
        description: 'Preferencias locais, backups e portabilidade futura.',
      },
    ],
  },
];

export const navigationItems = navigationSections.flatMap((section) => section.items);
