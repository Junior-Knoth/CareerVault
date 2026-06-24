import { Badge, Button } from '../../../components/ui';
import { getCountryFlagUrl, getCountryName } from '../../../constants/countries';
import { getPlayerStatusLabel } from '../../../constants/player-status';
import type { Player, PreferredFoot } from '../../../types/player';
import { getAge } from '../../../utils/dates';
import { getDisplayName } from '../../../utils/names';
import { getImportedPlayerPosition } from '../playerMetadata';

interface PlayerListProps {
  players: Player[];
  onOpenProfile: (player: Player) => void;
}

const preferredFootLabels: Record<PreferredFoot, string> = {
  right: 'Direito',
  left: 'Esquerdo',
  both: 'Ambos',
};

function getPreferredFootLabel(preferredFoot: PreferredFoot | null) {
  return preferredFoot ? preferredFootLabels[preferredFoot] : '';
}

export default function PlayerList({ players, onOpenProfile }: PlayerListProps) {
  return (
    <div className="playerTableWrap">
      <table className="playerTable">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Posicao</th>
            <th>Nacionalidade</th>
            <th>Idade</th>
            <th>Status</th>
            <th>Origem</th>
            <th>Acao</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>
                <div className="playerNameCell">
                  <span className="playerAvatar">
                    {getDisplayName(player.full_name, player.short_name)[0]}
                  </span>
                  <div>
                    <strong>{getDisplayName(player.full_name, player.short_name)}</strong>
                    <span>{player.full_name}</span>
                  </div>
                </div>
              </td>
              <td>{getImportedPlayerPosition(player) || '-'}</td>
              <td>
                {player.nationality ? (
                  <span className="playerFlagCell">
                    {getCountryFlagUrl(player.nationality) && (
                      <img src={getCountryFlagUrl(player.nationality)} alt="" aria-hidden="true" />
                    )}
                    {getCountryName(player.nationality)}
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td>{player.birth_date ? `${getAge(player.birth_date)} anos` : '-'}</td>
              <td>
                <Badge variant={player.status === 'active' ? 'success' : 'default'}>
                  {getPlayerStatusLabel(player.status)}
                </Badge>
              </td>
              <td>{player.academy_origin ? 'Academia' : 'Externo'}</td>
              <td>
                <Button variant="secondary" onClick={() => onOpenProfile(player)}>
                  Perfil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="playerCompactList">
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
                {getImportedPlayerPosition(player) && <span>{getImportedPlayerPosition(player)}</span>}
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
              <Button variant="secondary" onClick={() => onOpenProfile(player)}>
                Perfil
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
