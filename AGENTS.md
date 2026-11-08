# AGENTS.md

Guidance for AI coding agents working in this web app. See [README.md](README.md) for setup and architecture.

## Quick facts
- React 19 + TypeScript + Vite + MUI 7. No test suite. Lint: `npm run lint`. Type-check: `npx tsc --noEmit` (also run by `npm run build`).
- Backend lives in `../backend` (Express + Prisma). The mobile app is `../billing_mobile`. Keep API contracts compatible with both.
- Formatting (Prettier): 2 spaces, single quotes, 140 columns, no trailing commas, LF. Some older files use 4 spaces; match the file you edit.

## Conventions to follow
- **Screen structure:** `pages/<feature>/<screen>/index.tsx` (render) + `hooks/use<Screen>.tsx` (state, fetch, `Column` definitions) +
  `component/` (forms/dialogs). Copy `pages/staff-management/staff` rather than inventing a new pattern.
- **API calls:** only through `src/service/<domain>.ts` wrappers that use `get/post/put/del` from `utils/axios`. Add path constants to
  `utils/constant.ts`. Responses are already unwrapped to `{ success, message, data }`; always check `success`.
- **Async handler pattern:** `startLoading()` / try / `openSnackbar(...)` on success and error / `finally { stopLoading() }` (see `onStatusChange`
  in `useStaff.tsx`).
- **Permissions:** gate buttons and routes with `isAdmin` and `accessRights(pathname)` from `useAuth()`. Never rely on hiding a button for security;
  the backend enforces access.
- **UI:** reuse `DynamicTable`, `SearchContainer`, `CustomDailogBox`, `OtpModal`, `MainCard`. Dialog forms follow `components/OtpModal.tsx` and
  `staff/component/markAttendanceModal.tsx` (title row with close icon, Divider, content, outlined Cancel + contained Submit).
- **Imports:** absolute from `src` (`import x from 'components/...'`). Icons from `iconsax-reactjs`.
- **Dates:** use `moment`. Check which format the endpoint expects (attendance rows use `DD-MM-YYYY`, for manual and face punches alike).
- **Forms:** new forms use react-hook-form (`Controller`), as in `useAddEditStaff.tsx`. Note `handleSubmit` passes a snapshot of values taken
  before async `validate` rules finish; read values set during validation with `getValues()` in the submit handler.

## Responsive UI (phones and tablets)
Staff use tablets, owners use phones; desktop must not regress. Full QA list: `docs/responsive-checklist.md`.
- **Breakpoints** (`src/themes/index.tsx`): xs 0, sm 600, md 900, lg 1200, xl 1440. Phone < 600, tablet 600-1199, desktop >= 1200 (permanent sidebar from `lg`).
  Dialog widths are pinned in `themes/overrides/Dialog.ts` so `maxWidth="sm|md|lg"` dialogs keep their old desktop size.
- **Touch sizing is gated on `@media (pointer: coarse)`** (44px buttons, icon buttons, toggles, pagination, list items; 16px input font), so mouse/desktop sizes are unchanged. Keep new controls inside the theme overrides, do not hardcode heights below 44px on touch.
- **Lists:** pass `mobileLayout="cards"` to `DynamicTable` for tables with more than ~4 columns (card layout below 600px; tables stay on tablet+). Per column,
  `HeadCell.mobile` = `'primary' | 'secondary' | 'hidden' | 'actions'`; a column with id `action`/`actions` becomes the card's action row. Use `stickyFirstColumn` for wide scrolling tables.
- **Filters:** wrap filter blocks in `components/FilterBar` (collapses behind a "Filters" button on phones; optional `activeCount`).
- **Dialogs:** use `useResponsiveDialog()` (`fullScreen` below 600px) for forms; compact confirm dialogs can stay small.
- **Add/edit forms:** footer `sx={formActionsSx(theme)}` (`components/formActionsSx.ts`) makes Cancel/Save a sticky bottom bar on phones. A card with `maxWidth` + `margin: '0 auto'` inside the page container must also set `width: '100%'`, otherwise it sizes to its content and overflows phones.
- **Check before finishing:** no horizontal page scroll at 320/390/768 (`document.documentElement.scrollWidth === innerWidth`), dark theme, and the desktop screens at 1280/1440 look unchanged. Safe-area insets (`env(safe-area-inset-*)`) are already applied in the dashboard layout and sticky bars.

## Things to avoid
- Do not edit `dist/` or `dev-dist/` (build output) or template-only folders (`pages/components-overview`, `pages/widget`, `sections/components-overview`...).
- Do not add dependencies without a clear need; the project already bundles MUI, TanStack, date and chart libraries.
- Do not commit real API keys: `.env` and `.env.qa` are tracked, so keep secrets out of them and never print their values.
- Do not change the shared `utils/axios.ts` interceptors, `JWTContext`, or `DynamicTable` behaviour as a side effect of a feature task.
- Don't change face-api.js models in `public/models` or descriptor handling: the backend matches 128-d face-api.js descriptors with Euclidean distance < 0.5.

## Verifying a change
1. `npx tsc --noEmit` and `npm run lint` on touched files.
2. `npm start`, log in (localhost backend OTP is `123456`), exercise the screen as admin and as a branch user, and watch the network tab for the request body and status.
3. For UI changes, check both light and dark themes and a narrow viewport.
