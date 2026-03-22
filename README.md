# Task Management API

REST API for managing tasks with authentication, built using Node.js, TypeScript, Express, and PostgreSQL.

---

## Features

- JWT authentication (access & refresh tokens)
- User registration & login
- Logout with refresh token invalidation
- Get current user
- CRUD operations for tasks
- Ownership-based access control
- Pagination, filtering, sorting, search
- Swagger (OpenAPI) documentation

---

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL + Prisma
- JWT (jsonwebtoken)
- Zod
- Swagger

---

## Live Demo

(Won't be working after April 20)

- API: https://backend-basics-h76n.onrender.com/ (may take some time to proceed)
- Docs: https://backend-basics-h76n.onrender.com/docs

---

## Setup

```bash
git clone https://github.com/FeraFeraKA/backend-basics.git
cd backend-basics
npm install
```

Create `.env` from `.env.example`, then:

```bash
npx prisma migrate dev
npm run dev
```

---

## Structure

```
prisma/
src/
  modules/
  shared/
  types/
  app.ts
  server.ts
```

---

## Notes

- Protected routes require `Authorization: Bearer <token>`
- Users can only access their own tasks
