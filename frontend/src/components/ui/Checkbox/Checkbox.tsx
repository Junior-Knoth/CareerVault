import './Checkbox.scss';

type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'checked' | 'onChange' | 'type'
> & {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
};

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  disabled,
  ...rest
}: CheckboxProps) {
  return (
    <div className="checkboxWrapper">
      <input
        {...rest}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
