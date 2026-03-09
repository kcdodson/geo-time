# GeoTime

A mobile-first web app that automatically tracks work hours via geofencing. When you arrive at your work location, a session starts. When you leave, it stops — with a 5-minute debounce to prevent GPS drift false exits. You can also track manually and log pay based on your hourly rate.

## Features

- **Auto-tracking** — polls location every 30s, starts/stops sessions based on geofence entry/exit
- **Manual tracking** — start and stop sessions with one click
- **Geofence setup** — search any address via OpenStreetMap (no API key needed), adjust radius 50m–5km, preview on a live map
- **Pay calculation** — set an hourly rate and see earnings on the dashboard and in reports
- **Session management** — full CRUD, conflict detection, merge multiple sessions
- **Reports** — filter by date range, export to CSV (with earnings), print-friendly layout
- **Dark command-center UI** — amber radar pulse animation when inside geofence

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [TailwindCSS v4](https://tailwindcss.com) (CSS-first `@theme` config)
- [Prisma](https://www.prisma.io) ORM + [Supabase](https://supabase.com) PostgreSQL
- [NextAuth v5](https://authjs.dev) (credentials provider, JWT)
- [react-leaflet](https://react-leaflet.js.org) + Leaflet.js (SSR disabled)
- [Nominatim](https://nominatim.org) geocoding (OpenStreetMap, no API key)
- [react-hook-form](https://react-hook-form.com) + [Zod](https://zod.dev)
- [date-fns](https://date-fns.org)

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd geotime
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Supabase — get these from Project Settings → Database → Connection string
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require

# NextAuth — generate with: openssl rand -base64 32
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Push the database schema

```bash
npx dotenv-cli -e .env.local -- npx prisma db push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, and you're ready.

## Project Structure

```
app/
├── (auth)/login + register      # Auth pages
├── (app)/                       # Protected app shell
│   ├── dashboard/               # Stats, active timer, geofence status
│   ├── geofence/                # Address search + map + radius config
│   ├── sessions/                # Session CRUD table
│   ├── reports/                 # Date range filter, CSV export, print
│   └── settings/                # Name + hourly rate
└── api/                         # REST endpoints

components/
├── ui/          Button, Card, Badge, Modal, Spinner
├── layout/      Sidebar, TopBar, Providers
├── tracking/    TrackingStatus (radar pulse), ActiveTimer, ManualControls
├── geofence/    AddressSearch, GeofenceMap, RadiusSlider
├── sessions/    SessionTable, SessionRow, SessionForm
├── dashboard/   StatCard, GeofenceStatusPanel, RecentSessions
└── reports/     DateRangePicker, ReportTable, ExportButtons

hooks/
├── useGeolocation.ts     Poll GPS every 30s, pause on hidden tab
├── useGeofence.ts        INSIDE/OUTSIDE/UNKNOWN + haversine distance
├── useActiveSession.ts   Session recovery, auto start/stop on geofence events
└── useSessionStats.ts    Today/week/month totals + earnings

lib/
├── auth.ts               NextAuth v5 config
├── db.ts                 Prisma singleton
├── geofence.ts           haversineDistance, isInsideGeofence, createExitDebouncer
├── geocoding.ts          Nominatim searchAddress, reverseGeocode
├── session-manager.ts    startSession, stopSession, closeStale, merge, detectConflicts
├── export.ts             sessionsToCSV, downloadCSV, triggerPrintReport
└── validations.ts        Zod schemas
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Sync schema to database (requires dotenv-cli)
npm run db:studio    # Open Prisma Studio
```
