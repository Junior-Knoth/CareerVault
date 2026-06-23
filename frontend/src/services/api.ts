import type { HealthResponse } from '../types/health';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined in the environment variables');
}

export async function requestJson<TData>(path: string, init?: RequestInit): Promise<TData> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as TData;
  }

  return response.json() as Promise<TData>;
}

export function getHealth() {
  return requestJson<HealthResponse>('/health');
}
