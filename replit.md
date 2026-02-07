# The Heist - Party Invitation Website

## Overview
An interactive, heist-themed party invitation website inspired by Ocean's 8. Users can either solve 3 puzzles to "crack the vault" and unlock the invitation, or skip directly to the invitation page. RSVPs are stored in PostgreSQL and synced to Google Sheets.

## Recent Changes
- 2026-02-07: Initial build - Home page, 3 puzzle pages, Invitation/RSVP page
- 2026-02-07: Google Sheets integration with persistent sheet ID stored in DB
- 2026-02-07: Server-side puzzle validation

## Architecture
- **Frontend**: React + Vite + TailwindCSS + Framer Motion
- **Backend**: Express + Drizzle ORM + PostgreSQL
- **Integration**: Google Sheets API via Replit connector
- **Routing**: wouter (client-side)

## Project Structure
- `client/src/pages/home.tsx` - Landing page with hero and CTAs
- `client/src/pages/puzzle.tsx` - Modular puzzle page (handles all 3 puzzles via URL param)
- `client/src/pages/invitation.tsx` - Party details + RSVP form
- `shared/schema.ts` - DB schema (rsvps, appSettings) + puzzle definitions
- `server/routes.ts` - API endpoints (/api/rsvp, /api/rsvps, /api/puzzle/check)
- `server/googleSheets.ts` - Google Sheets sync
- `server/db.ts` - Database connection

## Key Design Decisions
- Dark-mode-first design with gold (hsl 43 85% 55%) accents on dark navy background
- Fonts: Montserrat (sans), Playfair Display (serif), JetBrains Mono (mono)
- Puzzles defined in shared/schema.ts for easy editing
- Google Sheet ID persisted in appSettings table to survive restarts
- RSVP saved to DB first, then async synced to Google Sheets (non-blocking)

## Theme
- Dark background: hsl(220 20% 6%)
- Gold primary: hsl(43 85% 55%)
- Foreground: hsl(45 20% 92%)

## Audio (Future Enhancement)
- Structure supports adding background music (Pink Panther score)
- Can be added to Home/Puzzle pages with play/pause control
