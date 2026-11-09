import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/components', label: 'Catalog' },
  { to: '/manufacturers', label: 'Manufacturers' },
  { to: '/categories', label: 'Categories' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="navbar">
      <div className="container" style={{ position: 'relative' }}>
        <nav className="navbar__pill" aria-label="Main navigation">
          <Link to="/" className="brand">
            <Logo />
            Kompo
          </Link>

          <div className={`navbar__links ${open ? 'open' : ''}`}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className="navbar__link">
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar__actions">
            <Link to="/components" className="btn btn--primary">
              Browse hardware
            </Link>
            <button
              type="button"
              className="navbar__menu-btn"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <Icon name="close" size={18} />
              ) : (
                <span>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
