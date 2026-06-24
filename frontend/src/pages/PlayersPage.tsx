import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  FormField,
  Input,
  LoadingState,
  NumberInput,
  PageHeader,
  Panel,
  Select,
  Textarea,
  useToast,
} from '../components/ui';
import { countrySelectOptions, getCountryFlagUrl, getCountryName } from '../constants/countries';
import { getPlayerStatusLabel, playerStatusOptions } from '../constants/player-status';
import type { PlayerStatus } from '../constants/player-status';
import { useActiveCareer } from '../context';
import { checkPlayerDuplicates, createPlayer, listPlayers } from '../services/playersApi';
import type {
  Player,
  PlayerDuplicateCheck,
  PlayerPayload,
  PreferredFoot,
} from '../types/player';
import { getAge } from '../utils/dates';
import { getDisplayName } from '../utils/names';
import './Page.scss';
import './PlayersPage.scss';

interface PlayerFormState {
  save_id: string;
  full_name: string;
  short_name: string;
  birth_date: string;
  nationality: string;
  height_cm: number | '';
  weight_kg: number | '';
  preferred_foot: string;
  academy_origin: boolean;
  status: string;
  photo_path: string;
  notes: string;
}

const preferredFootOptions: { value: PreferredFoot; label: string }[] = [
  { value: 'right', label: 'Direito' },
  { value: 'left', label: 'Esquerdo' },
  { value: 'both', label: 'Ambos' },
];

const emptyForm: PlayerFormState = {
  save_id: '',
  full_name: '',
  short_name: '',
  birth_date: '',
  nationality: '',
  height_cm: '',
  weight_kg: '',
  preferred_foot: '',
  academy_origin: false,
  status: 'active',
  photo_path: '',
  notes: '',
};

function toPayload(form: PlayerFormState): PlayerPayload {
  const status: PlayerStatus = playerStatusOptions.some((option) => option.value === form.status)
    ? (form.status as PlayerStatus)
    : 'active';

  return {
    save_id: Number(form.save_id),
    full_name: form.full_name.trim(),
    short_name: form.short_name.trim() || null,
    birth_date: form.birth_date || null,
    nationality: form.nationality || null,
    height_cm: form.height_cm === '' ? null : form.height_cm,
    weight_kg: form.weight_kg === '' ? null : form.weight_kg,
    preferred_foot: preferredFootOptions.some((option) => option.value === form.preferred_foot)
      ? (form.preferred_foot as PreferredFoot)
      : null,
    academy_origin: form.academy_origin,
    status,
    photo_path: form.photo_path.trim() || null,
    notes: form.notes.trim() || null,
  };
}

function getPreferredFootLabel(preferredFoot: PreferredFoot | null) {
  if (!preferredFoot) {
    return '';
  }

  return preferredFootOptions.find((option) => option.value === preferredFoot)?.label ?? preferredFoot;
}

