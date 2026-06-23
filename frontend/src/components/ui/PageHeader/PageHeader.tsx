import './PageHeader.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="pageHeader">
      <div className="pageHeaderText">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="pageHeaderActions">{actions}</div>}
    </header>
  );
}
