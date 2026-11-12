# Frontend Help

Guide for working on the StrayAssist frontend. For the full stack, see the root [help.md](../help.md). For architecture, see [README.md](README.md).

## Requirements

- Bun 1.4 or newer, or Docker
- The backend running if you need `/api` calls

## Commands

Run from `frontend/`.

| Command | Purpose |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Dev server at `http://localhost:5173` |
| `bun run build` | Production build into `dist/` |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Serve the production build |
| `bun run lint` | ESLint |
| `bun run format` | Prettier (write) |
| `bun run test` | Run tests once |
| `bun run test:watch` | Tests in watch mode |
| `bunx tsc --noEmit` | Type check |

Before pushing, run the same checks CI runs:

```bash
bun run lint && bunx tsc --noEmit && bun run test && bun run build
```

## Calling the Backend

Always use absolute paths:

```ts
fetch('/api/hello')
```

Never use relative paths such as `fetch('api/hello')`. Vite would answer with `index.html` instead of JSON.

Make API calls in the browser (effects or query hooks), not in route loaders. The app renders on the server too, and a relative URL fails there.

Example:

```tsx
import { useEffect, useState } from 'react';

export function HelloMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((response) => response.json())
      .then((data: { message: string }) => setMessage(data.message));
  }, []);

  return <p>{message}</p>;
}
```

The Vite proxy in `vite.config.ts` forwards `/api` to `VITE_PROXY_TARGET`:

| Environment | Value |
|---|---|
| Docker | `http://backend:8080` |
| Local | `http://localhost:8080` (default) |

The proxy works in the dev server only.

## Adding a Page

1. Create a file in `src/routes/`. The file name sets the URL: `faq.tsx` becomes `/faq`, `shelters.$slug.tsx` becomes `/shelters/:slug`.
2. Start the dev server. The router plugin regenerates `src/routeTree.gen.ts`. Do not edit that file by hand.
3. Add the page to the menus in `src/data/nav.ts` if it should appear in the navbar or footer.
4. Set the page title and description in the route's `head()`.

## Forms

- Validation rules live in `src/lib/inquiry-schemas.ts` (Zod)
- Shared inputs live in `src/components/site/form-fields.tsx`
- Forms do not submit anywhere yet. Connect them to a backend endpoint under `/api`.

## Tests

- Location: `src/test/`
- Routing test: every main URL must match a real route
- Inquiry rules test: adopter requirements
- When you add a route, add its URL to the routing test

## Code Style

- Prettier: 100 columns, semicolons, single quotes
- Import alias: `@/*` maps to `src/*`
- Strict TypeScript, including `noUncheckedIndexedAccess`
- Read environment variables with brackets: `process.env['NAME']`

## Troubleshooting

**Fetch returns HTML**
Use `/api/...`, not `api/...`, and restart the dev server after changing `vite.config.ts`.

**TS error: property comes from an index signature**
Use `process.env['VITE_PROXY_TARGET']` instead of dot access.

**Lint warnings in `src/components/ui`**
These are generated shadcn/ui files. The warnings are expected and do not fail CI.

**Tests fail on a missing route tree**
Run `bun run dev` or `bun run build` once so `src/routeTree.gen.ts` is generated.

**Dependency install blocked**
`bunfig.toml` skips versions published in the last 24 hours. Wait or pin an older version.

**Docker: new package not found**
Run `docker compose up --build -V frontend` from the repository root.
