import { requestJson } from './api';
import type { Team, TeamPayload } from '../types/team';

interface ListTeamsParams {
  saveId?: number;
  teamType?: string;
}

export function listTeams(params: ListTeamsParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.saveId) {
    searchParams.set('save_id', String(params.saveId));
  }

  if (params.teamType) {
    searchParams.set('team_type', params.teamType);
  }

  const queryString = searchParams.toString();

  return requestJson<Team[]>(`/teams/${queryString ? `?${queryString}` : ''}`);
}

export function createTeam(payload: TeamPayload) {
  return requestJson<Team>('/teams/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTeam(teamId: number, payload: Partial<TeamPayload>) {
  return requestJson<Team>(`/teams/${teamId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteTeam(teamId: number) {
  return requestJson<void>(`/teams/${teamId}`, {
    method: 'DELETE',
  });
}
