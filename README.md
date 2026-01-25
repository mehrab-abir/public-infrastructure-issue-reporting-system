# Public Infrastructure Issue Reporting System

A full-stack web application that allows citizens to report public infrastructure issues (potholes, broken streetlights, water leaks, etc.) and enables government admins and staff to manage, track, and resolve them efficiently through a role-based dashboard system.

This project focuses on **real-world workflow design**, **role-based access control**, and **scalable data handling** rather than just basic CRUD operations.

---

- **Live Site:**  ### https://cityfix-report.web.app/

## Key Features

- Role-based system: **Citizen, Staff, and Admin** with separate dashboards  
- Complete **issue lifecycle tracking**  
- Interactive **issue timeline** with audit history (status, message, role, timestamp)  
- **Upvote system** to highlight public importance (one vote per user, persistent)  
- **Priority boosting via payment** — boosted issues appear higher in listings  
- Admin tools to **assign staff, reject issues, manage users & staff, and view payments**  
- Staff workflow to **update issue status, add progress logs, and resolve issues**  
- **Premium subscription logic** with usage limits for free users  
- Secure **private routes** with login persistence after refresh  
- Fully **responsive UI** (mobile, tablet, desktop)

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- TanStack Query
- Tailwind CSS + DaisyUI
- Axios
- Firebase Authentication
- Stripe

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT & Role-based Middleware
- Stripe API

### Tools & Services
- Firebase Hosting (Client)
- Vercel (Server)
- Cloudinary (Image Uploads)
---

## 🔐 Authentication & Security

- Email/Password & Google sign-in
- Role-based API protection (Admin / Staff / Citizen)
- Axios interceptors for token handling
---
