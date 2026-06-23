import type { TeamType } from '../constants/team-types';

export interface Team {
  id: number;
  save_id: number;
  name: string;
  short_name: string | null;
  abbreviation: string | null;
  team_type: TeamType;
  country: string | null;
  primary_color: string;
  secondary_color: string;
  logo_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamPayload {
  save_id: number;
  name: string;
  short_name?: string | null;
  abbreviation?: string | null;
  team_type: TeamType;
  country?: string | null;
  primary_color: string;
  secondary_color: string;
  logo_path?: string | null;
}
