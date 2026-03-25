# AI Interior Design Platform (MVP)


This repo contains a monorepo scaffold for the MVP:

- `frontend/`: React Native (TypeScript) app using Expo
- `backend/`: Node.js (TypeScript) API with MongoDB wiring

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- MongoDB connection string (Atlas or local)

## Quick start

Install deps:

```bash
npm install
```

### Backend

1. Create `backend/.env` from `backend/.env.example`
2. Run:

```bash
npm run dev:backend
```

Health check: `GET /health`

### Frontend

1. Create `frontend/.env` from `frontend/.env.example` (optional)
2. Run:

```bash
npm run dev:frontend
```

## API contracts

See `docs/api-contracts.md`.

