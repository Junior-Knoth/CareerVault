import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../components/ui';
import { countrySelectOptions } from '../../../constants/countries';
import { playerPositionSelectOptions } from '../../../constants/positions';
import { checkPlayerDuplicates, createPlayer } from '../../../services/playersApi';
import type { Player, PlayerPayload } from '../../../types/player';

interface BulkPlayerRow {
  id: string;
  full_name: string;
  nationality: string;
  birth_date: string;
  position: string;
  alt_position: string;
  squad_number: string;
  origin: 'external' | 'academy';
}

interface BulkPlayerFormProps {
  saveId: string;
  onPlayersCreated: (players: Player[]) => void;
}

const originOptions = [
  { value: 'external', label: 'Externo' },
  { value: 'academy', label: 'Academia' },
];

function createEmptyRow(index: number): BulkPlayerRow {
  return {
    id: `${Date.now()}-${index}`,
    full_name: '',
    nationality: '',
    birth_date: '',
    position: '',
    alt_position: '',
    squad_number: '',
    origin: 'external',
  };
}

function createInitialRows() {
  return Array.from({ length: 5 }, (_, index) => createEmptyRow(index));
}

function toPayload(row: BulkPlayerRow, saveId: string): PlayerPayload {
  const notes = [
    row.position ? `POS: ${row.position}` : '',
    row.alt_position ? `Alt. POS: ${row.alt_position}` : '',
    row.squad_number ? `Numero: ${row.squad_number}` : '',
  ]
    .filter(Boolean)
    .join('; ');

  return {
    save_id: Number(saveId),
    full_name: row.full_name.trim(),
    birth_date: row.birth_date || null,
    nationality: row.nationality || null,
    academy_origin: row.origin === 'academy',
    status: 'active',
    notes: notes || null,
  };
}

function isCompleteRow(row: BulkPlayerRow) {
  return Boolean(row.full_name.trim() && row.nationality && row.birth_date && row.position);
}

export default function BulkPlayerForm({ saveId, onPlayersCreated }: BulkPlayerFormProps) {
  const [rows, setRows] = useState<BulkPlayerRow[]>(createInitialRows);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  function updateRow(rowId: string, field: keyof BulkPlayerRow, value: string) {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  }

  function addRow() {
    setRows((currentRows) => [...currentRows, createEmptyRow(currentRows.length)]);
  }

  function clearRows() {
    setRows(createInitialRows());
    setError(null);
    setSummary(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const filledRows = rows.filter((row) => row.full_name.trim());

    if (filledRows.length === 0) {
      setError('Informe ao menos um jogador.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSummary(null);

    try {
      const createdPlayers: Player[] = [];
      const duplicatedRows: BulkPlayerRow[] = [];

      for (const row of filledRows) {
        const duplicateResult = await checkPlayerDuplicates({
          saveId: Number(saveId),
          fullName: row.full_name.trim(),
        });

        if (duplicateResult.has_duplicates) {
          duplicatedRows.push(row);
          continue;
        }

        createdPlayers.push(await createPlayer(toPayload(row, saveId)));
      }

      if (createdPlayers.length > 0) {
        onPlayersCreated(createdPlayers);
      }

      const completeRows = filledRows.filter(isCompleteRow).length;
      const reviewRows = filledRows.length - completeRows;

      setSummary(
        `${createdPlayers.length} ${createdPlayers.length === 1 ? 'jogador criado' : 'jogadores criados'}; ${completeRows} completos; ${reviewRows} precisam de revisao; ${duplicatedRows.length} duplicados ignorados.`,
      );

      if (createdPlayers.length > 0) {
        setRows(createInitialRows());
      }
    } catch {
      setError('Nao foi possivel concluir o cadastro em massa.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="playerBulkForm" onSubmit={handleSubmit}>
      <div className="playerSpreadsheetWrap">
        <table className="playerSpreadsheet">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nacionalidade</th>
              <th>Nascimento</th>
              <th>POS</th>
              <th>Alt. POS</th>
              <th>No.</th>
              <th>Origem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    aria-label={`Nome da linha ${index + 1}`}
                    value={row.full_name}
                    onChange={(event) => updateRow(row.id, 'full_name', event.target.value)}
                    disabled={isSubmitting}
                  />
                </td>
                <td>
                  <select
                    aria-label={`Nacionalidade da linha ${index + 1}`}
                    value={row.nationality}
                    onChange={(event) => updateRow(row.id, 'nationality', event.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value=""></option>
                    {countrySelectOptions.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    aria-label={`Nascimento da linha ${index + 1}`}
                    type="date"
                    value={row.birth_date}
                    onChange={(event) => updateRow(row.id, 'birth_date', event.target.value)}
                    disabled={isSubmitting}
                  />
                </td>
                <td>
                  <select
                    aria-label={`Posicao da linha ${index + 1}`}
                    value={row.position}
                    onChange={(event) => updateRow(row.id, 'position', event.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value=""></option>
                    {playerPositionSelectOptions.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    aria-label={`Posicao alternativa da linha ${index + 1}`}
                    value={row.alt_position}
                    onChange={(event) => updateRow(row.id, 'alt_position', event.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value=""></option>
                    {playerPositionSelectOptions.map((position) => (
                      <option key={position.value} value={position.value}>
                        {position.value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    aria-label={`Numero da linha ${index + 1}`}
                    type="number"
                    min="1"
                    max="99"
                    value={row.squad_number}
                    onChange={(event) => updateRow(row.id, 'squad_number', event.target.value)}
                    disabled={isSubmitting}
                  />
                </td>
                <td>
                  <select
                    aria-label={`Origem da linha ${index + 1}`}
                    value={row.origin}
                    onChange={(event) => updateRow(row.id, 'origin', event.target.value)}
                    disabled={isSubmitting}
                  >
                    {originOptions.map((origin) => (
                      <option key={origin.value} value={origin.value}>
                        {origin.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="playerError">{error}</p>}
      {summary && <p className="playerBulkSummary">{summary}</p>}

      <div className="playerFormActions">
        <Button variant="secondary" onClick={addRow} disabled={isSubmitting}>
          Adicionar linha
        </Button>
        <Button variant="secondary" onClick={clearRows} disabled={isSubmitting}>
          Limpar tudo
        </Button>
        <Button type="submit" disabled={isSubmitting || !saveId}>
          {isSubmitting ? 'Importando...' : 'Importar todos'}
        </Button>
      </div>
    </form>
  );
}
