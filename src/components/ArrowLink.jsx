import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

/** Pill link with a violet square arrow icon (from the design reference). */
export default function ArrowLink({ to, children, light = false }) {
  return (
    <Link to={to} className={`arrow-btn ${light ? 'arrow-btn--light' : ''}`}>
      <span className="arrow-btn__icon">
        <Icon name="arrowUpRight" size={16} strokeWidth={2.2} />
      </span>
      {children}
    </Link>
  );
}
