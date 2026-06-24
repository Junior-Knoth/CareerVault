export const playerPositions = [
  { value: 'GL', label: 'Goleiro', group: 'goalkeeper' },
  { value: 'LE', label: 'Lateral esquerdo', group: 'defense' },
  { value: 'ZAG', label: 'Zagueiro', group: 'defense' },
  { value: 'LD', label: 'Lateral direito', group: 'defense' },
  { value: 'VOL', label: 'Volante', group: 'midfield' },
  { value: 'MC', label: 'Meio-campista', group: 'midfield' },
  { value: 'MEI', label: 'Meia', group: 'midfield' },
  { value: 'ME', label: 'Meia esquerda', group: 'attack' },
  { value: 'PE', label: 'Ponta esquerda', group: 'attack' },
  { value: 'MD', label: 'Meia direita', group: 'attack' },
  { value: 'PD', label: 'Ponta direita', group: 'attack' },
  { value: 'ATA', label: 'Atacante', group: 'attack' },
] as const;

export type PlayerPosition = (typeof playerPositions)[number]['value'];
export type PlayerPositionGroup = (typeof playerPositions)[number]['group'];

export const playerPositionSelectOptions = playerPositions.map((position) => ({
  value: position.value,
  label: `${position.value} - ${position.label}`,
}));

export function getPlayerPosition(positionValue: string | null | undefined) {
  if (!positionValue) {
    return undefined;
  }

  return playerPositions.find((position) => position.value === positionValue);
}

export function getPlayerPositionLabel(positionValue: string | null | undefined) {
  const position = getPlayerPosition(positionValue);

  return position ? `${position.value} - ${position.label}` : (positionValue ?? '');
}
