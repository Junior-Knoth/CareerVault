export const playerStatDefinitions = [
  { key: 'appearances', label: 'Jogos', shortLabel: 'J', format: 'integer' },
  { key: 'starts', label: 'Titularidades', shortLabel: 'Tit', format: 'integer' },
  { key: 'minutes', label: 'Minutos', shortLabel: 'Min', format: 'integer' },
  { key: 'goals', label: 'Gols', shortLabel: 'G', format: 'integer' },
  { key: 'assists', label: 'Assistencias', shortLabel: 'A', format: 'integer' },
  { key: 'clean_sheets', label: 'Jogos sem sofrer gol', shortLabel: 'SG', format: 'integer' },
  { key: 'yellow_cards', label: 'Cartoes amarelos', shortLabel: 'CA', format: 'integer' },
  { key: 'red_cards', label: 'Cartoes vermelhos', shortLabel: 'CV', format: 'integer' },
  { key: 'average_rating', label: 'Nota media', shortLabel: 'Nota', format: 'decimal' },
] as const;

export type PlayerStatKey = (typeof playerStatDefinitions)[number]['key'];
export type PlayerStatFormat = (typeof playerStatDefinitions)[number]['format'];

export function getPlayerStatDefinition(statKey: string | null | undefined) {
  if (!statKey) {
    return undefined;
  }

  return playerStatDefinitions.find((stat) => stat.key === statKey);
}

export function getPlayerStatLabel(statKey: string | null | undefined) {
  return getPlayerStatDefinition(statKey)?.label ?? statKey ?? '';
}
