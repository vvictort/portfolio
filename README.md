# Victor Thai Portfolio

This repository contains the code for my personal portfolio site.

The site is built around an airport/departure-board metaphor because I wanted the portfolio to feel a little more alive than a standard grid of cards. Projects show up as destinations, photography lives in its own travel-log style pages, and the contact flow is framed more like sending a transmission than submitting a generic form.

Under the visuals, the goal is still pretty practical: keep the experience interactive and polished without turning the codebase into a mess to maintain.

## Tech Stack

- `Astro` handles the overall page shell and routing.
- `React` is used for the interactive pieces that benefit from client-side state, like the flight board, galleries, navigation, and contact form.
- `Tailwind CSS v4` is used for styling and keeping the visual system consistent.
- `Framer Motion` drives the motion language across the site.
- `Lenis` gives the whole site smoother scrolling.
- `Three.js` with `@react-three/fiber` and `@react-three/drei` powers the hero starfield/background effects.
- `Resend` is used through an Astro API route for contact form delivery.

## Why It Is Structured This Way

I tried to separate content, layout, and interaction cleanly:

- page composition lives in Astro
- interactive UI lives in React components
- reusable content is stored in JSON instead of hardcoded inside section components
- server-only concerns, like rate limiting and email sending, stay outside the frontend

That keeps the homepage fairly easy to reason about even though the presentation is more custom than a typical portfolio.

## Project Structure

```text
src/
├── components/
│   ├── astro/       # Small Astro-only building blocks
│   ├── layout/      # Cross-page layout pieces like Navigation and SmoothScroll
│   ├── sections/    # Homepage sections such as About, Journey, Contact, Arrivals
│   └── ui/          # Reusable interactive UI like FlightBoard, PhotoGallery, HeroStars
├── data/
│   ├── photography.json   # Food and outdoor gallery content
│   └── projects.json      # Project entries shown in the destinations section
├── layouts/
│   └── MainLayout.astro   # Global shell, metadata, global CSS, Lenis mount point
├── lib/
│   └── contactRateLimit.ts # Server-side limiter for contact submissions
├── pages/
│   ├── api/contact.ts     # Resend-backed contact endpoint
│   ├── food.astro         # Food photography page
│   ├── index.astro        # Main landing page
│   └── outdoor.astro      # Outdoor photography page
└── styles/
    ├── flightboard.css    # Split-flap board styling
    └── global.css         # Global theme, utilities, and site-wide styles
```

## Content Flow

The content model is intentionally simple:

- `src/data/projects.json` drives the projects shown in the `Destinations` section
- `src/data/photography.json` drives the food and outdoor gallery pages
- `public/photography/...` stores the actual image assets in WebP format

That means most edits to projects or galleries can be done without touching component logic. For example, adding a new project is usually just a new object in `projects.json`, and adding a new photo set is usually a new entry in `photography.json`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment Variables

If you want the contact form to actually send mail, create a `.env` file using `.env.example` as a guide:

```bash
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=contact@yourdomain.com
```

Notes:

- `RESEND_FROM_EMAIL` is required and should be a verified sender from your Resend account.
- Use a plain email address when setting `RESEND_FROM_EMAIL` in Vercel to avoid wrapping quotes being sent to Resend.
- If you prefer `Name <email@example.com>` format, enter it without surrounding quotes in the Vercel dashboard.
- Do not rely on `onboarding@resend.dev` for deployment; use your own verified domain/sender.
- portfolio messages are sent to `vvictort20@gmail.com`
- the contact API also applies rate limiting at 2 submissions per 24 hours per user/IP

## Deployment Note

This project uses Astro in `server` output mode with the Vercel serverless adapter because the contact form depends on an API route.

The repository also includes a `vercel.json` so the framework and build commands are explicit in version control.

This is not a purely static deployment. To keep contact delivery working, it should be deployed to Vercel or another environment using the matching Astro adapter.

## A Few Implementation Details I Care About

- The homepage is composed as sections in `src/pages/index.astro`, while each section stays isolated in `src/components/sections`.
- The airport board in `src/components/ui/FlightBoard.tsx` is treated like a self-contained display system rather than mixing its logic into the page.
- The photo galleries in `src/components/ui/PhotoGallery.tsx` group same-day images together so a single card can hold multiple frames.
- The contact flow in `src/pages/api/contact.ts` validates input, rate-limits submissions, and sends through Resend without relying on default browser form behavior.

## Future Improvements

- stronger persistence for rate limiting beyond a single server instance
- more structured content metadata for photography captions and locations
- further performance tuning around the heavier visual effects
