import './Select.scss';

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
  ...rest
}: SelectProps) {
  return (
    <select
      {...rest}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`select ${error ? 'error' : ''}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className={`select-option ${option.value === value ? 'selected' : ''}`}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
