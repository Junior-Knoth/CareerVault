import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  FormField,
  Input,
  LoadingState,
  PageHeader,
  Panel,
  Select,
  useToast,
} from '../components/ui';
import { countrySelectOptions, getCountryFlagUrl, getCountryName } from '../constants/countries';
import { getTeamTypeLabel, teamTypeOptions } from '../constants/team-types';
import { useActiveCareer } from '../context';
import { createTeam, deleteTeam, listTeams, updateTeam } from '../services/teamsApi';
import type { Team, TeamPayload } from '../types/team';
import './Page.scss';
import './TeamsPage.scss';

interface TeamFormState {
  save_id: string;
  name: string;
  short_name: string;
  abbreviation: string;
  team_type: string;
  country: string;
  primary_color: string;
  secondary_color: string;
  logo_path: string;
}

const emptyForm: TeamFormState = {
  save_id: '',
  name: '',
  short_name: '',
  abbreviation: '',
  team_type: 'club',
  country: '',
  primary_color: '#ff6f61',
  secondary_color: '#151515',
  logo_path: '',
};

function toPayload(form: TeamFormState): TeamPayload {
  return {
    save_id: Number(form.save_id),
    name: form.name.trim(),
    short_name: form.short_name.trim() || null,
    abbreviation: form.abbreviation.trim() || null,
    team_type: form.team_type === 'national_team' ? 'national_team' : 'club',
    country: form.country.trim() || null,
    primary_color: form.primary_color,
    secondary_color: form.secondary_color,
    logo_path: form.logo_path.trim() || null,
  };
}

function toForm(team: Team): TeamFormState {
  return {
    save_id: String(team.save_id),
    name: team.name,
    short_name: team.short_name ?? '',
    abbreviation: team.abbreviation ?? '',
    team_type: team.team_type,
    country: team.country ?? '',
    primary_color: team.primary_color,
    secondary_color: team.secondary_color,
    logo_path: team.logo_path ?? '',
  };
}

