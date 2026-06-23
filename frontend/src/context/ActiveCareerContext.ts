import { createContext } from 'react';
import type { Save } from '../types/save';
import type { Team } from '../types/team';

export interface ActiveCareerContextValue {
  saves: Save[];
  teams: Team[];
  activeSave: Save | null;
  activeTeam: Team | null;
  activeSaveId: string;
  activeTeamId: string;
  isLoading: boolean;
  setActiveSaveId: (saveId: string) => void;
  setActiveTeamId: (teamId: string) => void;
  refreshSaves: () => Promise<void>;
  refreshTeams: (saveId?: string) => Promise<void>;
}

export const ActiveCareerContext = createContext<ActiveCareerContextValue | null>(null);
