import './Panel.scss';
import { classNames } from '../../../utils/classNames';

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Panel({ children, title, className }: PanelProps) {
  return (
    <section className={classNames('panel', className)}>
      {title && (
        <div className="panelHeader">
          <h2>{title}</h2>
        </div>
      )}
      <div className="panelBody">{children}</div>
    </section>
  );
}
