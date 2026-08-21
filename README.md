# Aarav Enterprises — Master Business Management System

A full-stack business website & AI-powered WhatsApp business management system built for **Aarav Enterprises** (Graphic Design, Multimedia, Branding, and Printing Services in Pune).

---

## 📁 Directory Structure

```
Aarav Enterprise/
├── database/            # MySQL schema migrations & seed files
│   ├── migrations/      # 10 table migration scripts
│   ├── seeds/           # 5 initial seed scripts
│   └── setup.sql        # Master database initialization runner
├── backend/             # Node.js + Express REST API & AI/WhatsApp Pipeline
│   ├── src/
│   │   ├── config/      # DB pool & constants
│   │   ├── controllers/ # REST API route controllers
│   │   ├── integrations/# Multilingual AI (OpenAI/Gemini/Mock) & WhatsApp Cloud API
│   │   ├── middleware/  # JWT auth, Multer upload, error handling
│   │   ├── models/      # Data access layer (SQL)
│   │   ├── routes/      # Express routes
│   │   └── services/    # Webhook pipeline service
│   └── .env.example
├── frontend/            # React + Vite + Tailwind CSS Website & Admin Panel
│   ├── src/
│   │   ├── components/  # Navbar, Footer, Admin Header & Sidebar
│   │   ├── layouts/     # Public & Admin Layout wrappers
│   │   ├── pages/       # Public website pages & Admin panel pages
│   │   ├── services/    # Axios API client
│   │   └── utils/       # WhatsApp URL generator & helpers
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quick Setup Instructions

### 1. Database Initialization
Make sure MySQL is running on `localhost:3306`, then run:
```bash
mysql -u root -p < database/setup.sql
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
The backend API will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend website will run on `http://localhost:5173`.

---

## 🔑 Default Credentials

- **Admin Login:** `admin@aaraventerprises.com`
- **Default Password:** `Admin@123`
- **Admin Panel URL:** `http://localhost:5173/admin`

---

## 🌐 Multilingual AI Features

- Automatically detects customer language: **English**, **Hindi**, **Marathi**, or **Mixed (Hinglish/Marathi-English)**.
- Gathers project requirements iteratively before generating an inquiry.
- Built-in human handoff detection flags conversations when customers request live agent assistance.

