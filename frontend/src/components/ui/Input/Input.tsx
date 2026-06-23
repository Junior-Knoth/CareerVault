import './Input.scss';
import { classNames } from '../../../utils/classNames';

type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'> & {
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
  className,
  ...rest
}: InputProps) {
  return (
    <input
      type="text"
      id={id}
      className={classNames('input', error && 'input--error', className)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      {...rest}
    />
  );
}
