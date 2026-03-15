# Aurum — Premium Investment Platform

> A full-stack monorepo featuring a highly interactive, Apple-inspired investment platform with scroll-based animations, real-time market data, and portfolio management.

![Aurum Platform](https://img.shields.io/badge/Aurum-Investment%20Platform-d4af37?style=for-the-badge)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)

---

## Overview

**Aurum** (Latin for *gold*) is a premium investment platform built as a monorepo with:

- **Backend**: NestJS REST API with Swagger documentation, data validation, rate limiting, and structured response interceptors
- **Frontend**: Next.js 14 app with GSAP scroll-triggered animations, Framer Motion transitions, Lenis smooth scrolling, and Recharts data visualizations — delivering an Apple-style immersive experience

---

## Tech Stack

### Backend (`apps/backend`)
| Technology | Purpose |
|---|---|
| NestJS 10 | Framework (modules, pipes, guards, interceptors) |
| TypeScript 5 | Type safety |
| Swagger / OpenAPI | Auto-generated API docs |
| class-validator | DTO validation |
| Helmet | HTTP security headers |
| @nestjs/throttler | Rate limiting |

### Frontend (`apps/frontend`)
| Technology | Purpose |
|---|---|
| Next.js 14 | React framework (App Router) |
| TypeScript 5 | Type safety |
| GSAP + ScrollTrigger | Scroll-based animations (Apple-style) |
| Framer Motion | Component animations & transitions |
| Lenis | Smooth scroll |
| Tailwind CSS | Utility-first styling |
| Recharts | Interactive financial charts |
| Lucide React | Icon library |

### Monorepo
| Technology | Purpose |
|---|---|
| npm Workspaces | Monorepo management |
| concurrently | Run multiple processes simultaneously |

---

## Project Structure

```
aurum/
├── apps/
│   ├── backend/                    # NestJS API
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   ├── filters/        # Global exception filter
│   │   │   │   └── interceptors/   # Response transform interceptor
│   │   │   ├── modules/
│   │   │   │   ├── market-data/    # Market assets, charts, overview
│   │   │   │   ├── portfolio/      # Portfolio CRUD + performance
│   │   │   │   ├── assets/         # Investment products + stats
│   │   │   │   └── news/           # Financial news feed
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── .env
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                   # Next.js App
│       ├── src/
│       │   ├── app/
│       │   │   ├── globals.css     # Global styles + Tailwind
│       │   │   ├── layout.tsx      # Root layout
│       │   │   └── page.tsx        # Home page (composes all sections)
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── Navbar.tsx  # Animated sticky navbar
│       │   │   │   └── Footer.tsx  # Footer with links
│       │   │   ├── sections/
│       │   │   │   ├── HeroSection.tsx         # Full-screen hero + floating cards
│       │   │   │   ├── StatsSection.tsx        # Animated counters
│       │   │   │   ├── ProductsSection.tsx     # Investment products grid
│       │   │   │   ├── MarketSection.tsx       # Live market + chart panel
│       │   │   │   ├── TechSection.tsx         # Features + phone mockup
│       │   │   │   ├── TestimonialsSection.tsx # Client testimonials
│       │   │   │   ├── NewsSection.tsx         # Financial news feed
│       │   │   │   └── CtaSection.tsx          # Call to action
│       │   │   └── ui/
│       │   │       ├── AnimatedCounter.tsx     # IntersectionObserver count-up
│       │   │       └── MarketTicker.tsx        # Scrolling market ticker
│       │   ├── hooks/
│       │   │   └── useScrollAnimation.ts       # GSAP scroll animations hook
│       │   └── lib/
│       │       └── api.ts                      # API client
│       ├── .env.local
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       └── package.json
│
├── package.json                    # Root package.json with workspaces
└── README.md
```

---

## Features

### Animations & Interactions (Apple-style)
- **Lenis smooth scroll** — buttery smooth page scrolling
- **GSAP ScrollTrigger** — elements animate in as you scroll (fade, slide, scale)
- **Parallax effects** — hero background orbs and phone mockup move at different scroll speeds
- **Floating asset cards** — market cards float with staggered animations
- **Hero parallax** — text fades and translates as you scroll away
- **GSAP pinned sections** — technology section animates on scroll

### Investment Platform
- **Live-style market ticker** — scrolling horizontal ticker with price changes
- **Interactive market table** — click any asset to see its chart
- **Area chart** — 30-day price history with gold gradient fill
- **Animated counters** — numbers count up when scrolled into view
- **Portfolio overview** — sparkline chart, P&L, allocation breakdown
- **Phone mockup** — live-animated mobile UI preview

### Backend API
- **RESTful API** at `http://localhost:3001/api/v1`
- **Swagger docs** at `http://localhost:3001/api/docs`
- 4 modules: Market Data, Portfolio, Assets, News
- Rate limiting (100 req/min)
- Request validation (DTOs)
- Standardized responses (success/error envelope)

---

## Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|---|---|---|
| Node.js | >= 18.0.0 | [nodejs.org](https://nodejs.org) |
| npm | >= 9.0.0 | Included with Node.js |
| Git | any | [git-scm.com](https://git-scm.com) |

Verify your versions:
```bash
node --version   # Should output v18.x.x or higher
npm --version    # Should output 9.x.x or higher
```

---

## Running Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd aurum
```

### 2. Install all dependencies

From the root of the monorepo, run:

```bash
npm install
```

This installs dependencies for both `apps/backend` and `apps/frontend` via npm workspaces.

### 3. Configure environment variables

The `.env` files are already pre-configured for local development:

**Backend** (`apps/backend/.env`):
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Aurum
NEXT_PUBLIC_APP_DESCRIPTION=Premium Investment Platform
```

> These defaults work out of the box — no changes needed for local development.

### 4. Run both apps simultaneously

```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:3001`
- **Frontend** on `http://localhost:3000`

You can also run them independently:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### 5. Open the app

| URL | Description |
|---|---|
| `http://localhost:3000` | Frontend — Aurum investment platform |
| `http://localhost:3001/api/docs` | Backend — Swagger API documentation |
| `http://localhost:3001/api/v1/market` | Market data API endpoint |
| `http://localhost:3001/api/v1/portfolios/demo` | Demo portfolio endpoint |

---

## API Documentation

Once the backend is running, open the interactive Swagger UI:

```
http://localhost:3001/api/docs
```

### API Endpoints

#### Market Data
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/market` | List all market assets |
| GET | `/api/v1/market/overview` | Market overview (top gainers, losers, trending) |
| GET | `/api/v1/market/:symbol` | Single asset by symbol (e.g. `AAPL`, `BTC`) |
| GET | `/api/v1/market/:symbol/chart` | OHLCV chart data |

#### Portfolio
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/portfolios` | List all portfolios |
| POST | `/api/v1/portfolios` | Create new portfolio |
| GET | `/api/v1/portfolios/:id` | Portfolio detail with P&L |
| POST | `/api/v1/portfolios/:id/assets` | Add asset to portfolio |
| GET | `/api/v1/portfolios/:id/performance` | 90-day performance history |

#### Assets
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/assets/products` | Investment products |
| GET | `/api/v1/assets/stats` | Platform statistics |

#### News
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/news` | Latest financial news |

### Response Format

All successful responses follow this envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-03-15T12:00:00.000Z",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2026-03-15T12:00:00.000Z",
  "path": "/api/v1/market/INVALID",
  "message": "Not Found"
}
```

---

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port the NestJS server listens on |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | `development` | Environment mode |

### Frontend (`apps/frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | `Aurum` | App name |
| `NEXT_PUBLIC_APP_DESCRIPTION` | `Premium Investment Platform` | Meta description |

---

## Available Scripts

From the **monorepo root**:

| Script | Description |
|---|---|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build both apps for production |
| `npm run build:backend` | Build backend only |
| `npm run build:frontend` | Build frontend only |
| `npm run start` | Start both apps in production mode (requires build) |
| `npm run lint` | Lint both apps |

---

## Production Build

```bash
# Build everything
npm run build

# Start in production
npm run start
```

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | Full |
| Firefox 88+ | Full |
| Safari 14+ | Full |
| Edge 90+ | Full |

---

## License

MIT © 2026 Aurum Capital

---

*Built with NestJS, Next.js, GSAP, Framer Motion, and Tailwind CSS*
