# Contractly

🇩🇪 A mobile-first PWA for managing personal contracts

[![Built with SvelteKit](https://img.shields.io/badge/Built%20with-SvelteKit-FF3E00?style=flat&logo=svelte)](https://kit.svelte.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

## ✨ Features

- **50+ Contract Categories** - Comprehensive presets for tele communication, insurance, energy, rent, and more
- **Smart Defaults** - Auto-filled cancellation periods and reminders per category
- **100% Local Data** - All data stays on your device (IndexedDB), never leaves
- **PWA** - Install as app, works offline
- **Export/Import** - XLSX and CSV support
- **Backup** - JSON backup and restore
- **Bilingual** - German and English support
- **Statistics** - Track monthly/yearly costs and upcoming deadlines
- **Notifications** - Browser push notifications for cancellation deadlines
- **Mobile-First** - Optimized for touch with 48px targets

## Tech Stack

- **SvelteKit** with static adapter
- **Tailwind CSS** with custom design tokens
- **Dexie.js** for local IndexedDB storage
- **Lucide Icons**
- **SheetJS & Papa Parse** for import/export
- **Vite PWA Plugin**

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started guide with sample data
- **[FEATURES.md](FEATURES.md)** - Complete feature list and specs
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Vercel, GitHub Pages, or other hosts
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical overview and architecture
- **[SECURITY.md](SECURITY.md)** - Security assessment and vulnerability analysis
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributing to this project

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Open http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📸 Screenshots

### Dashboard
- Total monthly costs overview
- Upcoming cancellation deadlines
- Quick add button

### Contract List
- 50+ categories with visual icons
- Search and filter
- Monthly cost display

### Statistics
- Category breakdowns
- Top 5 most expensive
- Deadline warnings

### Settings
- Export/Import (CSV, Excel)
- Backup/Restore (JSON)
- Language switcher (DE/EN)
- Notification settings

## 🏗️ Built With

- **SvelteKit** - Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom design tokens
- **Dexie.js** - IndexedDB wrapper
- **Lucide Icons** - Icon system
- **SheetJS** - Excel export
- **Vite PWA** - Progressive Web App

## 📦 Project Stats

- **26 source files** (Svelte + TypeScript)
- **3 MB** production build
- **50+ categories** across 12 groups
- **200+ providers** in autocomplete
- **2 languages** (German, English)
- **0 external APIs** (100% local)

## ⚠️ Before Production

1. Replace placeholder icons in `/static/` with real 192x192 and 512x512 PNG files
2. Test PWA installation on mobile devices
3. Verify notifications work (requires HTTPS)
4. Test import/export features

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires IndexedDB and Service Worker support.

## 🔒 Security

This app is designed with privacy in mind:
- **100% local data** - Nothing ever sent to a server
- **No tracking** - No analytics, no telemetry
- **No accounts** - No login required
- **Static deployment** - No server-side code

The `npm audit` reports 10 vulnerabilities, but these are **development-only issues** that don't affect the production build. See [SECURITY.md](SECURITY.md) for detailed analysis.

**TL;DR**: ✅ Safe to deploy and use

## 📄 License

MIT