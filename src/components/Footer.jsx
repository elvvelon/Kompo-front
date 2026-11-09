import { useEffect, useState } from 'react';
import { API_BASE_URL, api } from '../api/client.js';
import Logo from './Logo.jsx';

/** Footer with a live indicator showing whether the backend API is reachable. */
export default function Footer() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const controller = new AbortController();
    api
      .getCategories(controller.signal)
      .then(() => setStatus('online'))
      .catch((err) => err.name !== 'AbortError' && setStatus('offline'));
    return () => controller.abort();
  }, []);

  const label = { checking: 'Checking API…', online: 'API online', offline: 'API offline' }[status];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <span className="brand">
            <Logo />
            Kompo
          </span>
          <span className="api-status" title={`API base URL: ${API_BASE_URL}`}>
            <span className={`api-status__dot api-status__dot--${status}`} />
            {label} · {API_BASE_URL}
          </span>
          <span>© {new Date().getFullYear()} Kompo — Custom PC Builder</span>
        </div>
      </div>
    </footer>
  );
}
