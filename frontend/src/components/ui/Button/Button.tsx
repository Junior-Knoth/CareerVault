import './Button.scss';
import { classNames } from '../../../utils/classNames';

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
  className,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames('button', `button--${variant}`, className)}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
