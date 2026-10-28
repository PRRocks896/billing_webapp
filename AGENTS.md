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
- **Dates:** use `moment`. Check which format the endpoint expects (`YYYY-MM-DD` for face/manual attendance).
- **Forms:** new forms use react-hook-form (`Controller`), as in `useAddEditStaff.tsx`. Note `handleSubmit` passes a snapshot of values taken
  before async `validate` rules finish; read values set during validation with `getValues()` in the submit handler.

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
