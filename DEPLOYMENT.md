# Deployment Guide

## Prerequisites

The app builds successfully and creates a static output in the `/build` directory.

## Option 1: Deploy to Vercel (Recommended)

### Quick Deploy

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect SvelteKit
6. Click "Deploy"

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `build`
- Framework Preset: SvelteKit

## Option 2: Deploy to GitHub Pages

### Setup

1. Create a new repository on GitHub
2. Initialize git in your project:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Source: GitHub Actions
   - The included `.github/workflows/deploy.yml` will automatically build and deploy

### Manual Build & Deploy

```bash
# Build
npm run build

# The build folder can be deployed to any static hosting service
```

## Option 3: Other Static Hosts

The `/build` folder contains a complete static site that can be hosted on:

- **Netlify**: Drag & drop the `/build` folder or connect via Git
- **Cloudflare Pages**: Connect via Git
- **Firebase Hosting**: `firebase deploy`
- **Surge**: `surge ./build`

## PWA Icons

Before deploying to production, replace the placeholder icons:

1. Create a 512x512 PNG icon (your logo)
2. Use a tool like [PWA Asset Generator](https://www.npmjs.com/package/@vite-pwa/assets-generator):
   ```bash
   npx @vite-pwa/assets-generator --preset minimal static/logo.svg
   ```
3. This will generate all required icon sizes

## Post-Deployment Checklist

- [ ] Icons replaced with actual logo
- [ ] Test PWA installation on mobile
- [ ] Test offline functionality
- [ ] Verify notifications work
- [ ] Test import/export features
- [ ] Check all 50+ categories display correctly

## Environment Variables

This app requires no environment variables as all data is stored locally in IndexedDB.

## Custom Domain

### Vercel
Add domain in Vercel dashboard under Project Settings > Domains

### GitHub Pages
Add a `CNAME` file to the `static` folder with your domain

## HTTPS

All major hosting platforms provide automatic HTTPS. This is required for:
- Service Workers (PWA)
- Web Notifications
- IndexedDB (in some browsers)

## Browser Support

Requires modern browsers with:
- IndexedDB support
- Service Workers
- Web Notifications API (optional feature)

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
