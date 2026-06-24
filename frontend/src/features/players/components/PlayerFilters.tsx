import { countrySelectOptions } from '../../../constants/countries';
import { playerPositionSelectOptions } from '../../../constants/positions';
import { playerStatusOptions } from '../../../constants/player-status';
import { FormField, Input, Select } from '../../../components/ui';

export interface PlayerFiltersValue {
  search: string;
  nationality: string;
  position: string;
  status: string;
  origin: string;
}

interface PlayerFiltersProps {
  filters: PlayerFiltersValue;
  onFiltersChange: (filters: PlayerFiltersValue) => void;
}

const originOptions = [
  { value: 'academy', label: 'Academia' },
  { value: 'external', label: 'Externo' },
];

export default function PlayerFilters({ filters, onFiltersChange }: PlayerFiltersProps) {
  function updateFilter(field: keyof PlayerFiltersValue, value: string) {
    onFiltersChange({ ...filters, [field]: value });
  }

  return (
    <div className="playerFilters">
      <FormField label="Busca" htmlFor="player-filter-search">
        <Input
          id="player-filter-search"
          value={filters.search}
          onChange={(value) => updateFilter('search', value)}
          placeholder="Nome do jogador"
        />
      </FormField>
      <FormField label="Nacionalidade" htmlFor="player-filter-nationality">
        <Select
          id="player-filter-nationality"
          value={filters.nationality}
          onChange={(value) => updateFilter('nationality', value)}
          options={countrySelectOptions}
          placeholder="Todas"
        />
      </FormField>
      <FormField label="Posicao" htmlFor="player-filter-position">
        <Select
          id="player-filter-position"
          value={filters.position}
          onChange={(value) => updateFilter('position', value)}
          options={playerPositionSelectOptions}
          placeholder="Todas"
        />
      </FormField>
      <FormField label="Status" htmlFor="player-filter-status">
        <Select
          id="player-filter-status"
          value={filters.status}
          onChange={(value) => updateFilter('status', value)}
          options={[...playerStatusOptions]}
          placeholder="Todos"
        />
      </FormField>
      <FormField label="Origem" htmlFor="player-filter-origin">
        <Select
          id="player-filter-origin"
          value={filters.origin}
          onChange={(value) => updateFilter('origin', value)}
          options={originOptions}
          placeholder="Todas"
        />
      </FormField>
    </div>
  );
}
