# Placement Portal — Feature Roadmap

This roadmap tracks completed features and planned enhancements for the Campus Recruitment Management System (Placement Portal).

## ✅ Completed (Core System)

- [x] React + TypeScript + Tailwind frontend
- [x] FastAPI backend with PostgreSQL (Neon)
- [x] JWT authentication (register/login)
- [x] Role-based access control (Student / Recruiter / Admin)
- [x] Student: browse jobs, apply, track application status
- [x] Recruiter: register company, post jobs, view applicants, update status
- [x] Admin: approve companies, view analytics, list students
- [x] Role-based routing with automatic redirects and guarded pages

## 🚧 Phase 1: Core Polish

| Feature | Effort | Impact |
|---|---|---|
| Resume upload (Cloudinary) | Medium | High — expected feature, currently missing |
| Search & filter on jobs | Low | Medium — easy win, feels complete |
| Pagination | Low | Medium — shows scalability awareness |

## 🚧 Phase 2: Engagement Features

| Feature | Effort | Impact |
|---|---|---|
| Email notifications (status changes) | Medium | High — very demoable, feels "real" |
| Password reset flow | Medium | Medium — expected auth completeness |
| Email verification on register | Low-Medium | Low-Medium — closes existing gap |

## 🚧 Phase 3: Visual / Analytical Polish

| Feature | Effort | Impact |
|---|---|---|
| Admin analytics chart (Recharts) | Low | High — visually impressive in demos |
| Recruiter can view student profile/resume | Low | Medium — completes the shortlisting flow |
| Dark mode toggle | Low | Low — nice cosmetic touch |

## 🚧 Phase 4: Deployment & Delivery

| Feature | Effort | Impact |
|---|---|---|
| Push to GitHub | Low | Required — foundation for deployment |
| Deploy backend (Render) | Medium | Critical — makes it a live product |
| Deploy frontend (Vercel) | Low | Critical — gives you a shareable URL |
| Docker containerization | Medium | Medium — strong "I understand DevOps" signal |
| README with screenshots + architecture diagram | Low | High — this is what recruiters actually read first |

## 🌱 Phase 5: Stretch Goals

| Feature | Effort | Impact |
|---|---|---|
| External job feed (Adzuna API) | Medium | Low — nice-to-have, not essential |
| Interview scheduling (calendar/date picker) | Medium | Medium — was in original spec |
| Bulk resume download for recruiters | Low | Low — matches original spec's "Download resumes" |

---

### Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, React Router, Axios
**Backend:** FastAPI (Python), SQLAlchemy, Alembic
**Database:** PostgreSQL (Neon)
**Auth:** JWT (python-jose), bcrypt (passlib)
**Deployment (planned):** Vercel (frontend), Render (backend), Neon (database)
