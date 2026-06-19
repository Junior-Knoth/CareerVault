import type { HealthResponse } from '../types/health';

// Obtém ViTE_API_URL do .env.local que está na pasta anterior
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined in the environment variables');
}

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error(`Failed to fetch health status: ${response.statusText}`);
  }

  const data: HealthResponse = await response.json();

  return data;
}
