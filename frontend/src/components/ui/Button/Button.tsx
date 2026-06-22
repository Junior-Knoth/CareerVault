import './Button.scss';

type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={variant} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
