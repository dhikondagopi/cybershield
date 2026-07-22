# CyberShield AI — Backend (Node.js + Express + MongoDB)

Production-ready REST backend that pairs with the frontend under `src/`.
The frontend ships with a full mock adapter, so this backend is optional
for local UI work. To hit the real backend:

1. Copy `.env.example` at the project root to `.env.local`.
2. Set `VITE_USE_MOCK_API=false`.
3. Point `VITE_API_BASE_URL` at this service (default `http://localhost:4000/api`).

## Stack

- Node.js 20+
- Express 4
- MongoDB Atlas (Mongoose ODM)
- JWT access + refresh tokens (rotation on refresh)
- Role-based access control: `soc_analyst`, `soc_manager`, `administrator`

## Endpoints

Mirrors the mock adapter in `src/api/mock-adapter.ts`:

- Auth: `POST /auth/{login,register,logout,refresh}`, `GET /auth/profile`
- Dashboard: `GET /dashboard/{summary,charts,alerts,threats}`
- Incidents: `GET|POST /incidents`, `GET|PATCH /incidents/:id`,
  `POST /incidents/:id/{close,assign,comments,evidence}`
- Threat Intel: `GET /threat-intel/{feed,cves,iocs,actors,mitre}`
- Copilot: `POST /copilot/{chat,log-analysis,report,threat-analysis}`
- Anomalies: `GET /anomalies/{network,user,device,risk-score}`
- Assets: `GET /assets`, `GET /assets/{servers,endpoints,cloud,iot,firewalls}`
- Network: `GET /network/graph`
- Reports: `GET /reports`, `POST /reports/generate`

## Suggested layout

```
server/
  src/
    index.ts               # express bootstrap
    config/env.ts          # dotenv + zod validation
    db/mongo.ts            # mongoose connect
    middleware/auth.ts     # JWT verify + requireRole
    middleware/error.ts    # centralized error handler
    modules/
      auth/                # controller + service + model + routes
      incidents/
      threat-intel/
      copilot/
      anomalies/
      assets/
      network/
      reports/
    utils/jwt.ts
  package.json
  .env.example
```

## Environment

```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/cybershield
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
JWT_ACCESS_TTL=1h
JWT_REFRESH_TTL=30d
CORS_ORIGIN=http://localhost:5173
```

## Auth response contract

```json
{
  "user": { "id": "...", "email": "...", "name": "...", "role": "soc_analyst", "createdAt": "..." },
  "tokens": { "accessToken": "...", "refreshToken": "...", "expiresIn": 3600 }
}
```

The frontend `apiClient` refresh interceptor calls `POST /auth/refresh`
with `{ refreshToken }` and expects the same shape.
