import './Textarea.scss';

type TextareaProps = React.ComponentPropsWithoutRef<'textarea'> & {
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
      className={`${error ? 'error' : ''} textarea`}
    ></textarea>
  );
}
