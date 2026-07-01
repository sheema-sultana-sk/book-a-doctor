# 🩺 Book a Doctor

A full-stack healthcare appointment booking platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It connects patients with healthcare providers, letting users browse doctors, schedule appointments, upload medical documents, and receive real-time notifications.

## Features

- **Authentication & Roles** — JWT-based auth with three roles: `patient`, `doctor`, `admin`.
- **Doctor Browsing** — Search and filter doctors by name/specialization.
- **Appointment Scheduling** — Patients book slots; doctors confirm, complete, or the patient cancels.
- **Secure Document Uploads** — Patients/doctors attach reports, prescriptions, etc. to an appointment (PDF/JPG/PNG/DOC, 5MB limit).
- **Notifications** — In-app notification bell alerts users to booking updates.
- **Admin Panel** — Approve/reject doctor sign-ups, activate/deactivate users, view platform stats.
- **Doctor Profile Management** — Doctors manage specialization, fee, bio, clinic address, and weekly availability.

## Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Frontend   | React.js, React Router, Axios, CSS       |
| Backend    | Node.js, Express.js                      |
| Database   | MongoDB with Mongoose                    |
| Auth       | JSON Web Tokens (JWT), bcrypt            |
| File Upload| Multer                                   |

## Project Structure

```
book-a-doctor/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers (business logic)
│   ├── middleware/      # Auth, error handling, file upload
│   ├── models/          # Mongoose schemas (User, Doctor, Appointment, Notification)
│   ├── routes/          # Express route definitions
│   ├── uploads/         # Uploaded appointment documents (served statically)
│   ├── seed.js          # Demo data seeder
│   ├── server.js        # App entry point
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/          # Axios instance with auth interceptor
    │   ├── components/   # Navbar, DoctorCard, AppointmentCard, NotificationBell, PrivateRoute
    │   ├── context/       # AuthContext (global auth state)
    │   ├── pages/         # Home, Login, Register, Doctors, DoctorDetail, dashboards
    │   ├── App.js / App.css
    │   └── index.js
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, etc.
npm run seed     # optional: populates demo admin/doctor/patient accounts
npm run dev       # starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your API runs on a different host/port
npm start          # starts on http://localhost:3000
```

### Demo Accounts (after running `npm run seed`)

| Role    | Email                          | Password     |
|---------|---------------------------------|---------------|
| Admin   | admin@bookadoctor.com          | Admin@123     |
| Patient | patient@bookadoctor.com        | Patient@123   |
| Doctor  | aisha.kapoor@bookadoctor.com   | Doctor@123    |

## API Overview

| Method | Endpoint                              | Access          | Description                        |
|--------|----------------------------------------|-----------------|--------------------------------------|
| POST   | `/api/auth/register`                  | Public          | Register as patient or doctor       |
| POST   | `/api/auth/login`                     | Public          | Login, returns JWT                  |
| GET    | `/api/auth/me`                        | Private         | Get logged-in profile               |
| GET    | `/api/doctors`                        | Public          | List approved doctors (filters)     |
| GET    | `/api/doctors/:id`                    | Public          | Doctor detail                       |
| PUT    | `/api/doctors/me`                     | Doctor          | Update own doctor profile           |
| POST   | `/api/appointments`                   | Patient         | Book an appointment                 |
| GET    | `/api/appointments/my`                | Patient         | List own appointments               |
| GET    | `/api/appointments/doctor`            | Doctor          | List appointments for doctor        |
| PUT    | `/api/appointments/:id/status`        | Patient/Doctor  | Update status / add notes           |
| POST   | `/api/appointments/:id/documents`     | Patient/Doctor  | Upload a document (multipart)       |
| GET    | `/api/notifications`                  | Private         | List notifications                  |
| PUT    | `/api/notifications/:id/read`         | Private         | Mark one as read                    |
| GET    | `/api/admin/stats`                    | Admin           | Platform stats                      |
| GET    | `/api/admin/doctors`                  | Admin           | All doctors (incl. unapproved)      |
| PUT    | `/api/admin/doctors/:id/approve`      | Admin           | Approve/reject a doctor             |
| GET    | `/api/admin/users`                    | Admin           | All users                           |
| PUT    | `/api/admin/users/:id/status`         | Admin           | Activate/deactivate a user          |

## Notes for Deployment

- Set `NODE_ENV=production` and a strong `JWT_SECRET` in production.
- Serve uploaded files from persistent storage (e.g. S3) instead of local disk for production deployments.
- Update `CLIENT_URL` (backend) and `REACT_APP_API_URL` (frontend) to your deployed domains.

## GitHub & Demo Links

_Add your GitHub repository link and deployed demo link here once available, so your mentor can review the project:_

- **GitHub:** `<https://github.com/sheema-sultana-sk/book-a-doctor>`
- **Live Demo:** `<-https://book-a-doctor-six.vercel.app>`
