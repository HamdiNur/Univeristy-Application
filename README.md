# 🎓 UniApply — University Discovery & Application Platform

A full-stack web platform that lets students discover universities, explore programs across disciplines like Medicine, IT, Engineering, Business and Law, and submit applications online — with a dedicated admin panel to manage everything in real time.

**🔗 Live Demo:** [univeristy-application-pke5.vercel.app](https://univeristy-application-pke5.vercel.app)
**🔗 Live API:** [univeristy-application.onrender.com](https://univeristy-application.onrender.com)

> ⚠️ The backend is hosted on Render's free tier and spins down after inactivity — the first request may take ~50 seconds to wake up.

---

## ✨ Features

### For Students
- Browse and search universities by name, country, or city
- Explore programs filtered by category (Medicine, IT, Engineering, Business, Law, Arts, Science, and more) and degree level
- View detailed program info — tuition, duration, seats, GPA requirements, deadlines, career prospects
- Apply to programs with a cover letter, then submit when ready
- Track application status in a personal dashboard (Draft → Submitted → Under Review → Accepted/Rejected/Waitlisted)
- Get notified automatically whenever application status changes
- Manage personal profile (name, phone, nationality)

### For Admins
- Dedicated admin panel with a responsive sidebar (collapses to a mobile drawer)
- Review all applications with student details and filter by status
- Move applications through the pipeline: Submitted → Under Review → Accepted/Rejected
- Add notes visible to the student on decision
- Create, edit, and deactivate universities
- Create, edit, and deactivate programs — including required documents, course outline, and career prospects

### Platform-wide
- Role-based authentication (Student / Admin) with JWT
- Automatic redirects so each role only sees their own dashboard
- Responsive design across all pages (mobile drawer menus, adaptive grids)
- Loading skeletons for a smooth perceived-performance experience
- Custom 404 page

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (hosted on [Neon](https://neon.tech)) |
| Auth | JWT + bcrypt |
| Icons | lucide-react |
| Notifications (UI) | react-hot-toast |
| HTTP Client | axios |
| Hosting | Vercel (frontend) · Render (backend) |

> The backend talks to PostgreSQL directly via the `pg` driver with hand-written SQL — no ORM — for full control over queries and zero extra build tooling.

---

## 📁 Project Structure

```
uni-apply/
├── backend/
│   ├── src/
│   │   ├── controllers/      # business logic (auth, universities, programs, applications, notifications)
│   │   ├── routes/           # Express route definitions
│   │   ├── middleware/       # JWT auth + role guard
│   │   ├── db.js             # PostgreSQL connection pool
│   │   ├── db.sql            # full table schema
│   │   ├── migrate.js        # runs db.sql against the database
│   │   └── index.js          # app entrypoint
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.js                # landing page
    │   │   ├── login/ register/       # auth pages
    │   │   ├── universities/          # browse + [id] detail
    │   │   ├── programs/              # browse + [id] detail
    │   │   ├── dashboard/             # student applications + notifications
    │   │   ├── profile/               # account settings
    │   │   ├── admin/                 # sidebar-layout admin panel
    │   │   │   ├── page.js            # applications review
    │   │   │   ├── universities/      # manage universities
    │   │   │   └── programs/          # manage programs
    │   │   └── not-found.js           # custom 404
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   └── lib/
    │       └── api.js                 # axios instance with auth interceptor
    └── package.json
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech) project)

### 1. Clone the repo
```bash
git clone https://github.com/HamdiNur/Univeristy-Application.git
cd Univeristy-Application
```
//
### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Create the tables, then start the server:
```bash
npm run migrate
npm run dev
```
API runs at `http://localhost:5000`.

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```
App runs at `http://localhost:3000`.

### 4. Create an admin account
Register normally through the app, then promote the account to admin directly in the database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 🔌 API Overview

Base URL: `/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create an account |
| POST | `/auth/login` | Public | Log in, returns JWT |
| GET | `/auth/me` | Authenticated | Get current user |
| PATCH | `/auth/profile` | Authenticated | Update profile |
| GET | `/universities` | Public | List/search universities |
| GET | `/universities/:id` | Public | University detail + programs |
| POST/PUT/DELETE | `/universities` | Admin | Manage universities |
| GET | `/programs` | Public | List/filter programs |
| GET | `/programs/:id` | Public | Program detail |
| GET | `/programs/categories` | Public | List of program categories |
| POST/PUT/DELETE | `/programs` | Admin | Manage programs |
| POST | `/applications` | Student | Create an application (draft) |
| PATCH | `/applications/:id/submit` | Student | Submit a draft application |
| GET | `/applications/me` | Student | View own applications |
| GET | `/applications` | Admin | View all applications |
| PATCH | `/applications/:id/status` | Admin | Update application status |
| GET | `/notifications` | Authenticated | List notifications |
| PATCH | `/notifications/:id/read` | Authenticated | Mark one as read |
| PATCH | `/notifications/read-all` | Authenticated | Mark all as read |

---

## 🗺️ Roadmap

- [ ] Document upload (CV, transcripts) via cloud storage
- [ ] University logo upload
- [ ] Email notifications alongside in-app ones
- [ ] Pagination polish + advanced filtering (fee range, language)

---

## 📄 License

MIT — free to use and modify.

---

Built as a learning project exploring full-stack development with Next.js, Express, and PostgreSQL — from schema design through deployment. 🎓