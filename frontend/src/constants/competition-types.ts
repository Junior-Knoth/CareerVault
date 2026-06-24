export const competitionTypeOptions = [
  { value: 'league', label: 'Liga' },
  { value: 'cup', label: 'Copa' },
  { value: 'continental', label: 'Continental' },
  { value: 'world', label: 'Mundial' },
  { value: 'super_cup', label: 'Supercopa' },
  { value: 'friendly', label: 'Amistoso' },
] as const;

export type CompetitionType = (typeof competitionTypeOptions)[number]['value'];

export function getCompetitionTypeLabel(competitionType: string | null | undefined) {
  if (!competitionType) {
    return '';
  }

  return (
    competitionTypeOptions.find((option) => option.value === competitionType)?.label ??
    competitionType
  );
}
