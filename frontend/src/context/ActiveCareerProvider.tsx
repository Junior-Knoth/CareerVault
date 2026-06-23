import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActiveCareerContext } from './ActiveCareerContext';
import { listSaves } from '../services/savesApi';
import { listTeams } from '../services/teamsApi';
import type { Save } from '../types/save';
import type { Team } from '../types/team';

interface ActiveCareerProviderProps {
  children: React.ReactNode;
}

const ACTIVE_SAVE_STORAGE_KEY = 'careervault.activeSaveId';
const ACTIVE_TEAM_STORAGE_KEY = 'careervault.activeTeamId';

function readStoredValue(key: string) {
  return window.localStorage.getItem(key) ?? '';
}

export function ActiveCareerProvider({ children }: ActiveCareerProviderProps) {
  const [saves, setSaves] = useState<Save[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeSaveId, setActiveSaveIdState] = useState(() =>
    readStoredValue(ACTIVE_SAVE_STORAGE_KEY),
  );
  const [activeTeamId, setActiveTeamIdState] = useState(() =>
    readStoredValue(ACTIVE_TEAM_STORAGE_KEY),
  );
  const [isLoading, setIsLoading] = useState(true);

  const activeSave = useMemo(
    () => saves.find((save) => String(save.id) === activeSaveId) ?? null,
    [saves, activeSaveId],
  );

  const activeTeam = useMemo(
    () => teams.find((team) => String(team.id) === activeTeamId) ?? null,
    [teams, activeTeamId],
  );

  const setActiveSaveId = useCallback((saveId: string) => {
    setActiveSaveIdState(saveId);
    setActiveTeamIdState('');

    if (saveId) {
      window.localStorage.setItem(ACTIVE_SAVE_STORAGE_KEY, saveId);
    } else {
      window.localStorage.removeItem(ACTIVE_SAVE_STORAGE_KEY);
    }

    window.localStorage.removeItem(ACTIVE_TEAM_STORAGE_KEY);
  }, []);

  const setActiveTeamId = useCallback((teamId: string) => {
    setActiveTeamIdState(teamId);

    if (teamId) {
      window.localStorage.setItem(ACTIVE_TEAM_STORAGE_KEY, teamId);
    } else {
      window.localStorage.removeItem(ACTIVE_TEAM_STORAGE_KEY);
    }
  }, []);

  const refreshSaves = useCallback(async () => {
    const loadedSaves = await listSaves();
    setSaves(loadedSaves);

    const storedSaveExists = loadedSaves.some((save) => String(save.id) === activeSaveId);

    if (!storedSaveExists) {
      const nextSaveId = loadedSaves[0] ? String(loadedSaves[0].id) : '';
      setActiveSaveId(nextSaveId);
    }
  }, [activeSaveId, setActiveSaveId]);

  const refreshTeams = useCallback(
    async (saveId = activeSaveId) => {
      if (!saveId) {
        setTeams([]);
        setActiveTeamId('');
        return;
      }

      const loadedTeams = await listTeams({ saveId: Number(saveId) });
      setTeams(loadedTeams);

      const storedTeamExists = loadedTeams.some((team) => String(team.id) === activeTeamId);

      if (!storedTeamExists) {
        const nextTeamId = loadedTeams[0] ? String(loadedTeams[0].id) : '';
        setActiveTeamId(nextTeamId);
      }
    },
    [activeSaveId, activeTeamId, setActiveTeamId],
  );

  useEffect(() => {
    async function loadInitialContext() {
      setIsLoading(true);

      try {
        await refreshSaves();
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialContext();
  }, [refreshSaves]);

  useEffect(() => {
    async function loadTeamsForActiveSave() {
      await refreshTeams(activeSaveId);
    }

    loadTeamsForActiveSave();
  }, [activeSaveId, refreshTeams]);

  const value = useMemo(
    () => ({
      saves,
      teams,
      activeSave,
      activeTeam,
      activeSaveId,
      activeTeamId,
      isLoading,
      setActiveSaveId,
      setActiveTeamId,
      refreshSaves,
      refreshTeams,
    }),
    [
      saves,
      teams,
      activeSave,
      activeTeam,
      activeSaveId,
      activeTeamId,
      isLoading,
      setActiveSaveId,
      setActiveTeamId,
      refreshSaves,
      refreshTeams,
    ],
  );

  return <ActiveCareerContext.Provider value={value}>{children}</ActiveCareerContext.Provider>;
}
