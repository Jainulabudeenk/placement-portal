# Placement Portal — Campus Recruitment Management System

A full-stack, role-based placement portal that connects **students**, **recruiters**, and **placement officers (admin)** on a single platform — students browse and apply to jobs, recruiters post jobs and shortlist candidates, and admins approve companies and track placement analytics.

**Live Demo:** [placement-portal-nine-tau.vercel.app](https://placement-portal-nine-tau.vercel.app)
**API Docs (Swagger):** [placement-portal-9vrm.onrender.com/docs](https://placement-portal-9vrm.onrender.com/docs)

> ⚠️ The backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30–60 seconds to respond — this is expected, not a bug.

---

## Demo Credentials

Try each role live:

| Role | Email | Password |
|---|---|---|
| Student | `teststudent@example.com` | `TestPass123` |
| Recruiter | `recruiter1@testcorp.com` | `TestPass123` |
| Admin | `admin@placementportal.com` | `AdminPass123` |

---

## Features

### Student
- Register / login (JWT authentication)
- Browse all posted jobs
- Apply to jobs (one-click, duplicate-apply protection)
- Track application status in real time (Applied → Shortlisted → Interview → Selected/Rejected)

### Recruiter
- Register company (pending admin approval)
- Post job openings
- View all applicants for each job
- Update applicant status (shortlist, move to interview, select, reject)

### Admin
- View pending company registrations and approve them
- View live placement analytics (students, companies, jobs, applications, selections)
- View all registered students

### Platform-wide
- JWT-based authentication with password hashing (bcrypt)
- Role-based access control (RBAC) enforced on both frontend routes and backend endpoints
- Automatic role-based redirects — each user lands on their correct dashboard
- Fully relational PostgreSQL schema (users, students, companies, recruiters, jobs, applications)

---

## Tech Stack

**Frontend**
- React + TypeScript
- Tailwind CSS
- React Router
- Axios

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- Alembic (database migrations)
- JWT (python-jose) + bcrypt (passlib) for authentication

**Database**
- PostgreSQL (hosted on [Neon](https://neon.tech))

**Deployment**
- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com)
- Database: [Neon](https://neon.tech) (serverless Postgres)

---

## Architecture

```
Student / Recruiter / Admin (browser)
              │
              ▼
     React Frontend (Vercel)
              │  REST API calls (JWT in Authorization header)
              ▼
     FastAPI Backend (Render)
      ├── JWT auth & RBAC middleware
      ├── SQLAlchemy ORM
              │
              ▼
     PostgreSQL Database (Neon)
```

All requests from the frontend go through a single FastAPI backend, which enforces role-based permissions before touching the database — students, recruiters, and admins each only have access to the actions their role permits.

---

## Database Schema

- **users** — shared auth table (email, password hash, role)
- **students** — student profile, linked to `users`
- **companies** — recruiter's company, gated by `is_approved`
- **recruiters** — recruiter profile, linked to `users` and `companies`
- **jobs** — job postings, linked to `companies` and `recruiters`
- **applications** — join table between `students` and `jobs`, tracks status

---

## Running Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# create a .env file with:
# DATABASE_URL=your_postgres_connection_string
# SECRET_KEY=your_random_secret
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=60

alembic upgrade head
uvicorn app.main:app --reload
```
Backend runs at `http://127.0.0.1:8000` — API docs at `/docs`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features, including resume upload, email notifications, search/filter, and analytics charts.

---

## Author

**Jainulabudeen K**
GitHub: [@Jainulabudeenk](https://github.com/Jainulabudeenk)