export default function PlayersPage() {
  const { addToast } = useToast();
  const { saves, activeSaveId, setActiveSaveId, isLoading: isContextLoading } = useActiveCareer();
  const [players, setPlayers] = useState<Player[]>([]);
  const [form, setForm] = useState<PlayerFormState>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState<PlayerDuplicateCheck | null>(null);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isQuickFormOpen, setIsQuickFormOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
  const [isBulkSubmitting, setIsBulkSubmitting] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSummary, setBulkSummary] = useState<string | null>(null);

  const saveOptions = saves.map((save) => ({ value: String(save.id), label: save.name }));
  const selectedSaveId = activeSaveId;

  const selectedSaveName = useMemo(
    () => saves.find((save) => String(save.id) === activeSaveId)?.name,
    [saves, activeSaveId],
  );

  useEffect(() => {
    async function loadPlayersForActiveSave() {
      setForm((currentForm) => ({ ...currentForm, save_id: activeSaveId }));
      setDuplicateCheck(null);
      setIsDuplicateDialogOpen(false);
      setBulkError(null);
      setBulkSummary(null);

      if (!activeSaveId) {
        setPlayers([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        setPlayers(await listPlayers({ saveId: Number(activeSaveId) }));
      } catch {
        setError('Nao foi possivel carregar os jogadores deste save.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayersForActiveSave();
  }, [activeSaveId]);

  function updateForm(field: keyof PlayerFormState, value: PlayerFormState[typeof field]) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setDuplicateCheck(null);
  }

  function resetForm() {
    setForm({ ...emptyForm, save_id: activeSaveId });
    setDuplicateCheck(null);
    setIsDuplicateDialogOpen(false);
  }

  function closeQuickForm() {
    resetForm();
    setIsQuickFormOpen(false);
  }

  function closeBulkForm() {
    setBulkNames('');
    setBulkError(null);
    setBulkSummary(null);
    setIsBulkFormOpen(false);
  }

  async function handleSelectSave(saveId: string) {
    setActiveSaveId(saveId);
    setError(null);
  }

  async function submitPlayer(skipDuplicateCheck = false) {
    if (!form.save_id) {
      setError('Selecione um save antes de cadastrar um jogador.');
      return;
    }

    if (!form.full_name.trim()) {
      setError('Informe o nome completo do jogador.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!skipDuplicateCheck) {
        const duplicateResult = await checkPlayerDuplicates({
          saveId: Number(form.save_id),
          fullName: form.full_name.trim(),
        });

        if (duplicateResult.has_duplicates) {
          setDuplicateCheck(duplicateResult);
          setIsDuplicateDialogOpen(true);
          return;
        }
      }

      const createdPlayer = await createPlayer(toPayload(form));
      setPlayers((currentPlayers) =>
        [...currentPlayers, createdPlayer].sort((firstPlayer, secondPlayer) =>
          firstPlayer.full_name.localeCompare(secondPlayer.full_name),
        ),
      );
      addToast({ variant: 'success', title: 'Jogador criado', message: createdPlayer.full_name });
      resetForm();
      setIsQuickFormOpen(false);
    } catch {
      setError('Nao foi possivel salvar o jogador. Confira os campos e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitPlayer();
  }

  async function handleBulkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSaveId) {
      setBulkError('Selecione um save antes de cadastrar jogadores.');
      return;
    }

    const names = bulkNames
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean);

    if (names.length === 0) {
      setBulkError('Informe ao menos um jogador.');
      return;
    }

    const uniqueNames = Array.from(new Set(names));
    setIsBulkSubmitting(true);
    setBulkError(null);
    setBulkSummary(null);

    try {
      const createdPlayers: Player[] = [];
      const duplicatedNames: string[] = [];

      for (const fullName of uniqueNames) {
        const duplicateResult = await checkPlayerDuplicates({
          saveId: Number(selectedSaveId),
          fullName,
        });

        if (duplicateResult.has_duplicates) {
          duplicatedNames.push(fullName);
          continue;
        }

        createdPlayers.push(
          await createPlayer({
            save_id: Number(selectedSaveId),
            full_name: fullName,
            status: 'active',
          }),
        );
      }

      if (createdPlayers.length > 0) {
        setPlayers((currentPlayers) =>
          [...currentPlayers, ...createdPlayers].sort((firstPlayer, secondPlayer) =>
            firstPlayer.full_name.localeCompare(secondPlayer.full_name),
          ),
        );
      }

      setBulkSummary(
        `${createdPlayers.length} ${createdPlayers.length === 1 ? 'jogador criado' : 'jogadores criados'}${
          duplicatedNames.length > 0
            ? `; ${duplicatedNames.length} ${duplicatedNames.length === 1 ? 'duplicado ignorado' : 'duplicados ignorados'}`
            : ''
        }.`,
      );

      addToast({
        variant: createdPlayers.length > 0 ? 'success' : 'warning',
        title: 'Cadastro em massa concluido',
        message: `${createdPlayers.length} criados, ${duplicatedNames.length} ignorados.`,
      });

      if (createdPlayers.length > 0) {
        setBulkNames('');
      }
    } catch {
      setBulkError('Nao foi possivel concluir o cadastro em massa.');
    } finally {
      setIsBulkSubmitting(false);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Jogadores"
        subtitle="Cadastre jogadores no save ativo sem prende-los a uma equipe fixa."
      />

      <Panel title="Save de trabalho">
        <div className="playerSaveSelector">
          <FormField label="Save" htmlFor="player-save-filter">
            <Select
              id="player-save-filter"
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

      <div className="playerToolbar">
        <Button onClick={() => setIsQuickFormOpen((isOpen) => !isOpen)} disabled={!selectedSaveId}>
          {isQuickFormOpen ? 'Fechar formulario' : 'Novo jogador'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setIsBulkFormOpen((isOpen) => !isOpen)}
          disabled={!selectedSaveId}
        >
          {isBulkFormOpen ? 'Fechar massa' : 'Cadastro em massa'}
        </Button>
      </div>

      {isQuickFormOpen && (
        <Panel title="Novo jogador">
          <form className="playerForm" onSubmit={handleSubmit}>
            <FormField label="Nome completo" htmlFor="player-full-name" required>
              <Input
                id="player-full-name"
                value={form.full_name}
                onChange={(value) => updateForm('full_name', value)}
                placeholder="Ex: Joao da Silva"
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>

            <div className="playerFormGrid">
              <FormField label="Nome curto" htmlFor="player-short-name">
                <Input
                  id="player-short-name"
                  value={form.short_name}
                  onChange={(value) => updateForm('short_name', value)}
                  placeholder="Ex: Joao Silva"
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>

              <FormField label="Nascimento" htmlFor="player-birth-date">
                <Input
                  id="player-birth-date"
                  type="date"
                  value={form.birth_date}
                  onChange={(value) => updateForm('birth_date', value)}
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>
            </div>

            <div className="playerFormGrid">
              <FormField label="Nacionalidade" htmlFor="player-nationality">
                <Select
                  id="player-nationality"
                  value={form.nationality}
                  onChange={(value) => updateForm('nationality', value)}
                  options={countrySelectOptions}
                  placeholder="Selecione um pais"
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>

              <FormField label="Status" htmlFor="player-status">
                <Select
                  id="player-status"
                  value={form.status}
                  onChange={(value) => updateForm('status', value)}
                  options={[...playerStatusOptions]}
                  placeholder="Selecione"
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>
            </div>

            <div className="playerFormGrid">
              <FormField label="Altura (cm)" htmlFor="player-height">
                <NumberInput
                  id="player-height"
                  value={form.height_cm}
                  onChange={(value) => updateForm('height_cm', value)}
                  min={100}
                  max={230}
                  placeholder="Ex: 180"
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>

              <FormField label="Peso (kg)" htmlFor="player-weight">
                <NumberInput
                  id="player-weight"
                  value={form.weight_kg}
                  onChange={(value) => updateForm('weight_kg', value)}
                  min={30}
                  max={180}
                  placeholder="Ex: 75"
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>
            </div>

            <div className="playerFormGrid">
              <FormField label="Pe preferido" htmlFor="player-preferred-foot">
                <Select
                  id="player-preferred-foot"
                  value={form.preferred_foot}
                  onChange={(value) => updateForm('preferred_foot', value)}
                  options={preferredFootOptions}
                  placeholder="Selecione"
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>

              <FormField label="Foto" htmlFor="player-photo-path">
                <Input
                  id="player-photo-path"
                  value={form.photo_path}
                  onChange={(value) => updateForm('photo_path', value)}
                  placeholder="Caminho local futuro"
                  disabled={isSubmitting || !selectedSaveId}
                />
              </FormField>
            </div>

            <Checkbox
              id="player-academy-origin"
              label="Formado na academia"
              checked={form.academy_origin}
              onChange={(value) => updateForm('academy_origin', value)}
              disabled={isSubmitting || !selectedSaveId}
            />

            <FormField label="Notas" htmlFor="player-notes">
              <Textarea
                id="player-notes"
                value={form.notes}
                onChange={(value) => updateForm('notes', value)}
                placeholder="Observacoes curtas sobre o jogador"
                rows={3}
                disabled={isSubmitting || !selectedSaveId}
              />
            </FormField>

            {duplicateCheck && (
              <div className="playerDuplicateNotice" role="alert">
                Possivel duplicidade com {duplicateCheck.matches.length}{' '}
                {duplicateCheck.matches.length === 1 ? 'jogador' : 'jogadores'} neste save.
              </div>
            )}

            {error && <p className="playerError">{error}</p>}

            <div className="playerFormActions">
              <Button variant="secondary" onClick={closeQuickForm} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedSaveId}>
                {isSubmitting ? 'Salvando...' : 'Criar jogador'}
              </Button>
            </div>
          </form>
        </Panel>
      )}

      {isBulkFormOpen && (
        <Panel title="Cadastro em massa">
          <form className="playerForm" onSubmit={handleBulkSubmit}>
            <FormField label="Jogadores" htmlFor="player-bulk-names" required>
              <Textarea
                id="player-bulk-names"
                value={bulkNames}
                onChange={setBulkNames}
                placeholder="Um jogador por linha"
                rows={8}
                disabled={isBulkSubmitting || !selectedSaveId}
              />
            </FormField>

            {bulkError && <p className="playerError">{bulkError}</p>}
            {bulkSummary && <p className="playerBulkSummary">{bulkSummary}</p>}

            <div className="playerFormActions">
              <Button variant="secondary" onClick={closeBulkForm} disabled={isBulkSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isBulkSubmitting || !selectedSaveId}>
                {isBulkSubmitting ? 'Cadastrando...' : 'Cadastrar jogadores'}
              </Button>
            </div>
          </form>
        </Panel>
      )}

      <Panel title="Jogadores cadastrados">
        {isLoading && <LoadingState message="Carregando jogadores..." />}

        {!isLoading && saves.length === 0 && (
          <EmptyState
            message="Nenhum save cadastrado"
            description="Crie um save antes de cadastrar jogadores."
          />
        )}

        {!isLoading && saves.length > 0 && players.length === 0 && (
          <EmptyState
            message="Nenhum jogador cadastrado"
            description="Use o formulario rapido para registrar o primeiro jogador deste save."
          />
        )}

        {!isLoading && players.length > 0 && (
          <div className="playerList">
            {players.map((player) => (
              <article className="playerItem" key={player.id}>
                <div className="playerAvatar">{getDisplayName(player.full_name, player.short_name)[0]}</div>
                <div className="playerItemContent">
                  <div className="playerItemHeader">
                    <h2>{getDisplayName(player.full_name, player.short_name)}</h2>
                    <Badge variant={player.status === 'active' ? 'success' : 'default'}>
                      {getPlayerStatusLabel(player.status)}
                    </Badge>
                    {player.academy_origin && <Badge variant="info">Academia</Badge>}
                  </div>
                  <div className="playerMeta">
                    {player.nationality && (
                      <span>
                        {getCountryFlagUrl(player.nationality) && (
                          <img src={getCountryFlagUrl(player.nationality)} alt="" aria-hidden="true" />
                        )}
                        {getCountryName(player.nationality)}
                      </span>
                    )}
                    {player.birth_date && <span>{getAge(player.birth_date)} anos</span>}
                    {player.preferred_foot && <span>Pe {getPreferredFootLabel(player.preferred_foot)}</span>}
                    {player.height_cm && <span>{player.height_cm} cm</span>}
                    {player.weight_kg && <span>{player.weight_kg} kg</span>}
                  </div>
                  <p>{player.full_name}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <ConfirmDialog
        isOpen={isDuplicateDialogOpen}
        onClose={() => setIsDuplicateDialogOpen(false)}
        onConfirm={() => {
          void submitPlayer(true);
        }}
        title="Possivel duplicidade"
        message={`Ja existe ${duplicateCheck?.matches.length ?? 0} jogador com nome equivalente neste save. Deseja cadastrar mesmo assim?`}
        confirmLabel="Cadastrar mesmo assim"
        cancelLabel="Revisar"
        variant="primary"
      />
    </div>
  );
}
