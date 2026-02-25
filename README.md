# 🚀 SaaS Job Board Platform

A production-oriented full-stack Job Board SaaS platform built with **Nuxt 3 (SSR)**, **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM**.

This project was intentionally designed to simulate real-world SaaS architecture challenges including authentication, SSR handling, relational database modeling, and scalable frontend engineering.

---

# 🏗 Architecture Overview

Client (Nuxt 3 - SSR)  
↓  
Server Middleware (Auth + Cookie Handling)  
↓  
Express API Layer  
↓  
Service Layer (Business Logic)  
↓  
Prisma ORM  
↓  
PostgreSQL  

---

# 🛠 Tech Stack

## Frontend
- Nuxt 3 (SSR Enabled)
- Vue 3 (Composition API)
- Reusable UI Components
- Route Middleware
- Cookie-based Authentication Handling

## Backend
- Node.js
- Express.js
- RESTful API Architecture
- JWT Authentication
- Layered Architecture (Controller → Service → ORM)

## Database
- PostgreSQL
- Prisma ORM
- Indexed relational schema
- Explicit foreign key relationships

---

# ✨ Core Features

## 🔐 Authentication System (SSR-Compatible)

- User Registration
- Secure Login (HTTP-only cookies)
- Logout functionality
- Protected routes (frontend + backend)
- Role-based architecture (scalable)
- Forgot Password (token-based reset)

### Why It Matters
Authentication is fully compatible with SSR:
- Cookies are forwarded during server rendering
- Unauthorized users are redirected before render
- Backend validates every protected request

---

## 📄 Job Listings

- Paginated job listing page
- SEO-friendly SSR rendering
- Dynamic job detail route
- Reusable JobCard component

---

## 📝 Apply to Job Feature

Engineered carefully to prevent:
- Duplicate applications
- Unauthorized access
- Inconsistent database state

### Database Modeling

Instead of embedding applications inside users or jobs:
- Dedicated `Application` table
- Foreign key constraints
- Indexed relations
- Logical duplicate prevention

---

## 👤 My Applications Dashboard

- View all applied jobs
- Track application status
- Paginated results
- SSR-friendly data fetching
- Clean UI separation from business logic

---

# 🎨 Reusable Component System

Built a scalable frontend architecture:

- Button component (variants + sizes)
- Pagination component
- Layout wrappers
- Centralized styling patterns

Benefits:
- Clean maintainability
- Reduced duplication
- Consistent UI system
- Easy scalability

---

# 🔁 Server-Side Rendering (SSR)

Nuxt 3 SSR used intentionally to demonstrate:

- Server-side data fetching
- Cookie forwarding during SSR
- Pre-render auth validation
- Improved SEO
- Reduced client-side flicker

---

# 🔒 Security Considerations

- HTTP-only cookies
- Password hashing
- Protected API middleware
- Input validation
- Duplicate action prevention
- Centralized error handling


# 🧠 Engineering Challenges Solved

1. Handling authentication correctly in SSR
2. Preventing duplicate job applications
3. Designing a relational many-to-many schema
4. Implementing layered backend architecture
5. Maintaining separation between UI & business logic
6. Avoiding tight coupling between frontend & backend

---

# 🚀 Scalability Roadmap

- Recruiter dashboard
- Resume upload support
- Email notifications
- Saved jobs feature
- Advanced job filters
