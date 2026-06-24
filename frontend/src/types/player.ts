export type PreferredFoot = 'right' | 'left' | 'both';

export interface Player {
  id: number;
  save_id: number;
  full_name: string;
  short_name: string | null;
  normalized_name: string;
  birth_date: string | null;
  nationality: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  preferred_foot: PreferredFoot | null;
  academy_origin: boolean;
  status: string;
  photo_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerPayload {
  save_id: number;
  full_name: string;
  short_name?: string | null;
  birth_date?: string | null;
  nationality?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  preferred_foot?: PreferredFoot | null;
  academy_origin?: boolean;
  status?: string;
  photo_path?: string | null;
  notes?: string | null;
}
