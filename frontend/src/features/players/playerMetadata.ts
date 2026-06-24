import type { Player } from '../../types/player';

export function getImportedPlayerPosition(player: Player) {
  return player.notes?.match(/POS:\s*([^;]+)/)?.[1]?.trim() ?? '';
}

export function getImportedPlayerAltPosition(player: Player) {
  return player.notes?.match(/Alt\. POS:\s*([^;]+)/)?.[1]?.trim() ?? '';
}

export function getImportedSquadNumber(player: Player) {
  return player.notes?.match(/Numero:\s*([^;]+)/)?.[1]?.trim() ?? '';
}
