import { Link } from 'react-router-dom';
import ArrowLink from '../components/ArrowLink.jsx';

export default function NotFound() {
  return (
    <section className="panel panel--dark fade-up" style={{ padding: '72px 40px', marginTop: 32, textAlign: 'center' }}>
      <p className="badge badge--dark" style={{ marginBottom: 20 }}>Error 404</p>
      <h1 style={{ fontSize: 'clamp(64px, 12vw, 140px)' }}>404</h1>
      <p style={{ margin: '16px auto 32px', maxWidth: 420, color: 'var(--ink-400)' }}>
        This page doesn&apos;t exist. Maybe the part you&apos;re looking for is in the{' '}
        <Link to="/components" style={{ color: 'var(--lilac-300)' }}>catalog</Link>.
      </p>
      <ArrowLink to="/">Back to home</ArrowLink>
    </section>
  );
}
