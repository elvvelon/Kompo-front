/**
 * Thin client for the Kompo REST API.
 *
 * The base URL is configurable through the VITE_API_BASE_URL env variable,
 * so the frontend can talk to a backend running on any host/port.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'error', details = {} } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, { params, signal } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(
      `Cannot reach the API at ${API_BASE_URL}. Make sure the backend server is running.`,
      { code: 'network_error' },
    );
  }

  const body = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    // The backend wraps every error as { error: { status_code, code, message, details } }
    const error = body?.error;
    throw new ApiError(error?.message || `Request failed with status ${response.status}.`, {
      status: response.status,
      code: error?.code || 'http_error',
      details: error?.details || {},
    });
  }

  return body;
}

export const api = {
  /** GET /components — supports search, category_id, manufacturer_id, sort_by, order */
  getComponents: (params, signal) => request('/components', { params, signal }),
  /** GET /components/{id} */
  getComponent: (id, signal) => request(`/components/${id}`, { signal }),

  /** GET /manufacturers */
  getManufacturers: (signal) => request('/manufacturers', { signal }),
  /** GET /manufacturers/{id} — includes the manufacturer's components */
  getManufacturer: (id, signal) => request(`/manufacturers/${id}`, { signal }),

  /** GET /categories */
  getCategories: (signal) => request('/categories', { signal }),
  /** GET /categories/{id} — includes the category's components */
  getCategory: (id, signal) => request(`/categories/${id}`, { signal }),
};
