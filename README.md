# Greenday Billing – Admin Web App

React admin panel for the Greenday billing system: bills, customers, staff and attendance (including face
recognition), salary, memberships, laundry, rent, reports and website content. It talks to the REST API in
`../backend`. Built on the Able Pro Material React template.

## Stack
- React 19, TypeScript 5.9, Vite 7 (PWA via `vite-plugin-pwa`)
- MUI 7 (+ x-date-pickers), iconsax icons, React Router 7
- axios for HTTP, TanStack Query/Table, react-hook-form (+ Formik in older screens)
- face-api.js (browser face detection/descriptors for attendance), moment / date-fns / dayjs

## Getting started
```bash
npm install
cp .env .env.local   # or edit .env, see Environment below
npm start            # Vite dev server on http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm start` | Dev server (port 3000) |
| `npm run build` | `tsc` type-check, then production build using `.env` |
| `npm run build-stage` | Build using `.env.qa` |
| `npm run preview` | Serve the built `dist/` |
| `npm run lint` | ESLint over `src/` |
| `npm run prettier` | Format `src/` (140 cols, single quotes, no trailing commas) |

### Environment
Vite variables (all `VITE_APP_*`):

| Variable | Purpose |
| --- | --- |
| `VITE_APP_API_URL` / `VITE_APP_API_DEV` / `VITE_APP_API_PROD` | Backend base URL. Chosen by hostname in `src/utils/axios.ts` (localhost, host containing `dev`, otherwise prod). Falls back to `http://localhost:3010/` |
| `VITE_APP_API_KEY` | Sent as the `x-api-key` header on every request |
| `VITE_APP_BASE_NAME` | Router/Vite base path |
| `VITE_APP_GOOGLE_MAPS_API_KEY`, `VITE_APP_FIREBASE_*` | Optional third-party integrations from the template |

## Project layout
```
src/
  pages/<feature>/        Screens grouped by feature (staff-management, bill, customer, report, ...)
    <screen>/index.tsx    List/page component
    <screen>/hooks/       use<Screen>.tsx: state, fetching and table columns
    <screen>/component/   Add/edit/view forms and dialogs
  service/<domain>.ts     One axios wrapper per backend module (staff.ts, attendance.ts, face.ts, ...)
  components/             Shared UI: DynamicTable, SearchContainer, CustomDailogBox, OtpModal, MainCard...
  contexts/JWTContext.tsx Auth state: login via OTP, isAdmin/isBranch, accessRights, loading overlay
  routes/                 MainRoutes (protected), LoginRoutes, lazy-loaded pages
  menu-items/             Sidebar navigation definitions
  utils/                  axios instance, constants (API paths), helpers
  api/snackbar.ts         openSnackbar() toast helper
```
Imports are absolute from `src` (e.g. `import useAuth from 'hooks/useAuth'`), via `baseUrl` in `tsconfig.json`.

## How things work
- **Auth:** phone OTP login (`/api/auth/login-via-phone` then `/api/auth/verify-otp`). The JWT is kept in
  `localStorage.serviceToken` and sent as `Authorization: <token>` by the axios interceptor; a 401 clears it and returns to login.
- **Permissions:** `useAuth().accessRights(pathname)` returns `{ add, edit, delete, view }` per route; admins get everything.
  `isAdmin` is true for the roles `admin` / `super admin`; `isBranch` for `branch`. Branch users only see their own branch data.
- **Lists:** a page calls its `service/*` list function with `{ where, pagination }` and renders `DynamicTable` with `Column` definitions
  from the page hook.
- **Face recognition:** one page, `pages/staff-management/face-recognition` (menu "Face Recognition", `/face-attendance`;
  `/face-register` serves the same page). It lists staff; the row button is "Register Face" until a face is registered, then
  "Mark Attendance". Both open `FaceCaptureDialog`: a random head-turn liveness challenge (`/api/face/liveness/start`, then
  `component/livenessChallenge.ts`), then 128-d face-api.js descriptors (models in `public/models`) are posted to
  `/api/face/register` or `/api/face/verify` (with `staffId`, so the face must match that staff) together with the
  `challengeId` and yaw proof, which the server checks and consumes (`api/admin/face/liveness.service.js` in the backend).
- **Manual attendance:** the staff list has a per-row "Mark Attendance" button that opens `markAttendanceModal.tsx` and posts to `/api/attendance`.

## Adding a feature (typical)
1. Add the endpoint constant in `src/utils/constant.ts` and a wrapper in `src/service/<domain>.ts`.
2. Create `src/pages/<feature>/index.tsx` plus `hooks/use<Feature>.tsx` (copy `pages/staff-management/staff` as a reference).
3. Register a lazy route in `src/routes/MainRoutes.tsx` and a menu entry in `src/menu-items/`.
4. Make sure the backend module exists and the role has rights for the route path.

## Known caveats
- `.env` and `.env.qa` are tracked by git (only `dist` is ignored). Do not put real secrets in them.
- The package name and several folders (`admin-panel`, `apps`, `components-overview`, `widget`...) are leftovers from the template and are not part of the billing product.
- Date formats vary by endpoint (`YYYY-MM-DD` vs `DD-MM-YYYY`); check the backend before sending dates.
