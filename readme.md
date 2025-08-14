# Store Rating Management System

A **Full-Stack** application built with **Express.js**, **PostgreSQL**, and **React + TailwindCSS**.  
Supports three roles:

- **Admin** – manage users and stores.
- **Normal User** – view and rate stores.
- **Store Owner** – view ratings for their stores.

---

## 🚀 Tech Stack

**Backend**

- Node.js + Express.js
- PostgreSQL + Prisma ORM (or Knex/Sequelize, depending on implementation)
- JWT Authentication
- Bcrypt for password hashing

**Frontend**

- React.js (Vite)
- TailwindCSS
- React Hook Form + Yup validation
- Axios for API calls
- React Router v6
- React Toastify for notifications

---

## 📂 Project Structure

### Backend

```
backend/
├── src/
│ ├── config/ # DB config, env
│ ├── middleware/ # auth, error handlers
│ ├── models/ # Prisma schema or Sequelize models
│ ├── routes/ # API route files
│ ├── controllers/ # Business logic
│ ├── utils/ # helpers
│ └── server.js # Entry point
├── prisma/ # Prisma schema & migrations
├── package.json
```

### Frontend

```
frontend/
├── src/
│ ├── api/ # API service layer
│ ├── components/ # Navbar, reusable UI
│ ├── contexts/ # AuthContext
│ ├── hooks/ # useAuth, custom hooks
│ ├── pages/ # Page components by role
│ ├── utils/ # axios instance config
│ ├── App.jsx
│ └── main.jsx
├── public/
├── tailwind.config.js
├── package.json
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/store-rating-system.git
cd store-rating-system
```

### 2. Backend Setup

```
cd backend
npm install

# Set environment variables
cp .env.example .env
# Update values in .env (DB_URL, JWT_SECRET, etc.)

# Run migrations
npx prisma migrate dev --name init

## seed users
node script/seed.js

# Start backend
npm run dev
```

Backend runs at: http://localhost:4000

### 3. Frontend

```
cd ../frontend
npm install

# Start frontend
npm run dev

```

Frontend runs at: http://localhost:5173 (Vite default)

### API Authentication

All protected routes require:

`Authorization: Bearer <JWT_TOKEN>`

Tokens are returned on login and signup.

### API Testing with Postman

Signup – `POST /auth/signup`

Login – `POST /auth/login`

Use token in headers for:

- `/admin/*` routes (Admin only)

- `/stores` (Normal User & Owner)

- `/owner/stores` (Owner only)

Change Password – `POST /auth/change-password`

### Features

#### Admin

- Dashboard with counts

- Manage users with filters, sorting, pagination

- Manage stores with filters, sorting, pagination

#### Normal User

- Browse & search stores

- Sort by rating or name

- Submit or update store ratings

#### Store Owner

- View owned stores

- See list of ratings per store

- (Optional) Add store if none exists

#### Development Notes

- TailwindCSS handles all styling.

- React Hook Form + Yup handles form validation.

- Axios interceptors attach JWT automatically.

- Role-based routing in App.jsx ensures access control.
