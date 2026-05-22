# 🌌 LendSwift Multi-Step Loan Portal

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://lendswift-loan-portal.vercel.app/)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://lendswift-loan-portal.onrender.com)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=for-the-badge&logo=prisma)](https://prisma.io/)

**LendSwift** is a production-grade, 8-step full-stack digital lending wizard designed to streamline the loan application experience for three distinct borrowing categories: **Personal**, **Home**, and **Business** loans. 

It features a custom **Aether Luxe** design system (dark-mode glassmorphism) and a robust **Node.js/Express** backend connected to a **PostgreSQL** database via **Prisma ORM**.

---

## ✨ Live Deployment

- **Frontend (Vercel):** [https://lendswift-loan-portal.vercel.app/](https://lendswift-loan-portal.vercel.app/)
- **Backend API (Render):** [https://lendswift-loan-portal.onrender.com/health](https://lendswift-loan-portal.onrender.com/health)
- **Admin Dashboard:** [Access Underwriter Portal](https://lendswift-loan-portal.vercel.app/admin)

---

## 🏗️ System Architecture

LendSwift operates on a secure **Three-Tier Architecture**:

1. **Presentation Layer (Frontend):** 
   - Built with React + Vite.
   - Handles advanced client-side validation using **React Hook Form** and **Zod**.
   - Features complex UI elements like canvas-based e-signatures, file compression, and dynamic EMI calculations.
2. **Application Layer (Backend):** 
   - A custom **Node.js / Express** REST API.
   - Intercepts form submissions, handles CORS policies, and strictly validates incoming JSON payloads.
3. **Data Layer (Database):** 
   - Uses **Supabase PostgreSQL** in production (and SQLite for local development).
   - Database schemas are strictly typed and managed using **Prisma ORM**.

---

## 🚦 Form Steps & User Flows

The application guides users through a logical, validation-secured 8-step progression:

1. **Loan Selection:** Choose Personal, Home, or Business loan types with dynamic interest rates.
2. **Personal Information:** Collects essential contact details and validates age restrictions.
3. **KYC Verification:** Simulates validation of Indian PAN and Aadhaar numbers.
4. **Address Details:** Dual address management with PIN code lookup autocompletion.
5. **Employment & Income:** Collects career details, monthly income, and existing EMIs.
6. **Co-Applicant Details:** Conditional step that prompts for co-borrower details (e.g., for Home loans).
7. **Document Upload:** Secure file upload featuring an HTML5 canvas signature pad.
8. **Review & Submit:** Displays a live pre-approval EMI math breakdown, OTP verification, and final submission to the database.

---

## 💻 Tech Stack

### Frontend
*   **React 18** (UI Library)
*   **Vite** (Build Tool)
*   **Tailwind CSS** (Styling)
*   **React Hook Form + Zod** (State Management & Validation)
*   **Lucide React** (Iconography)

### Backend
*   **Node.js & Express** (Server)
*   **Prisma ORM** (Database Management)
*   **PostgreSQL** (Production DB via Supabase)
*   **SQLite** (Local Development DB)

---

## 🚀 Local Setup & Installation

If you wish to run the full-stack application locally on your machine:

### 1. Clone & Install Dependencies
Ensure you have Node.js (v18+) installed.
```bash
git clone https://github.com/tannu005/lendswift-loan-portal.git
cd lendswift-loan-portal
npm install
cd backend
npm install
```

### 2. Configure the Database
In the `/backend` folder, create a `.env` file for your database connection:
```env
DATABASE_URL="file:./dev.db" # For local SQLite
```
Then, push the Prisma schema to generate your local database:
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 3. Start the Servers
LendSwift uses two servers (one for the API, one for the UI). Open two terminal windows in the root folder:

**Terminal 1 (Backend):**
```bash
npm run start:backend
```
*Server will start on http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*Frontend will start on http://localhost:5173*

---

## 👨‍💻 Admin Dashboard
To view live applications retrieved from the backend database, navigate to the `/admin` route in your browser, or click the "Admin" button in the top navigation bar.

---
*Designed & Engineered for Production.*
