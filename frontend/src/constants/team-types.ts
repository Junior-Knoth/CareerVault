export type TeamType = 'club' | 'national_team';

export const teamTypeOptions: { value: TeamType; label: string }[] = [
  { value: 'club', label: 'Clube' },
  { value: 'national_team', label: 'Selecao' },
];

export function getTeamTypeLabel(teamType: TeamType) {
  return teamTypeOptions.find((option) => option.value === teamType)?.label ?? teamType;
}
