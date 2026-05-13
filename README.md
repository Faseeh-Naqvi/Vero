# Vero Clinic Booking System

## What I Built
- I made a patient booking flow with 3 distinct roles, Patient, Physician, Admin. It’s Built in React with JSON mock data. Patients book themselves, physicians and admins can also do it for them. There's an approval queue, a 48-hour cancellation fee window, and a rebook flow for when a physician cancels. I really tried putting myself in the place of each role to flesh out each side of the demo. 
---
## Key Design Decisions
- Approval queue:  When a physician or admin logs in, the first thing they see is what needs action. Pending appointments sit above the schedule, sorted by urgency. I didn't want people scanning around figuring out where to start.
- Urgent info banner: Sits at the top of the patient dashboard and changes based on their situation: no appointment, upcoming, or cancelled. Cancelled state goes red and the rebook buttons appear right there. Patients shouldn't have to dig. If you have multiple appointments then you can cycle through them on this so you can keep track with a quick glance.
- Rebook in one tap: When a physician cancels, three timings show up on the patient’s dashboard. Prior details carry over for easy rebooking. Getting cancelled is already a bad experience; it shouldn't also mean filling everything out again.
- Merged admin calendar: One calendar has all physicians and it’s color coded. Can use the filter chips to narrow down specific physicians. I thought about separate views per physician but you'd just end up filtering to one anyway, so the merged view makes more sense.
- Trend graph on the admin dashboard : Live schedule and booking volume together. I didn't want the admin jumping between screens just to see how the week is going.
- Health card upload : Click the icon, it loads like it's reading the card, fills in the number, saves to their profile. Less typing at intake, and the patient can see it's on file before they show up.
- Default appointment block size: On avg 13-24 minutes. The Doctor can adjust the time if the consultation seems like it will take longer. (https://www.cihi.ca/en/topics/access-and-wait-times/reports-and-releases)
---
## What's in the demo

**Patient**
- Dashboard with a three-state urgent banner: no upcoming appointment, has an upcoming appointment, or physician cancelled (with a 3-slot rebook prompt)
- 5-step booking wizard: Physician → Date & Time → Details → Health Card (simulated OCR) → Confirm
- Appointment list with cancel and rebook options
- 48-hour cancellation fee flow with mandatory acceptance checkbox
- Notifications via the bell icon

**Physician**
- Dashboard with pending approvals queue and today's schedule
- Week/Day schedule with drag-to-reschedule and resize-to-adjust-duration
- Patient detail drawer: confirm, cancel, or mark complete

**Admin**
- Dashboard with stat cards, pending approvals (all physicians), and fees-owed list
- Multi-physician schedule with toggleable filter chips
- "All Bookings" search and filter table
- Book-on-behalf-of-patient flow (auto-confirmed)

---

## What I'd Fix With More Time
- Actually talk to stakeholders and figure out how well the demo would hold up and what features are missing/ not required. 
- Calendar conflict handling needs work. Dragging a block onto a booked slot isn't cleanly resolved yet. Some sort of basic mutex lock would work. 
- Add smarter algorithm based rebook suggestions. Right now it is the next three open slots.
- The booking flow needs a mobile version. Staff use the desktop usually, but the patients probably want mobile.
- I need to flesh out edge cases and the backend basically. 


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

Sign out from the sidebar anytime and log back in as a different role, you'll see the same data, but from a completely different angle.

### Try this first

1. **Log in as a Patient** (e.g. "Patient: James").
   - The banner at the top of the dashboard changes based on whether you have an upcoming appointment, it's worth noticing before you do anything else.
   - Click **Book Appointment** to walk through the 5-step wizard: *Physician → Date & Time → Details → Health Card → Confirm*.
   - On the Health Card step, click **Scan health card**. The simulated OCR fills in the number after a short delay.
   - Confirm the booking. It appears in **Appointments** with a "Pending" status.
2. **Log out, then log in as the matching Physician** (Dr. Chen, Webb, or Nair).
   - Your new request is sitting in the **Pending Approvals** queue on the dashboard.
   - Click it, then **Confirm** in the drawer. The appointment is now confirmed on the patient's side too.
   - Open **Schedule** in the left sidebar. Try dragging the appointment to a different time, or grab its bottom edge to stretch the duration.
3. **Log out, then log in as Admin**.
   - The **Dashboard** shows stat cards across all physicians, the global pending queue, and any fees owed.
   - **Schedule** overlays all physicians at once, use the chip filters at the top to toggle individual doctors on or off.
   - **All Bookings** is a searchable table of every appointment in the system.
   - **Book on behalf** lets you create an auto-confirmed appointment for any patient.
4. **(Optional) Test the cancellation fee flow.** Back as a Patient, find an appointment within 48 hours of "now" and cancel it. You'll hit a mandatory fee acceptance checkbox before the cancellation goes through.

> Refreshing the browser wipes everything back to the seed data. Good to know if the demo gets into a weird state.



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
