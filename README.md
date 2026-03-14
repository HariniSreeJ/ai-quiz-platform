# AuraQuiz — AI-Powered Quiz Platform

An intelligent full-stack quiz application that dynamically generates quizzes on any topic using **Google Gemini AI**, allowing users to track their learning progress through detailed analytics and AI-powered explanations.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React, CSS Modules |
| Backend | Django 5, Django REST Framework, SimpleJWT |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI | Google Gemini 2.5 Flash |

## Features

- ✅ JWT Authentication (Register, Login, Profile)
- ✅ Dynamic AI Quiz Generation on any topic
- ✅ Real-time quiz taking with progress tracking
- ✅ Score & results dashboard with AI-generated explanations
- ✅ Topic-wise performance analytics
- ✅ Premium glassmorphic dark UI with micro-animations
- ✅ Responsive design

## Project Structure

```
ai_quiz_platform/
├── backend/           # Django REST API
│   ├── config/        # Django settings & URLs
│   ├── users/         # Custom User model & JWT auth
│   ├── quizzes/       # Quiz, Question models & AI service
│   ├── analytics/     # Attempt submission & performance stats
│   ├── build.sh       # Render deployment script
│   └── render.yaml    # Render Blueprint IaC
├── frontend/          # Next.js application
│   ├── app/           # App Router pages
│   ├── context/       # AuthContext (JWT state)
│   ├── lib/           # Axios API client
│   └── components/    # Navbar & reusable UI
└── .gitignore
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Set your Gemini API key:
```bash
$env:GEMINI_API_KEY="your_key_here"   # PowerShell
```

Run migrations and start the server:
```bash
python manage.py migrate
python manage.py runserver 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register/` | Register new user |
| POST | `/api/users/login/` | Get JWT tokens |
| GET | `/api/users/me/` | Get current user profile |
| GET/POST | `/api/quizzes/` | List quizzes / Create AI quiz |
| GET | `/api/quizzes/:id/` | Get quiz with questions |
| POST | `/api/analytics/submit/` | Submit quiz attempt |
| GET | `/api/analytics/performance/` | Get user analytics |

## Deployment

### Backend → Render
1. Push to GitHub
2. Render → New Blueprint → select this repo
3. Add `GEMINI_API_KEY` in Render dashboard

### Frontend → Vercel
1. Vercel → New Project → Import repo
2. Root Directory: `frontend`
3. Add env var: `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`

## Architecture Decisions

- **Modular Monolith**: Django project split into `users`, `quizzes`, `analytics` apps
- **JWT Auth**: Stateless API authentication via SimpleJWT
- **AI Fallback**: Mock question generator when Gemini API is unavailable
- **CSS Modules**: Premium styling without framework dependencies
- **React Context**: Global auth state management via `AuthContext`
