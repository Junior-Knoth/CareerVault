export const playerStatusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'loaned', label: 'Emprestado' },
  { value: 'sold', label: 'Vendido' },
  { value: 'retired', label: 'Aposentado' },
  { value: 'archived', label: 'Arquivado' },
] as const;

export type PlayerStatus = (typeof playerStatusOptions)[number]['value'];

export function getPlayerStatusLabel(status: string | null | undefined) {
  if (!status) {
    return '';
  }

  return playerStatusOptions.find((option) => option.value === status)?.label ?? status;
}
