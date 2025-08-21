## AI Assistant Project Instructions

Focused guidance for automated coding agents working in this repository. Keep output concise and align with actual patterns in the codebase (avoid generic boilerplate).

### 1. Stack & Structure

- Framework: Next.js 15 App Router (`src/app`), Turbopack dev/build (`package.json` scripts).
- Styling: Tailwind CSS v4 (layered tokens + OKLCH color system) configured directly in `src/app/globals.css`. Utility merge helper `cn` in `src/lib/utils.ts` (always use it to combine dynamic class lists to avoid Tailwind conflict duplication).
- Testing: Vitest configured for basic testing via `vitest.config.ts` with jsdom environment. Add new tests by extending Vitest config or creating test files.

### 2. Conventions & Patterns

- Path alias: `@/*` maps to `./src/*` (see `tsconfig.json`). Prefer absolute alias imports inside `src` instead of long relative chains.
- Components default to Server Components unless client features are needed. Add `'use client'` only when using state, hooks, browser APIs, or external libs requiring the DOM.
- Reusable UI helpers: keep tiny utilities in `src/lib`; co-locate feature components under future feature folders inside `src/app` (route segments) unless they are pure shared UI → then place in a new `src/components` (create when first needed).
- Class names: favor Tailwind utilities; when composing conditionally use `cn()`.
- Keep tokens consistent: reference semantic CSS custom properties already declared in `globals.css` (e.g. `var(--color-primary)`) instead of introducing raw hex values.

### 3. Accessibility & Semantics

- Follow existing patterns: `alt` text on informative images (see `page.tsx`), `aria-hidden` for purely decorative icons. When adding icons from `lucide-react`, supply `aria-label` or `aria-hidden` appropriately.
- Maintain heading hierarchy: single top-level `<h1>` per page/route.

### 4. Adding Features / Files

- New route: create folder under `src/app/<segment>/page.tsx`; export default component + optional `metadata`. Reuse `RootLayout` fonts/classes.
- Client interactivity: create a Client Component (`'use client'`) and import into a Server route component—do not use dynamic import with `ssr:false` inside Server Components.
- Styles: Prefer Tailwind utilities; only add bespoke CSS if cannot be expressed; place additional global tokens in `globals.css` (mind dark theme overrides) or use component-scoped CSS Modules if isolation needed.
- State management: prefer colocated React state; only introduce `zustand` for cross-route global state (library already available).
- Data fetching: choose between (a) Server Component async/`fetch` for static/SSR, (b) client caching via `@tanstack/react-query` or `swr` (both installed) when you need revalidation or mutations. Do not mix both for the same resource without a clear cache strategy.

### 5. Testing Workflow

- For any new component: create appropriate test files with Vitest.
- To add tests: create test files in appropriate locations and configure via `vitest.config.ts`.

### 6. Linting & Formatting

- ESLint flat config extends `next/core-web-vitals`. Run with `npm run lint`. Fix issues before committing; prefer code actions rather than disabling rules unless justified.

### 7. Scripts & Commands (macOS/zsh)

- Dev server: `npm run dev` (Turbopack).
- Production build: `npm run build`; start: `npm start`.
- Lint: `npm run lint`.

### 8. Dependency Usage Notes

- `class-variance-authority` not yet used—introduce only if creating variant-heavy components (document pattern in this file when first applied).
- `zod` + `@hookform/resolvers` + `react-hook-form` available—if building forms, use schema-driven validation with accessible error messaging.
- Choose between `react-query` and `swr` per feature; do not use both simultaneously for identical endpoints.

### 9. Security & Reliability

- Only client-side UI currently; if adding API route handlers (`src/app/api/.../route.ts`), validate input with `zod` and return proper status codes; never trust user input; avoid leaking stack traces.

### 10. When Unsure

- Prefer minimal, idiomatic Next.js App Router patterns; document any new cross-cutting pattern (state store shape, data fetching abstraction, theme extension) by appending a new concise section here.

Keep this file short (≤ ~50 lines). Update it whenever you introduce a new architectural pattern so future AI agents inherit context.
