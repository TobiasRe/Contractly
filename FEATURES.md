# Contract Manager Features

## Core Features

### Contract Management
- ✅ Add, edit, delete contracts
- ✅ 50+ German category presets organized in 12 groups
- ✅ Smart defaults per category (cancellation periods, reminders)
- ✅ Provider autocomplete for common German providers
- ✅ Automatic cancellation date calculation
- ✅ Contract number tracking
- ✅ Payment method selection
- ✅ Notes field

### Categories (50+)

#### 📱 Telekommunikation (4)
- Mobilfunk, Festnetz, Internet, Kombi-Tarif

#### 🛡️ Versicherungen (10)
- Krankenversicherung, Haftpflicht, Hausrat, Kfz, Rechtsschutz, Berufsunfähigkeit, Lebensversicherung, Zahnzusatz, Unfallversicherung, Tierversicherung

#### ⚡ Energie & Versorgung (4)
- Strom, Gas, Fernwärme, Wasser

#### 🏠 Wohnen (4)
- Miete, Nebenkosten, Hausmeister, Parkplatz

#### 🎬 Medien & Abos (6)
- Streaming (Video, Musik, Gaming), Zeitschrift, Zeitung, Hörbuch

#### 💻 Software & Cloud (3)
- Software-Abo, Cloud-Speicher, Domain-Hosting

#### 💪 Fitness & Gesundheit (4)
- Fitnessstudio, Yoga Studio, Schwimmbad, Physiotherapie

#### 🚊 Mobilität (7)
- BahnCard, ÖPNV-Abo, Carsharing, Kfz-Leasing, Fahrrad-Leasing, Parkhaus-Abo, Tankstellen-Karte

#### 💳 Finanzprodukte (5)
- Girokonto, Kreditkarte, Depot, Bausparvertrag, Kredit

#### 📺 Öffentliche Beiträge (3)
- Rundfunkbeitrag, Müllabfuhr, Schornsteinfeger

#### 🤝 Mitgliedschaften (4)
- Verein, Gewerkschaft, Automobilclub, Berufsverband

#### ➕ Sonstiges (5)
- Telematik, Security-Dienst, Reinigung, Lieferservice-Abo, Custom

### Dashboard
- ✅ Overview of total monthly costs
- ✅ Contract count
- ✅ Upcoming cancellation deadlines (30/60/90 days)
- ✅ Critical deadline warnings
- ✅ Quick add button (floating action button)

### Contract List
- ✅ Search by name or provider
- ✅ Filter by category group
- ✅ Card-based mobile UI
- ✅ Visual category icons and colors
- ✅ Monthly cost display
- ✅ Cancellation date warnings

### Statistics
- ✅ Total monthly/yearly costs
- ✅ Breakdown by category group
- ✅ Top 5 most expensive contracts
- ✅ Upcoming deadlines grouped by urgency
- ✅ Visual progress bars for category spending

### Import/Export
- ✅ Export to CSV (German format with semicolon delimiter)
- ✅ Export to Excel (XLSX)
- ✅ Import from CSV
- ✅ Import from Excel
- ✅ Column mapping for imports

### Backup & Restore
- ✅ Full database backup as JSON
- ✅ Restore from backup
- ✅ Version tracking in backup files
- ✅ Date/time stamped backups

### Notifications
- ✅ Browser push notifications
- ✅ Permission request in settings
- ✅ Daily deadline checks
- ✅ Configurable reminder days per contract
- ✅ Notification history tracking

### Internationalization
- ✅ German (default)
- ✅ English
- ✅ Language switcher in settings
- ✅ Persisted language preference
- ✅ German-first terminology (Kündigungsfrist, Vertragslaufzeit, etc.)

### PWA Features
- ✅ Installable as app
- ✅ Offline support
- ✅ Service worker caching
- ✅ App manifest
- ✅ Home screen icon
- ✅ Standalone display mode

### Design
- ✅ Mobile-first design
- ✅ Bottom navigation
- ✅ 48px touch targets
- ✅ Generous spacing (8px base)
- ✅ Subtle shadows (Warmth & Trust design direction)
- ✅ Custom design tokens
- ✅ Consistent category colors and icons
- ✅ Dark mode ready (via Tailwind)

### Data Privacy
- ✅ 100% local data storage (IndexedDB)
- ✅ No server communication
- ✅ No tracking or analytics
- ✅ Data never leaves device
- ✅ User-controlled backups

## Technical Features

### Performance
- ✅ Static site generation
- ✅ Minimal bundle size (Svelte ~5kb)
- ✅ Fast IndexedDB queries
- ✅ Lazy loading where applicable
- ✅ Optimized icons (Lucide)

### Developer Experience
- ✅ TypeScript throughout
- ✅ Interface-design methodology
- ✅ Clear project structure
- ✅ Comprehensive documentation
- ✅ Build warnings for accessibility

### Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ IndexedDB support required
- ✅ Service Worker support
- ✅ Responsive design (mobile/tablet/desktop)

## Future Enhancements (Not Implemented)

- [ ] Contract renewal automation
- [ ] Email reminders
- [ ] Contract comparison tools
- [ ] Document attachment storage
- [ ] Recurring payment tracking
- [ ] Multi-currency support
- [ ] Cloud sync (optional)
- [ ] Family/household sharing
- [ ] Contract templates
- [ ] Cost optimization suggestions
- [ ] Integration with banking apps
- [ ] PDF report generation
- [ ] Widget for quick overview

## Known Limitations

- Icons are placeholders (need real 192x192 and 512x512 PNGs)
- Charts are basic (no chart.js implementation yet)
- Edit contract not fully implemented (only detail view)
- No contract document attachments yet
- Notifications are daily checks only (no precise timing)
- No contract renewal automation

## Browser Requirements

- IndexedDB support
- Service Worker support (for PWA)
- Web Notifications API (optional, for reminders)
- Modern JavaScript (ES2020+)
- LocalStorage for preferences
