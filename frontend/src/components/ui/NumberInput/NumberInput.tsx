import './NumberInput.scss';
import Input from '../Input/Input';

//Remover conflitos com Omit, o Omit iria no

// Onde colocar o Omit<>? É no

type NumberInputProps = Omit<
  React.ComponentPropsWithoutRef<typeof Input>,
  'type' | 'value' | 'onChange'
> & {
  id: string;
  value: number | '';
  onChange: (value: number | '') => void;
  min?: number;
  max?: number;
};

export default function NumberInput({ id, value, onChange, min, max, ...rest }: NumberInputProps) {
  return (
    <Input
      {...rest}
      id={id}
      value={value === '' ? '' : String(value)}
      onChange={(newValue) => onChange(newValue === '' ? '' : Number(newValue))}
      min={min}
      max={max}
      type="number"
    />
  );
}
