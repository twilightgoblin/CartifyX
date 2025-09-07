# CartifyX

CartifyX is a small Next.js e-commerce demo built with Next 14, Radix UI primitives, Tailwind CSS and client-side mock data (localStorage) for carts, wishlist and users.

## Quick overview
- Framework: Next.js 14
- React: 18.2.0
- Styling: Tailwind CSS (v4) + utility components
- UI primitives: Radix UI
- Local data: `lib/data-service.js` (localStorage-backed helpers for dev)

## Requirements
- Node.js >= 18 (recommended)
- pnpm (preferred) or npm/yarn

## Install
```bash
pnpm install
```

## Development
Start the dev server (hot-reloads):

```bash
pnpm dev
# or
npm run dev
```

Open http://localhost:3000

## Build / Production
Create a production build and run:

```bash
pnpm build
pnpm start
```

Notes:
- A `vercel-build` script is present for Vercel.
- `package.json` pins React to 18.2.0 and contains `engines.node` to help Vercel pick Node >=18.

## Deploying to Vercel
1. Push the repo to GitHub (or connect your repo to Vercel).  
2. In Vercel import the project and confirm:
   - Build command: `npm run vercel-build` or `pnpm vercel-build` (Vercel will also use `next build` automatically).
   - Node version >= 18 in the Environment settings (Vercel respects `engines.node`).
3. Add environment variables in Vercel if you later integrate a real backend.

## Project structure (high level)
- `app/` — Next.js app routes and pages
- `components/` — UI components, layout, product cards, cart components
- `hooks/` — React hooks (use-cart, use-wishlist, use-orders)
- `lib/` — `data-service.js`, `auth-context.jsx` (client-side mock data + helpers)
- `styles/` — global Tailwind/CSS
- `public/` — static assets

## Testing
- No unit tests included by default. Recommended: add Jest/React Testing Library for components and logic tests.

## Troubleshooting
- Dropdowns (user menu) rely on Radix primitives — if the menu doesn't open on desktop, try:
  - Ensure the app is built with the latest code and that custom `Button`/`DropdownMenuTrigger` forward refs (already implemented).
  - If clicks are unresponsive, check overlays (toasts/sheets) that may block pointer events. The app includes a CSS override to keep the header interactive when `body[data-scroll-locked]` is set.
- If a build fails, run `pnpm build` locally and inspect the error messages.

## Recommended next steps
- Add unit/integration tests for `lib/data-service` and hooks.
- Replace localStorage mocks with a real backend or serverless API routes when ready.

## License & Contact
This repository is private. For questions or help, open an issue or contact the maintainer in the repo.
