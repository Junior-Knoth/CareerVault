import './Textarea.scss';
import { classNames } from '../../../utils/classNames';

type TextareaProps = Omit<React.ComponentPropsWithoutRef<'textarea'>, 'onChange' | 'value'> & {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
};

export default function Textarea({
  id,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  disabled = false,
  error = false,
  className,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      {...rest}
      name={id}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      className={classNames('textarea', error && 'textarea--error', className)}
    ></textarea>
  );
}
