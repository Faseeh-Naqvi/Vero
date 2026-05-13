# Vero Clinic Booking System

A prototype clinic booking system with three distinct user roles (**Patient**, **Physician**, and **Admin**) built per the Vero PRD.

> Prototype only: no real auth, no payment processing, no external integrations. All data is mocked in local JSON and resets on refresh. Email/SMS notifications are UI-only.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS 3 |
| State | React Context + `useReducer` |
| Routing | React Router v6 |
| Icons | Lucide React |
| Calendar | `react-big-calendar` (drag & drop addon) |
| Dates | `date-fns` |

## Running it

```bash
npm install
npm run dev      # starts dev server at http://localhost:5173
npm run build    # production build into ./dist
npm run preview  # preview the production build
```

## Quick login (demo accounts)

The login page has clickable "Quick Login" chips that auto-fill credentials and submit. Or use these manually:

| Role | Email | Password |
|---|---|---|
| Patient (James Okafor) | `james@patient.com` | `patient1` |
| Patient (Elena Vasquez) | `elena@patient.com` | `patient2` |
| Patient (Tom Nguyen) | `tom@patient.com` | `patient3` |
| Physician (Dr. Sarah Chen) | `chen@clinic.com` | `doc1` |
| Physician (Dr. Marcus Webb) | `webb@clinic.com` | `doc2` |
| Physician (Dr. Priya Nair) | `nair@clinic.com` | `doc3` |
| Admin | `admin@clinic.com` | `admin` |

## What's in the prototype

**Patient**
- Dashboard with three-state urgent banner (no upcoming / has upcoming / physician cancelled, with 3-slot rebook)
- 5-step booking wizard: Physician → Date & Time → Details → Health Card (simulated OCR) → Confirm
- Appointment list with cancel/rebook
- 48-hour cancellation fee flow with mandatory acceptance checkbox
- Notifications panel via bell icon

**Physician**
- Dashboard with pending approvals queue and today's schedule
- Week/Day schedule with drag-to-reschedule and resize-to-adjust-duration
- Patient detail drawer with confirm / cancel / mark-complete

**Admin**
- Dashboard with stat cards, pending approvals queue (all physicians), and fees-owed list
- Multi-physician schedule view with toggleable filter chips
- "All Bookings" search & filter table
- Book-on-behalf-of-patient flow (auto-confirmed)

## File layout

```
src/
  context/AppContext.jsx          # Global state (Context + useReducer)
  data/
    mockData.js                   # Physicians, patients, seed appointments
    mockUsers.js                  # Login accounts + quick-login chips
  utils/
    dateUtils.js                  # date-fns helpers + formatting
    slotUtils.js                  # slot generation + 48hr check + next-3-slots
  components/
    shared/                       # Sidebar, Drawer, Modal, Toast, StatusBadge, etc.
    patient/                      # UrgentBanner, RebookSlots, BookingWizard + steps
    physician/                    # PendingQueue, PhysicianSchedule (react-big-calendar)
    admin/                        # AdminNav, FeeOwedList
  pages/
    LoginPage.jsx
    patient/                      # PatientDashboard, PatientAppointments, PatientBookPage
    physician/                    # PhysicianDashboard, PhysicianSchedulePage
    admin/                        # AdminDashboard, AdminSchedulePage, AdminBookPage, AdminBookingsPage
  App.jsx                         # Routes + auth guards
  main.jsx                        # ReactDOM root + providers
```

## Prototype conventions

| Feature | Prototype behavior |
|---|---|
| Authentication | Context-based, no JWT, no session storage |
| Email/SMS | UI copy only ("Sent to email and SMS") |
| Payment | Warning + flag only, no payment form |
| Health card OCR | `setTimeout` simulation, hardcoded number output |
| Drag/resize on calendar | Updates local state only |
| Notifications | In-app only, array in Context |
| Persistence | State resets on page refresh |
