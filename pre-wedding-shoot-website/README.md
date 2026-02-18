# Pre-Wedding Shoot Website

React + Vite frontend for a pre-wedding discovery and booking platform.

## Run locally

```bash
npm install
npm run dev
```

## Vercel deployment

This app is ready for Vercel deployment.

### Recommended project settings in Vercel

- Framework Preset: `Vite`
- Root Directory: `pre-wedding-shoot-website` (if your repo contains this folder at top level)
- Build Command: `npm run build`
- Output Directory: `dist`

### Notes

- `vercel.json` includes SPA rewrite rules so React Router routes work on refresh.
