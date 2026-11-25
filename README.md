# Karthik S — Personal Portfolio

A full-stack, responsive personal portfolio built with **React 18 + Vite + Tailwind CSS** on the frontend and **Django 5 + Django REST Framework + Resend** on the backend.

All resume content lives in a single configuration file ([`frontend/src/data/portfolio.js`](frontend/src/data/portfolio.js)) so text, links, and projects can be updated without editing UI components.

---

## Folder Structure

```text
karthik_cv/
├── backend/
│   ├── config/              # Django settings, URLs, WSGI
│   ├── contact/             # ContactMessage model, admin, serializer, throttle, Resend service, tests
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/              # Favicon and Karthik_portfolio.pdf (resume download)
│   ├── src/
│   │   ├── components/      # Navbar, Hero, About, Skills, Experience, Projects, Contact, Footer, ThemeToggle
│   │   ├── data/
│   │   │   └── portfolio.js # Single source of truth for resume & social config
│   │   ├── services/
│   │   │   └── api.js       # Axios client targeting VITE_API_BASE_URL
│   │   └── tests/           # Vitest + React Testing Library specs
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── vercel.json          # SPA rewrite rules
│   └── .env.example
├── docs/
│   └── RESEND_SETUP.md      # Resend account, SDK, curl, and domain verification guide
├── render.yaml              # Render blueprint for Django API + PostgreSQL
└── README.md
```

---

## Local Setup

### 1. Backend (Django 5 + DRF)

Requires **Python 3.10+** (tested on Python 3.13).

```bash
cd backend
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser   # Optional: to view saved messages in /admin/
python manage.py runserver 127.0.0.1:8000
```

Health check: `GET http://127.0.0.1:8000/api/health/` -> `{"status":"ok","database":"ok"}`.

### 2. Frontend (React 18 + Vite)

Requires **Node.js 18+**.

```bash
cd frontend
npm install
cp .env.example .env
# Copy your resume PDF to frontend/public/Karthik_portfolio.pdf
npm run dev
```

Open `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DJANGO_SECRET_KEY` | Yes (prod) | Dev fallback when `DEBUG=True` | Long random secret key |
| `DEBUG` | No | `False` | Set `True` locally, `False` in production |
| `ALLOWED_HOSTS` | Yes | `localhost,127.0.0.1` | Comma-separated hostnames (e.g. `your-app.onrender.com`) |
| `DATABASE_URL` | No (SQLite locally) | Empty (uses `backend/db.sqlite3`) | PostgreSQL connection URL in production |
| `CORS_ALLOWED_ORIGINS` | Yes | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated allowed frontend origins |
| `RESEND_API_KEY` | Yes for email | Empty | Server-side Resend API key (`re_...`) |
| `RESEND_FROM_EMAIL` | No | `Portfolio <onboarding@resend.dev>` | Sender address (`onboarding@resend.dev` unless domain verified) |
| `CONTACT_RECEIVER_EMAIL` | Yes for email | Empty | Inbox receiving contact form notifications |
| `AUTO_REPLY_ENABLED` | No | `False` | Send confirmation email to visitors (requires verified domain) |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | `http://127.0.0.1:8000` | Base URL of the Django backend (no trailing slash) |

---

## Editing Portfolio Content

1. Update profile details, placeholder GitHub/LinkedIn URLs, education, skills, experience, and project links in [`frontend/src/data/portfolio.js`](frontend/src/data/portfolio.js).
2. Project `githubUrl` and `liveUrl` buttons automatically stay hidden while empty (`""`).
3. Place `Karthik_portfolio.pdf` in `frontend/public/Karthik_portfolio.pdf` so the **Download Resume** button serves the file.

---

## Contact Form Security & Testing

- **Token-less API & CSRF safety:** `POST /api/contact/` uses `authentication_classes = []` (no `SessionAuthentication` cookies), avoiding CSRF token exposure while enforcing strict `CORS_ALLOWED_ORIGINS`, HTML stripping (`strip_tags`), field length validation, a hidden honeypot field (`website`), and DRF per-IP rate limiting (`5/hour`).
- **Database backup:** Every valid submission is saved to `ContactMessage` (`email_sent` and `error_text` tracked in Django Admin).

### Run Automated Tests

```bash
# Backend tests (7 tests, Resend SDK mocked)
cd backend
python manage.py test

# Frontend tests (4 tests, Vitest + React Testing Library)
cd frontend
npm test
```

See [`docs/RESEND_SETUP.md`](docs/RESEND_SETUP.md) for `curl` testing and Resend troubleshooting.

---

## Deployment

### Backend -> Render

You can deploy via the root [`render.yaml`](render.yaml) Blueprint or configure a Render Web Service manually:

- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
- **Start Command:** `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
- **Health Check Path:** `/api/health/`
- **Environment Variables:** Set `DJANGO_SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=<your-service>.onrender.com`, `CORS_ALLOWED_ORIGINS=https://<your-site>.vercel.app`, `DATABASE_URL` (from Render PostgreSQL), `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_RECEIVER_EMAIL`, and `AUTO_REPLY_ENABLED=False`.

### Frontend -> Vercel

1. Import the repository in Vercel and set **Root Directory** to `frontend`.
2. Framework preset: **Vite** (`npm run build`, output directory `dist`).
3. [`frontend/vercel.json`](frontend/vercel.json) handles SPA routing rewrites.
4. Set environment variable `VITE_API_BASE_URL` to your Render backend URL (e.g. `https://karthik-portfolio-api.onrender.com`).
5. Ensure your Vercel domain is listed in the backend's `CORS_ALLOWED_ORIGINS` on Render.
