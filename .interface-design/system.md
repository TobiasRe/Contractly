# Design System - Contract Manager

## Direction

**Personality:** Soft SaaS + Calm Precision
**Foundation:** Lavender-to-blue gradient with glass surfaces
**Depth:** Frosted glass layering (blur + translucent borders)

## Tokens

### Spacing
Base: 8px
Scale: 8, 12, 16, 24, 32, 48

### Colors
```
--foreground: #1f2140
--secondary: #4d547f
--muted: #7d84b0
--faint: #d9def4

--accent: #7282ff
--success: green-600
--warning: #d18635
--error: red-600

--surface-base: rgba(255, 255, 255, 0.34)
--surface-elevated: rgba(255, 255, 255, 0.62)
--background: lavender-to-blue gradient
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
--shadow-subtle: 0 10px 20px -16px rgba(72, 86, 196, 0.42), 0 2px 5px rgba(43, 56, 155, 0.12)
--shadow-card: 0 18px 28px -22px rgba(72, 86, 196, 0.52), 0 4px 9px rgba(43, 56, 155, 0.12)
```

## Patterns

### Contract Card
- Padding: 20px
- Radius: 12px
- Background: translucent white (glass)
- Border: 1px translucent white edge
- Usage: Display contract information with cost emphasis

### Button Primary
- Height: 48px (mobile touch-friendly)
- Padding: 12px 24px
- Radius: 12px
- Font: 16px, 500 weight
- Background: lavender-blue gradient
- Usage: Primary actions (save, add contract)

### Input Field
- Height: 48px
- Padding: 12px 16px
- Radius: 12px
- Border: 1px translucent white edge
- Font: 16px (prevents zoom on iOS)
- Usage: All form inputs

### Bottom Navigation
- Height: 56px
- Background: frosted glass with blur
- Active indicator: glass chip with accent text
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
| Lavender-blue glass palette | Matches soft SaaS aesthetic and iOS Liquid Glass language | 2026-02-11 |
| 8px spacing base | Divisible for mobile (48px touch targets = 6 units) | 2026-01-30 |
| Frosted glass depth | Quiet layering with translucency and blur instead of opaque blocks | 2026-02-11 |
| 48px touch targets | Thumb-friendly for mobile-first German users | 2026-01-30 |
| Inter font | Clear, trustworthy, excellent German character support | 2026-01-30 |
