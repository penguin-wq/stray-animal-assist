# StrayAssist Help

Quick reference for running and troubleshooting the full stack. Part-specific guides: [frontend/help.md](frontend/help.md) and [backend/help.md](backend/help.md).

## Overview

| Part | Stack | URL |
|---|---|---|
| Frontend | React, TanStack Start, Vite | `http://localhost:5173` |
| Backend | Java 21, Spring Boot, Gradle | `http://localhost:8080` |

```
stray-animal-assist/
├── .github/workflows/   ci.yaml, backend-ci.yaml
├── frontend/            Web app
├── backend/             REST API
├── docker-compose.yml
└── help.md
```

The frontend calls the API with paths like `/api/hello`. The Vite dev server proxies `/api` to the backend, so no CORS setup is needed.

## Prerequisites

With Docker (recommended):

- Docker Desktop (Compose v2)

Without Docker:

- JDK 21
- Bun 1.4 or newer

## Quick Start

```bash
docker compose up --build
```

The first build takes a few minutes. Later starts are much faster.

Verify the connection:

```bash
curl http://localhost:8080/api/hello
curl http://localhost:5173/api/hello
```

Both return `{"message":"Hello from Spring Boot"}`. The second request goes through the proxy.

## Docker Commands

| Command | Purpose |
|---|---|
| `docker compose up --build` | Build and start everything |
| `docker compose up -d` | Start in the background |
| `docker compose down` | Stop and remove containers |
| `docker compose ps` | Show running services |
| `docker compose logs -f backend` | Follow backend logs |
| `docker compose logs -f frontend` | Follow frontend logs |
| `docker compose up --build backend` | Rebuild after backend changes |
| `docker compose up --build -V frontend` | Rebuild after changing frontend dependencies |
| `docker compose restart frontend` | Restart after editing `vite.config.ts` |

Frontend source edits hot-reload through the `./frontend` volume mount. Backend changes always need a rebuild.

## Run Without Docker

Use two terminals.

```bash
cd backend
./gradlew bootRun
```

```bash
cd frontend
bun install
bun run dev
```

On Windows use `gradlew.bat bootRun`. The proxy falls back to `http://localhost:8080` when `VITE_PROXY_TARGET` is not set.

## Environment

| Variable | Where | Value |
|---|---|---|
| `VITE_PROXY_TARGET` | Frontend dev server | `http://backend:8080` in Docker, `http://localhost:8080` locally |

## CI

| Workflow | Runs when | Steps |
|---|---|---|
| `ci.yaml` | `frontend/**` changes | Install, lint, type check, test, build |
| `backend-ci.yaml` | `backend/**` changes | `./gradlew build` on Java 21 |

Both run on pushes to `main` and on pull requests.

## Troubleshooting

**`/api/...` returns HTML instead of JSON**
The request used a relative path (`api/hello`) or the proxy is not active. Use an absolute path (`/api/hello`) and restart the frontend after editing `vite.config.ts`.

**`/api/...` returns 404**
The endpoint is not under `/api`. The proxy only forwards paths that start with `/api`.

**Proxy error or connection refused**
The backend is not running or not ready. Check `docker compose ps` and `docker compose logs backend`. The backend takes about 15 seconds to start.

**Port 5173 or 8080 already in use**
Stop the other process or run `docker compose down` to clear old containers.

**New npm package is missing inside Docker**
The container keeps its own `node_modules` volume. Run `docker compose up --build -V frontend` to rebuild and refresh it.

**Hot reload does not pick up edits (Windows)**
Add `watch: { usePolling: true }` inside `server` in `frontend/vite.config.ts`, then restart the frontend.

**`permission denied: ./gradlew`**
Run `chmod +x backend/gradlew`.

**Backend image fails to build**
Make sure `backend/gradle/wrapper/gradle-wrapper.jar` is committed and not ignored.

**`bun install --frozen-lockfile` fails in CI**
`bun.lock` is out of sync with `package.json`. Run `bun install` in `frontend/` and commit the updated lockfile.
