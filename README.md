# Kompo — Frontend

Web client for **Kompo**, a custom PC builder & hardware catalog platform.
This repository contains only the frontend. It is a standalone single-page application that runs on its own port and communicates with the [Kompo REST API (Django backend)](https://github.com/elvvelon/Kompo) over HTTP.

## Overview

The frontend currently covers the **read-only (browsing)** part of the already implemented backend functionality:

| Page | Route | API endpoint(s) used |
| --- | --- | --- |
| Home — overview, catalog stats, popular parts, categories, brands | `/` | `GET /api/components`, `GET /api/manufacturers`, `GET /api/categories` |
| Hardware catalog — search by name / SKU, filter by category & manufacturer, sorting | `/components` | `GET /api/components?search=&category_id=&manufacturer_id=&sort_by=&order=` |
| Component details — price, power draw, popularity, build limit, specifications | `/components/:id` | `GET /api/components/{id}` |
| Manufacturers directory | `/manufacturers` | `GET /api/manufacturers` |
| Manufacturer page with its components | `/manufacturers/:id` | `GET /api/manufacturers/{id}` |
| Categories & build quotas (internal parts vs. peripherals) | `/categories` | `GET /api/categories` |
| Category page with its components | `/categories/:id` | `GET /api/categories/{id}` |

Other highlights:

- Catalog filters are kept in the URL query string, so filtered views can be shared or bookmarked.
- Loading skeletons, empty states, and readable error messages. The backend's unified error format (`{ "error": { "message": ... } }`) is shown to the user as is.
- A live **API status** indicator in the footer shows which backend URL is in use and whether it can be reached.
- Responsive layout with a milky + pastel violet / lilac color palette.

### Tech stack

- [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/)
- [Vite 6](https://vite.dev/) (dev server & build tool)
- Plain CSS with custom properties, no UI framework
- Native `fetch` API for HTTP requests

## Addresses & ports

| Service | Address | Notes |
| --- | --- | --- |
| **Frontend** (Vite dev server) | http://localhost:5173 | Set in `vite.config.js` (`server.port`) |
| **Frontend** (production preview) | http://localhost:4173 | `npm run preview` after `npm run build` |
| **Backend** (Django REST API) | http://127.0.0.1:8000/api/ | Default `python manage.py runserver` address |
| **Backend** admin panel | http://127.0.0.1:8000/admin/ | |

The frontend and backend run on **different origins** (different ports), so the browser makes cross-origin requests. The backend allows them via `django-cors-headers`, and `http://localhost:5173` is already in its `CORS_ALLOWED_ORIGINS` list.

The API base URL is configured with the `VITE_API_BASE_URL` environment variable. If it is not set, the default is `http://127.0.0.1:8000/api`.

## How to run the project

### Prerequisites

- **Node.js 18+** (20 or 22 LTS recommended) and **npm**
- A running instance of the **Kompo backend** (see below)

### 1. Start the backend (API)

In a separate terminal, clone and run the [backend repository](https://github.com/elvvelon/Kompo):

```bash
git clone https://github.com/elvvelon/Kompo.git
cd Kompo
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data        # optional: fill the database with demo data
python manage.py runserver        # http://127.0.0.1:8000
```

Check that the API responds: open http://127.0.0.1:8000/api/components in your browser.

### 2. Install frontend dependencies

```bash
git clone <this-repository-url> kompo-frontend
cd kompo-frontend
npm install
```

### 3. Configure the API URL (optional)

The default backend address is `http://127.0.0.1:8000/api`. To use a different one, create a `.env` file from the example and edit it:

```bash
cp .env.example .env
```

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

> If you run the frontend on a port or domain that is not in the backend's `CORS_ALLOWED_ORIGINS` list, add it to the backend's `kompo/settings.py`.

### 4. Start the frontend

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. The footer shows **"API online"** when the frontend can reach the backend.

### Production build

```bash
npm run build      # outputs static files to dist/
npm run preview    # serves the build at http://localhost:4173
```

The `dist/` folder can be deployed to any static hosting (Netlify, Vercel, Nginx, etc.). Set `VITE_API_BASE_URL` at build time to point to the deployed API, and configure the host to serve `index.html` for all routes, since the app uses client-side routing.

## Project structure

```
.
├── index.html               # HTML entry point
├── vite.config.js           # Vite config (dev server port 5173)
├── .env.example             # Example environment variables
├── public/                  # Static assets (favicon)
└── src/
    ├── main.jsx             # App bootstrap + router
    ├── App.jsx              # Route definitions
    ├── api/client.js        # REST API client & error handling
    ├── hooks/               # useApi (data fetching), useDebounce
    ├── components/          # Layout, navbar, cards, states, icons, etc.
    ├── pages/               # Route-level pages
    ├── styles/              # Design system & page styles
    └── utils/               # Formatting helpers
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:5173 |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build at http://localhost:4173 |
