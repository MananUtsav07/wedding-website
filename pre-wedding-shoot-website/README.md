# Pre-Wedding Shoot Website

React + Vite frontend for a pre-wedding discovery and booking platform.

## Run locally

```bash
npm install
npm run dev
```

## GitHub Pages deployment

This repo is configured to deploy automatically using GitHub Actions.

### 1) Push to GitHub

Create a repository and push this project to the `main` branch.

### 2) Enable GitHub Pages

In your GitHub repository:

1. Go to `Settings` -> `Pages`
2. Under `Build and deployment`, set `Source` to `GitHub Actions`

### 3) Deploy

Push to `main` (or run the workflow manually from `Actions` tab).

After workflow success, GitHub will provide a live URL you can share.

## Notes

- Routing uses `HashRouter` so deep links work correctly on GitHub Pages.
- `vite.config.js` uses `base: './'` for portable static hosting.
