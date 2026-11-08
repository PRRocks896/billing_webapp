# Responsive QA checklist

Used to verify every phase of the mobile/tablet work (branch `feature/responsive-ui`). Run it before and after each phase;
desktop (1280 / 1440) must not regress.

## How to run
```bash
npm start            # Vite on http://localhost:3000 (host: true, so a phone/tablet on the same Wi-Fi can open http://<LAN-IP>:3000)
# backend: ../backend on localhost, OTP 123456
npx tsc --noEmit && npm run lint
```
Use Chrome DevTools device mode and at least one real phone and one real tablet. Check light and dark theme.

## Viewport matrix
| Name | Size | Breakpoint after Phase 1 |
| --- | --- | --- |
| Phone small | 360 x 740 | xs |
| Phone | 390 x 844 | xs |
| Tablet portrait | 768 x 1024 | sm |
| Tablet landscape | 1024 x 768 | md |
| Desktop | 1280 x 800 | lg |
| Desktop wide | 1440 x 900 | lg |

Current theme breakpoints (before Phase 1): sm 768, md 1024, lg 1266, xl 1440. Target: sm 600, md 900, lg 1200, xl 1536.

## Key pages
Login/OTP, Dashboard, Bill list, Add/Edit bill (+ payment modal), Customer list (+ add customer), Staff list, Add/Edit staff,
Mark attendance (manual + face capture), Daily report (list + add/edit), Bill verify (+ detail), Salary, Membership, one master CRUD page
(e.g. City), Reports (sales, staff, laundry), Laundry challan/return.

## Acceptance checks per page
- [ ] No horizontal page scroll (horizontal scroll only inside data tables, and a sticky first column where noted).
- [ ] Interactive controls are at least 44 x 44 px on touch widths; icon-only actions have a label (aria-label, visible text or menu).
- [ ] Inputs use at least 16 px font on phones (no iOS zoom on focus).
- [ ] Dialogs are full-screen on phones and never overflow the viewport; primary actions stay reachable with the on-screen keyboard open.
- [ ] Forms are single column on phones, two columns on tablets.
- [ ] Bottom bars / FABs are not hidden by browser UI or the home-indicator (safe area).
- [ ] Orientation change keeps state and layout usable.
- [ ] Desktop 1280 / 1440 looks identical to the pre-change screenshots.

## Functional smoke (each phase touching the page)
Create a bill end to end; add a customer; mark attendance (manual and face); print a bill; export a report; change a master record.

## Breakpoint inventory (audit input for Phase 1)
Non-template files using `theme.breakpoints.up/down/between/only`: 39. Layout files depend on `down('lg')`
(`layout/Dashboard/{index,Header,Drawer}`) and `down('xl')` (`layout/Dashboard/index.tsx`); dashboard widgets and maintenance pages use `down('sm')`;
`Header/HeaderContent` uses `down('md')`. Re-map each when the breakpoint values change.
