# Quick Start Guide

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## First Time Setup

1. **Add Your First Contract**
   - Click the + button on the home screen
   - Select a category (e.g., Telekommunikation → Mobilfunk)
   - Fill in the contract details
   - Save

2. **Enable Notifications**
   - Go to Settings (bottom navigation)
   - Click "Benachrichtigungen aktivieren"
   - Allow browser notifications

3. **Choose Language**
   - Go to Settings
   - Toggle between Deutsch and English

## Key Features to Try

### Dashboard
- See total monthly costs
- View upcoming cancellation deadlines
- Quick access to add contracts

### Contract List
- Search by name or provider
- Filter by category group
- Tap any contract to see details

### Statistics
- Monthly and yearly totals
- Category breakdown
- Top 5 most expensive contracts

### Export/Import
- **Export**: Settings → Export as CSV or Excel
- **Import**: Settings → Import from CSV/Excel
- **Backup**: Settings → Create Backup (saves as JSON)

## Sample Data

Add these sample contracts to test the app:

1. **Mobilfunk**
   - Name: Smartphone Vertrag
   - Provider: Telekom
   - Cost: €29.99/month
   - Duration: 24 months

2. **Strom**
   - Name: Stromvertrag
   - Provider: Stadtwerke
   - Cost: €85/month
   - Cancellation: 42 days

3. **Streaming**
   - Name: Netflix
   - Provider: Netflix
   - Cost: €12.99/month
   - Cancel anytime

4. **Fitnessstudio**
   - Name: Fitness Abo
   - Provider: McFit
   - Cost: €19.90/month
   - Duration: 12 months

5. **ÖPNV**
   - Name: Deutschlandticket
   - Provider: Nahverkehr
   - Cost: €49/month

## Smart Defaults

When you select a category, the app automatically sets:
- **Cancellation period** (e.g., 90 days for mobile, 42 days for energy)
- **Reminder days** (e.g., 90, 60, 30 days before cancellation)
- **Common providers** in autocomplete

## Testing Export/Import

1. Add a few contracts
2. Export as CSV: Settings → "Als CSV exportieren"
3. Delete all contracts (or use a different browser)
4. Import the CSV: Settings → "CSV importieren"
5. All contracts are restored!

## PWA Installation

### On Mobile (iOS/Android)
1. Open the app in browser
2. iOS: Safari → Share → Add to Home Screen
3. Android: Chrome → Menu → Install App

### On Desktop
1. Chrome/Edge: Look for install icon in address bar
2. Click "Install"
3. App opens in standalone window

## Local Data

All your data is stored locally in your browser using IndexedDB:
- No account needed
- No server connection
- 100% private
- Works offline after first load

## Troubleshooting

### Contracts Not Showing
- Check browser console for errors
- Verify IndexedDB is enabled in browser
- Try clearing browser cache

### Notifications Not Working
- Check browser notification permissions
- Ensure HTTPS (required for service workers)
- Notifications check daily, not instantly

### Import Failed
- Ensure CSV uses semicolon (;) delimiter
- Check that required fields (Name, Kategorie, Anbieter) are present
- Verify dates are in ISO format (YYYY-MM-DD)

## Development Tips

### Hot Reload
Vite provides instant hot reload. Changes appear immediately.

### Database Inspection
Open browser DevTools → Application → IndexedDB → ContractManager

### Test Build
```bash
npm run build
npm run preview
```

### Check Lints
The build shows accessibility warnings. These are informational.

## Next Steps

1. Replace placeholder icons in `/static` with real 192x192 and 512x512 PNG icons
2. Test on mobile devices
3. Deploy to Vercel or GitHub Pages (see DEPLOYMENT.md)
4. Add your personal contracts
5. Set up notification reminders

## File Structure Overview

```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── data/          # Category and provider presets
│   ├── db/            # Database (Dexie.js)
│   ├── i18n/          # Translations (DE/EN)
│   ├── stores/        # Svelte stores
│   └── utils/         # Export/Import/Backup utilities
├── routes/            # Pages (SvelteKit routing)
└── app.css           # Global styles (Tailwind)
```

## Support

- Check FEATURES.md for complete feature list
- Check DEPLOYMENT.md for deployment options
- Review .interface-design/system.md for design tokens
- All documentation is in the project root
