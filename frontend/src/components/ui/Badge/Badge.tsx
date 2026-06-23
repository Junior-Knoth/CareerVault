import './Badge.scss';
import { classNames } from '../../../utils/classNames';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return <span className={classNames('badge', `badge--${variant}`, className)}>{children}</span>;
}
