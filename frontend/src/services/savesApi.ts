import { requestJson } from './api';
import type { Save, SavePayload } from '../types/save';

export function listSaves() {
  return requestJson<Save[]>('/saves/');
}

export function createSave(payload: SavePayload) {
  return requestJson<Save>('/saves/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateSave(saveId: number, payload: Partial<SavePayload>) {
  return requestJson<Save>(`/saves/${saveId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteSave(saveId: number) {
  return requestJson<void>(`/saves/${saveId}`, {
    method: 'DELETE',
  });
}
