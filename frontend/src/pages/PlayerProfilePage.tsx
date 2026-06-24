import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, EmptyState, LoadingState, PageHeader, Panel } from '../components/ui';
import { getCountryFlagUrl, getCountryName } from '../constants/countries';
import { getPlayerStatusLabel } from '../constants/player-status';
import {
  getImportedPlayerAltPosition,
  getImportedPlayerPosition,
  getImportedSquadNumber,
} from '../features/players/playerMetadata';
import { getPlayer } from '../services/playersApi';
import type { Player, PreferredFoot } from '../types/player';
import { formatDate, getAge } from '../utils/dates';
import { getDisplayName } from '../utils/names';
import './Page.scss';
import './PlayerProfilePage.scss';

const preferredFootLabels: Record<PreferredFoot, string> = {
  right: 'Direito',
  left: 'Esquerdo',
  both: 'Ambos',
};

function getPreferredFootLabel(preferredFoot: PreferredFoot | null) {
  return preferredFoot ? preferredFootLabels[preferredFoot] : '-';
}

export default function PlayerProfilePage() {
  const navigate = useNavigate();
  const { playerId } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlayer() {
      if (!playerId) {
        setError('Jogador nao encontrado.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        setPlayer(await getPlayer(Number(playerId)));
      } catch {
        setError('Nao foi possivel carregar este jogador.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayer();
  }, [playerId]);

  if (isLoading) {
    return (
      <div className="page">
        <LoadingState message="Carregando jogador..." />
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="page">
        <EmptyState message="Jogador indisponivel" description={error ?? 'Registro nao encontrado.'} />
        <Button variant="secondary" onClick={() => navigate('/clube/jogadores')}>
          Voltar
        </Button>
      </div>
    );
  }

  const mainPosition = getImportedPlayerPosition(player);
  const altPosition = getImportedPlayerAltPosition(player);
  const squadNumber = getImportedSquadNumber(player);

  return (
    <div className="page">
      <PageHeader
        title={getDisplayName(player.full_name, player.short_name)}
        subtitle={player.full_name}
      />

      <div className="playerProfileActions">
        <Button variant="secondary" onClick={() => navigate('/clube/jogadores')}>
          Voltar
        </Button>
      </div>

      <Panel title="Dados pessoais">
        <div className="playerProfileGrid">
          <div>
            <span>Nome completo</span>
            <strong>{player.full_name}</strong>
          </div>
          <div>
            <span>Nacionalidade</span>
            <strong className="playerProfileCountry">
              {player.nationality && getCountryFlagUrl(player.nationality) && (
                <img src={getCountryFlagUrl(player.nationality)} alt="" aria-hidden="true" />
              )}
              {getCountryName(player.nationality) || '-'}
            </strong>
          </div>
          <div>
            <span>Nascimento</span>
            <strong>{player.birth_date ? formatDate(player.birth_date) : '-'}</strong>
          </div>
          <div>
            <span>Idade</span>
            <strong>{player.birth_date ? `${getAge(player.birth_date)} anos` : '-'}</strong>
          </div>
          <div>
            <span>Pe preferido</span>
            <strong>{getPreferredFootLabel(player.preferred_foot)}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>
              <Badge variant={player.status === 'active' ? 'success' : 'default'}>
                {getPlayerStatusLabel(player.status)}
              </Badge>
            </strong>
          </div>
          <div>
            <span>Altura</span>
            <strong>{player.height_cm ? `${player.height_cm} cm` : '-'}</strong>
          </div>
          <div>
            <span>Peso</span>
            <strong>{player.weight_kg ? `${player.weight_kg} kg` : '-'}</strong>
          </div>
          <div>
            <span>Origem</span>
            <strong>{player.academy_origin ? 'Academia' : 'Externo'}</strong>
          </div>
        </div>
      </Panel>

      <Panel title="Posicoes">
        <div className="playerProfileBadges">
          {mainPosition ? <Badge variant="info">{mainPosition}</Badge> : <Badge>Sem posicao</Badge>}
          {altPosition && <Badge variant="default">{altPosition}</Badge>}
          {squadNumber && <Badge variant="default">No. {squadNumber}</Badge>}
        </div>
      </Panel>

      <Panel title="Notas">
        <p className="playerProfileNotes">{player.notes || 'Sem notas.'}</p>
      </Panel>
    </div>
  );
}
