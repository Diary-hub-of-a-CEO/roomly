# Roomly

Roomly is a full-stack PWA room finder web app with pet-friendly listings, owner match preview, and an AI-style rent estimator.

## Features

- Room listings with noise level, nearby universities, facilities, and owner details
- Pet-friendly room labels and scrolling room carousel
- Built-in rent estimator using location, room type, noise, pets, and furnished status
- Light, dark, and pink theme modes
- Progressive Web App support with manifest and service worker
- Backend API with SQLite database for local development
- Vercel-compatible serverless API endpoints for deployment

## Setup

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:4173`

## Production build

- `npm run build`
- `npm run serve`

## Git repository setup

From the project root:

```bash
git init
git add .
git commit -m "Initial Roomly PWA project"
```

If you want to connect to GitHub:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/roomly.git
git push -u origin main
```

## Deploying to Vercel

1. Install Vercel CLI if needed:

```bash
npm install -g vercel
```

2. Log in:

```bash
vercel login
```

3. Deploy once:

```bash
vercel --prod
```

4. For future deployments:

```bash
vercel --prod
```

Vercel will build the frontend from `package.json` and expose the API at `/api/rooms` and `/api/estimate`.

## Notes

- The app uses `public/logo.svg` as the brand logo. Replace it with the final Roomly logo image if you have a custom version.
- Local development uses the Express backend at `http://localhost:4000` for API routes.
