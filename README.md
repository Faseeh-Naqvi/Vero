# Vero Clinic Booking System

A prototype clinic booking system with three distinct user roles — **Patient**, **Physician**, and **Admin** — built per the Vero PRD.

> Prototype only: no real authentication, no payment processing, no external integrations. All data is mocked in memory and **resets on every page refresh**. Email/SMS notifications are UI-only.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS 3 |
| State | React Context + `useReducer` |
| Routing | React Router v6 |
| Icons | Lucide React |
| Calendar | `react-big-calendar` (with drag & drop addon) |
| Dates | `date-fns` |

---

## Running it from scratch

These steps assume a clean machine with nothing installed.

### 1. Install Node.js

You need **Node.js 18 or newer** (which includes `npm`).

- Download the LTS installer from [https://nodejs.org](https://nodejs.org) and run it.
- Verify the install by opening a new terminal (PowerShell on Windows, Terminal on macOS/Linux) and running:

```bash
node --version
npm --version
```

Both commands should print a version number. If they don't, restart your terminal.

### 2. Get the project files

If you have the source as a folder, just `cd` into it. If you have a git repository, clone it:

```bash
git clone <repo-url> Vero
cd Vero
```

### 3. Install dependencies

From the project root (the folder that contains `package.json`):

```bash
npm install
```

This downloads everything listed in `package.json` into a local `node_modules/` folder. It usually takes 30–90 seconds the first time.

### 4. Start the dev server

```bash
npm run dev
```

You should see output similar to:

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 5. Open the app

Open [http://localhost:5173](http://localhost:5173) in your browser. You should land on the **Login** page.

To stop the server, return to the terminal and press `Ctrl+C`.

### Other commands

```bash
npm run build      # production build into ./dist
npm run preview    # serve the production build locally to verify it
```

---

## Getting started with the demo

The fastest way in: on the login page, click any **Quick Login** chip. It auto-fills credentials and signs you in.

Or sign in manually with one of these accounts:

| Role | Email | Password |
|---|---|---|
| Patient (James Okafor) | `james@patient.com` | `patient1` |
| Patient (Elena Vasquez) | `elena@patient.com` | `patient2` |
| Patient (Tom Nguyen) | `tom@patient.com` | `patient3` |
| Physician (Dr. Sarah Chen) | `chen@clinic.com` | `doc1` |
| Physician (Dr. Marcus Webb) | `webb@clinic.com` | `doc2` |
| Physician (Dr. Priya Nair) | `nair@clinic.com` | `doc3` |
| Admin | `admin@clinic.com` | `admin` |

You can sign out from the sidebar at any time and log back in as a different role to see the same data from a different perspective.

### Try this first — a 3-minute happy-path tour

1. **Log in as a Patient** (e.g. "Patient: James").
   - On the dashboard, look at the urgent banner at the top — it changes based on whether you have an upcoming appointment.
   - Click **Book Appointment** to launch the 5-step wizard: *Physician → Date & Time → Details → Health Card → Confirm*.
   - On the Health Card step, click **Scan health card** — the simulated OCR pre-fills the number after a short delay.
   - Confirm the booking. It now appears in **Appointments** with a "Pending" status.

2. **Log out, then log in as the matching Physician** (Dr. Chen, Webb, or Nair depending on who you booked with).
   - On the dashboard, you'll see the new request in the **Pending Approvals** queue.
   - Click it, then **Confirm** in the drawer. The patient's appointment is now confirmed.
   - Open the **Schedule** page (left sidebar). Try dragging the appointment to a different time, or grab its bottom edge to resize its duration.

3. **Log out, then log in as Admin**.
   - The **Dashboard** shows stat cards across all physicians, plus the global pending queue and any fees owed.
   - **Schedule** shows all physicians overlaid — use the chip filters at the top to toggle individual doctors on/off.
   - **All Bookings** is a searchable table of every appointment in the system.
   - **Book on behalf** lets you create an auto-confirmed appointment for any patient.

4. **(Optional) Test the cancellation fee flow.** Back as a Patient, find an appointment within 48 hours of "now" and click **Cancel**. You'll see the mandatory fee acceptance checkbox before the cancellation goes through.

> Remember: refreshing the browser resets the entire app to its seed data. Use this if the demo gets into a weird state.

---

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

---

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

---

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

---

## Troubleshooting

- **`npm install` fails on Windows with permission errors.** Close any open editors, then run the terminal as Administrator and try again. If you're behind a corporate proxy, set `npm config set proxy` / `https-proxy` first.
- **Port 5173 is already in use.** Either stop whatever is using it, or start Vite on a different port: `npm run dev -- --port 5174`.
- **Page is blank after edits.** Open the browser devtools console — Vite hot-reload prints errors there. A hard refresh (`Ctrl+Shift+R`) usually clears any stale state.
- **Demo data looks wrong.** Refresh the page — all state is in memory and rebuilds from the mock data files on load.
