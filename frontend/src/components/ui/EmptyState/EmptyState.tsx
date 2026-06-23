import './EmptyState.scss';

interface EmptyStateProps {
  message: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ message, description, action }: EmptyStateProps) {
  return (
    <div className="emptyState">
      <p className="message">{message}</p>
      {description && <p className="description">{description}</p>}
      {action && <div className="action">{action}</div>}
    </div>
  );
}
