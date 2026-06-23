import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Button,
  ConfirmDialog,
  EmptyState,
  FormField,
  Input,
  LoadingState,
  PageHeader,
  Panel,
  Textarea,
  useToast,
} from '../components/ui';
import { useActiveCareer } from '../context';
import { createSave, deleteSave, listSaves, updateSave } from '../services/savesApi';
import type { Save, SavePayload } from '../types/save';
import './Page.scss';
import './SavesPage.scss';

interface SaveFormState {
  name: string;
  slug: string;
  description: string;
  accent_color: string;
  secondary_color: string;
}

const emptyForm: SaveFormState = {
  name: '',
  slug: '',
  description: '',
  accent_color: '#ff6f61',
  secondary_color: '#151515',
};

function toPayload(form: SaveFormState): SavePayload {
  return {
    name: form.name.trim(),
    slug: form.slug.trim() || null,
    description: form.description.trim() || null,
    accent_color: form.accent_color,
    secondary_color: form.secondary_color,
  };
}

function toForm(save: Save): SaveFormState {
  return {
    name: save.name,
    slug: save.slug,
    description: save.description ?? '',
    accent_color: save.accent_color,
    secondary_color: save.secondary_color,
  };
}

export default function SavesPage() {
  const { addToast } = useToast();
  const { refreshSaves, setActiveSaveId } = useActiveCareer();
  const [saves, setSaves] = useState<Save[]>([]);
  const [form, setForm] = useState<SaveFormState>(emptyForm);
  const [editingSaveId, setEditingSaveId] = useState<number | null>(null);
  const [saveToDelete, setSaveToDelete] = useState<Save | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingSaveId !== null;

  const orderedSaves = useMemo(
    () =>
      [...saves].sort(
        (firstSave, secondSave) =>
          new Date(secondSave.created_at).getTime() - new Date(firstSave.created_at).getTime(),
      ),
    [saves],
  );

  useEffect(() => {
    async function loadSaves() {
      setIsLoading(true);
      setError(null);

      try {
        setSaves(await listSaves());
      } catch {
        setError('Nao foi possivel carregar os saves.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSaves();
  }, []);

  function updateForm(field: keyof SaveFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingSaveId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError('Informe um nome para o save.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingSaveId) {
        const updatedSave = await updateSave(editingSaveId, toPayload(form));
        setSaves((currentSaves) =>
          currentSaves.map((save) => (save.id === updatedSave.id ? updatedSave : save)),
        );
        addToast({ variant: 'success', title: 'Save atualizado', message: updatedSave.name });
      } else {
        const createdSave = await createSave(toPayload(form));
        setSaves((currentSaves) => [createdSave, ...currentSaves]);
        setActiveSaveId(String(createdSave.id));
        addToast({ variant: 'success', title: 'Save criado', message: createdSave.name });
      }

      await refreshSaves();
      resetForm();
    } catch {
      setError('Nao foi possivel salvar os dados.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(save: Save) {
    setForm(toForm(save));
    setEditingSaveId(save.id);
    setError(null);
  }

  async function handleDelete() {
    if (!saveToDelete) {
      return;
    }

    try {
      await deleteSave(saveToDelete.id);
      setSaves((currentSaves) => currentSaves.filter((save) => save.id !== saveToDelete.id));
      await refreshSaves();
      addToast({ variant: 'success', title: 'Save excluido', message: saveToDelete.name });
    } catch {
      addToast({
        variant: 'danger',
        title: 'Erro ao excluir',
        message: 'Nao foi possivel remover o save.',
      });
    } finally {
      setSaveToDelete(null);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Saves"
        subtitle="Gerencie universos independentes antes de cadastrar equipes, temporadas e jogadores."
      />

      <Panel title={isEditing ? 'Editar save' : 'Novo save'}>
        <form className="saveForm" onSubmit={handleSubmit}>
          <FormField label="Nome" htmlFor="save-name" required>
            <Input
              id="save-name"
              value={form.name}
              onChange={(value) => updateForm('name', value)}
              placeholder="Ex: Sunderland carreira 2028"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Slug" htmlFor="save-slug">
            <Input
              id="save-slug"
              value={form.slug}
              onChange={(value) => updateForm('slug', value)}
              placeholder="Gerado automaticamente se ficar vazio"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Descricao" htmlFor="save-description">
            <Textarea
              id="save-description"
              value={form.description}
              onChange={(value) => updateForm('description', value)}
              placeholder="Notas curtas sobre o universo deste save"
              rows={4}
              disabled={isSubmitting}
            />
          </FormField>

          <div className="saveFormColors">
            <FormField label="Cor principal" htmlFor="save-accent-color">
              <Input
                id="save-accent-color"
                type="color"
                value={form.accent_color}
                onChange={(value) => updateForm('accent_color', value)}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Cor secundaria" htmlFor="save-secondary-color">
              <Input
                id="save-secondary-color"
                type="color"
                value={form.secondary_color}
                onChange={(value) => updateForm('secondary_color', value)}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          {error && <p className="saveError">{error}</p>}

          <div className="saveFormActions">
            {isEditing && (
              <Button variant="secondary" onClick={resetForm} disabled={isSubmitting}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Salvar alteracoes' : 'Criar save'}
            </Button>
          </div>
        </form>
      </Panel>

      <Panel title="Saves cadastrados">
        {isLoading && <LoadingState message="Carregando saves..." />}

        {!isLoading && orderedSaves.length === 0 && (
          <EmptyState
            message="Nenhum save cadastrado"
            description="Crie o primeiro universo para separar clubes, selecoes e temporadas futuras."
          />
        )}

        {!isLoading && orderedSaves.length > 0 && (
          <div className="saveList">
            {orderedSaves.map((save) => (
              <article className="saveItem" key={save.id}>
                <div className="saveItemColor" style={{ backgroundColor: save.accent_color }} />
                <div className="saveItemContent">
                  <h2>{save.name}</h2>
                  <p>{save.description || 'Sem descricao.'}</p>
                  <span>{save.slug}</span>
                </div>
                <div className="saveItemActions">
                  <Button variant="secondary" onClick={() => handleEdit(save)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => setSaveToDelete(save)}>
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <ConfirmDialog
        isOpen={saveToDelete !== null}
        onClose={() => setSaveToDelete(null)}
        onConfirm={handleDelete}
        title="Excluir save"
        message={`Excluir "${saveToDelete?.name ?? 'este save'}"? Esta acao tambem removera dados vinculados quando os proximos modulos existirem.`}
        confirmLabel="Excluir"
      />
    </div>
  );
}
