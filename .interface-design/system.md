# Design System - Contract Manager

## Direction

**Personality:** Warmth & Trust
**Foundation:** Warm neutrals with blue accents
**Depth:** Subtle shadows (soft lift)

## Tokens

### Spacing
Base: 8px
Scale: 8, 12, 16, 24, 32, 48

### Colors
```
--foreground: slate-800
--secondary: slate-600
--muted: slate-400
--faint: slate-200

--accent: blue-600
--success: green-600
--warning: amber-600
--error: red-600

--surface-base: warm-white-50
--surface-elevated: white
--background: slate-50
```

### Radius
Scale: 8px, 12px, 16px (friendly, approachable)

### Typography
Font: Inter, system-ui
Scale: 14 (base), 16, 18, 24, 32
Weights: 400, 500, 600
Numbers: tabular-nums (for costs)

### Shadows
```
--shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)
```

## Patterns

### Contract Card
- Padding: 20px
- Radius: 12px
- Background: white with subtle shadow
- Border: none (shadow provides depth)
- Usage: Display contract information with cost emphasis

### Button Primary
- Height: 48px (mobile touch-friendly)
- Padding: 12px 24px
- Radius: 12px
- Font: 16px, 500 weight
- Background: blue-600
- Usage: Primary actions (save, add contract)

### Input Field
- Height: 48px
- Padding: 12px 16px
- Radius: 8px
- Border: 1px solid slate-300
- Font: 16px (prevents zoom on iOS)
- Usage: All form inputs

### Bottom Navigation
- Height: 56px
- Background: white with shadow
- Active indicator: blue-600 with icon + label
- Touch target: 48px minimum

### Category Badge
- Padding: 6px 12px
- Radius: 8px
- Font: 13px, 500 weight
- Background: category color with 10% opacity
- Text: category color at full opacity

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Warm neutrals + blue | Trust (banking blue) + approachable (warm grays) fit German financial context | 2026-01-30 |
| 8px spacing base | Divisible for mobile (48px touch targets = 6 units) | 2026-01-30 |
| Subtle shadows | Soft lift without heaviness, approachable feel | 2026-01-30 |
| 48px touch targets | Thumb-friendly for mobile-first German users | 2026-01-30 |
| Inter font | Clear, trustworthy, excellent German character support | 2026-01-30 |
