import { requestJson } from './api';
import type { PlayerStatus } from '../constants/player-status';
import type { Player, PlayerDuplicateCheck, PlayerPayload } from '../types/player';

interface ListPlayersParams {
  saveId?: number;
  status?: PlayerStatus;
  nationality?: string;
  search?: string;
}

export function listPlayers(params: ListPlayersParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.saveId) {
    searchParams.set('save_id', String(params.saveId));
  }

  if (params.status) {
    searchParams.set('status', params.status);
  }

  if (params.nationality) {
    searchParams.set('nationality', params.nationality);
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  const queryString = searchParams.toString();

  return requestJson<Player[]>(`/players/${queryString ? `?${queryString}` : ''}`);
}

export function createPlayer(payload: PlayerPayload) {
  return requestJson<Player>('/players/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getPlayer(playerId: number) {
  return requestJson<Player>(`/players/${playerId}`);
}

export function checkPlayerDuplicates(params: {
  saveId: number;
  fullName: string;
  excludePlayerId?: number;
}) {
  const searchParams = new URLSearchParams({
    save_id: String(params.saveId),
    full_name: params.fullName,
  });

  if (params.excludePlayerId) {
    searchParams.set('exclude_player_id', String(params.excludePlayerId));
  }

  return requestJson<PlayerDuplicateCheck>(`/players/duplicates?${searchParams.toString()}`);
}

export function updatePlayer(playerId: number, payload: Partial<PlayerPayload>) {
  return requestJson<Player>(`/players/${playerId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deletePlayer(playerId: number) {
  return requestJson<void>(`/players/${playerId}`, {
    method: 'DELETE',
  });
}
