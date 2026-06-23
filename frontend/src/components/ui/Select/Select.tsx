import './Select.scss';
import { classNames } from '../../../utils/classNames';

type SelectProps = React.ComponentPropsWithoutRef<'select'> & {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  error?: boolean;
};

export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error = false,
  className,
  ...rest
}: SelectProps) {
  return (
    <select
      {...rest}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      className={classNames('select', error && 'select--error', className)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
