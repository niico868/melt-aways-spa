# Melt Aways Spa Website

Public website for Melt Aways (meltawaysspa.com), a wellness and body-contouring spa in Trinidad & Tobago.

## How it works

- Built with React + TanStack Start, styled with Tailwind.
- Hosted on Cloudflare Workers. Every push to `main` on GitHub rebuilds and redeploys the site.
- The site has no database or customer logins of its own. Bookings and every form
  (contact, consultation, treatment finder, visiting) are sent to the salon dashboard's
  `website-booking` API. The address is set in `src/lib/booking-api.ts`.
- The booking API only accepts requests from addresses listed in the dashboard's
  `ALLOWED_ORIGINS` secret in Supabase. A new test or live address must be added there,
  or the booking page will say it couldn't load services.
- No API keys are needed on Cloudflare for this site.

## Working on it locally

You need Node.js and npm.

```sh
npm install
npm run dev      # local preview
npm run build    # production build
```
