# RealEstate Platform

Full stack real estate app (React + TypeScript, Node, Express, MongoDB).

## Features
- JWT auth, password reset by email
- Property CRUD with ownership rules, multi-image upload (ImageKit)
- Filters: city, type, price, area
- Viewing booking (guest + logged-in), cancel
- User dashboard

## Setup
Backend: `cd backend && npm install && npm run dev`
Frontend: `cd frontend && npm install && npm run dev`

## Env (backend/.env)
PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRE, CLIENT_URL,
EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM,
IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT

## Env (frontend/.env)
VITE_API_URL=http://localhost:5000/api

## Live Demo
- Frontend: https://realestate-platform-gray.vercel.app
- Backend API: https://realestate-platform-im96.onrender.com/api/health

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth & Security: JWT, bcrypt, Nodemailer, Helmet, CORS, rate limiting
- Media: Multer + ImageKit
- Deployment: Vercel (frontend), Render (backend), MongoDB Atlas

## Modules Completed
1. Project Setup, Models & Authentication
2. Properties, Filters & Image Upload
3. Appointments & User Dashboard
4. Security, SEO & Deployment

> Note: The backend is on Render's free plan, so the first request may take 30-50 seconds to wake up.