export default function TeamsPage() {
  const { addToast } = useToast();
  const {
    saves,
    activeSaveId,
    setActiveSaveId,
    refreshTeams,
    isLoading: isContextLoading,
  } = useActiveCareer();
  const [teams, setTeams] = useState<Team[]>([]);
  const [form, setForm] = useState<TeamFormState>(emptyForm);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingTeamId !== null;

  const saveOptions = saves.map((save) => ({ value: String(save.id), label: save.name }));

  const selectedSaveId = activeSaveId;

  const selectedSaveName = useMemo(
    () => saves.find((save) => String(save.id) === activeSaveId)?.name,
    [saves, activeSaveId],
  );

  useEffect(() => {
    async function loadTeamsForActiveSave() {
      setForm((currentForm) => ({ ...currentForm, save_id: activeSaveId }));

      if (!activeSaveId) {
        setTeams([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        setTeams(await listTeams({ saveId: Number(activeSaveId) }));
      } catch {
        setError('Nao foi possivel carregar as equipes deste save.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTeamsForActiveSave();
  }, [activeSaveId]);

  async function handleSelectSave(saveId: string) {
    setActiveSaveId(saveId);
    setEditingTeamId(null);
    setError(null);
  }

  function updateForm(field: keyof TeamFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function resetForm() {
    setForm({ ...emptyForm, save_id: activeSaveId });
    setEditingTeamId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.save_id) {
      setError('Selecione um save antes de cadastrar uma equipe.');
      return;
    }

    if (!form.name.trim()) {
      setError('Informe o nome da equipe.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingTeamId) {
        const updatedTeam = await updateTeam(editingTeamId, toPayload(form));
        setTeams((currentTeams) =>
          currentTeams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team)),
        );
        await refreshTeams(activeSaveId);
        addToast({ variant: 'success', title: 'Equipe atualizada', message: updatedTeam.name });
      } else {
        const createdTeam = await createTeam(toPayload(form));
        setTeams((currentTeams) => [...currentTeams, createdTeam]);
        await refreshTeams(activeSaveId);
        addToast({ variant: 'success', title: 'Equipe criada', message: createdTeam.name });
      }

      resetForm();
    } catch {
      setError('Nao foi possivel salvar a equipe. Verifique se o nome ja existe neste save.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(team: Team) {
    setForm(toForm(team));
    setActiveSaveId(String(team.save_id));
    setEditingTeamId(team.id);
    setError(null);
  }

  async function handleDelete() {
    if (!teamToDelete) {
      return;
    }

    try {
      await deleteTeam(teamToDelete.id);
      setTeams((currentTeams) => currentTeams.filter((team) => team.id !== teamToDelete.id));
      await refreshTeams(activeSaveId);
      addToast({ variant: 'success', title: 'Equipe excluida', message: teamToDelete.name });
    } catch {
      addToast({
        variant: 'danger',
        title: 'Erro ao excluir',
        message: 'Nao foi possivel remover a equipe.',
      });
    } finally {
      setTeamToDelete(null);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Equipes"
        subtitle="Cadastre clubes e selecoes dentro de um save sem misturar universos."
      />

      <Panel title="Save de trabalho">
        <div className="teamSaveSelector">
          <FormField label="Save" htmlFor="team-save-filter">
            <Select
              id="team-save-filter"
              value={selectedSaveId}
              onChange={handleSelectSave}
              options={saveOptions}
              placeholder="Selecione um save"
              disabled={isContextLoading || saves.length === 0}
            />
          </FormField>
          {selectedSaveName && <Badge variant="info">{selectedSaveName}</Badge>}
        </div>
      </Panel>

      <Panel title={isEditing ? 'Editar equipe' : 'Nova equipe'}>
        <form className="teamForm" onSubmit={handleSubmit}>
          <FormField label="Nome" htmlFor="team-name" required>
            <Input
              id="team-name"
              value={form.name}
              onChange={(value) => updateForm('name', value)}
              placeholder="Ex: Sunderland"
              disabled={isSubmitting || !selectedSaveId}
            />
          </FormField>

          <div className="teamFormGrid">
            <FormField label="Nome curto" htmlFor="team-short-name">
              <Input
                id="team-short-name"
                value={form.short_name}
                onChange={(value) => updateForm('short_name', value)}
                placeholder="Ex: Sunderland"
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>

            <FormField label="Sigla" htmlFor="team-abbreviation">
              <Input
                id="team-abbreviation"
                value={form.abbreviation}
                onChange={(value) => updateForm('abbreviation', value.toUpperCase())}
                placeholder="Ex: SUN"
                maxLength={12}
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>
          </div>

          <div className="teamFormGrid">
            <FormField label="Tipo" htmlFor="team-type" required>
              <Select
                id="team-type"
                value={form.team_type}
                onChange={(value) => updateForm('team_type', value)}
                options={teamTypeOptions}
                placeholder="Selecione"
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>

            <FormField label="Pais" htmlFor="team-country">
              <Select
                id="team-country"
                value={form.country}
                onChange={(value) => updateForm('country', value)}
                options={countrySelectOptions}
                placeholder="Selecione um pais"
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>
          </div>

          <div className="teamFormGrid">
            <FormField label="Cor principal" htmlFor="team-primary-color">
              <Input
                id="team-primary-color"
                type="color"
                value={form.primary_color}
                onChange={(value) => updateForm('primary_color', value)}
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>

            <FormField label="Cor secundaria" htmlFor="team-secondary-color">
              <Input
                id="team-secondary-color"
                type="color"
                value={form.secondary_color}
                onChange={(value) => updateForm('secondary_color', value)}
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>
          </div>

          <FormField label="Logo" htmlFor="team-logo-path">
            <Input
              id="team-logo-path"
              value={form.logo_path}
              onChange={(value) => updateForm('logo_path', value)}
              placeholder="Caminho local futuro"
              disabled={isSubmitting || !selectedSaveId}
            />
          </FormField>

          {error && <p className="teamError">{error}</p>}

          <div className="teamFormActions">
            {isEditing && (
              <Button variant="secondary" onClick={resetForm} disabled={isSubmitting}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || !selectedSaveId}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alteracoes' : 'Criar equipe'}
            </Button>
          </div>
        </form>
      </Panel>

      <Panel title="Equipes cadastradas">
        {isLoading && <LoadingState message="Carregando equipes..." />}

        {!isLoading && saves.length === 0 && (
          <EmptyState
            message="Nenhum save cadastrado"
            description="Crie um save antes de cadastrar clubes ou selecoes."
          />
        )}

        {!isLoading && saves.length > 0 && teams.length === 0 && (
          <EmptyState
            message="Nenhuma equipe cadastrada"
            description="Cadastre clubes e selecoes para este save."
          />
        )}

        {!isLoading && teams.length > 0 && (
          <div className="teamList">
            {teams.map((team) => (
              <article className="teamItem" key={team.id}>
                <div className="teamItemColor" style={{ backgroundColor: team.primary_color }} />
                <div className="teamItemContent">
                  <div className="teamItemHeader">
                    <h2>{team.name}</h2>
                    <Badge variant={team.team_type === 'club' ? 'default' : 'info'}>
                      {getTeamTypeLabel(team.team_type)}
                    </Badge>
                  </div>
                  {team.country && (
                    <div className="teamCountry">
                      {getCountryFlagUrl(team.country) && (
                        <img
                          src={getCountryFlagUrl(team.country)}
                          alt=""
                          loading="lazy"
                          aria-hidden="true"
                        />
                      )}
                      <span>{getCountryName(team.country)}</span>
                    </div>
                  )}
                  <p>
                    {[team.short_name, team.abbreviation]
                      .filter(Boolean)
                      .join(' / ') || 'Sem detalhes adicionais.'}
                  </p>
                </div>
                <div className="teamItemActions">
                  <Button variant="secondary" onClick={() => handleEdit(team)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => setTeamToDelete(team)}>
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <ConfirmDialog
        isOpen={teamToDelete !== null}
        onClose={() => setTeamToDelete(null)}
        onConfirm={handleDelete}
        title="Excluir equipe"
        message={`Excluir "${teamToDelete?.name ?? 'esta equipe'}"? Os vinculos futuros deste save tambem dependerao desta equipe.`}
        confirmLabel="Excluir"
      />
    </div>
  );
}
