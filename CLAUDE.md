# CLAUDE.md

## Stack
- React + TypeScript + Vite + Tailwind v4 (CSS `@theme` in `src/index.css`)
- Package manager: **pnpm**
- UI primitives: shadcn/ui (new-york style) + Radix + Headless UI
- Path alias: `@/*` → `src/*`

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — typecheck + build (`tsc && vite build`)
- `pnpm lint:check` / `pnpm lint:fix`

## Conventions
- Tailwind v4: use CSS custom properties from `src/index.css` `@theme` block, not `tailwind.config`
- Brand colors defined as `--color-primary-*`, `--color-secondary-*` etc. in `@theme`
- Brand font: Plus Jakarta Sans (see `docs/branding-guidelines.md`)
- Local inventory DB schema: `local-data/SCHEMA.md`
