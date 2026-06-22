import './Input.scss';

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
};

export default function Input({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  ...rest
}: InputProps) {
  return (
    <input
      type="text"
      id={id}
      className={`input ${error ? 'error' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      {...rest}
    />
  );
}
