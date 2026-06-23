export interface Save {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  accent_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
}

export interface SavePayload {
  name: string;
  slug?: string | null;
  description?: string | null;
  accent_color: string;
  secondary_color: string;
}
