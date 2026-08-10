# ApexRadio AI - UI & Design Guidelines

## 1. Design Philosophy

ApexRadio AI adopts a **minimalist, high-contrast black-and-white telemetry aesthetic** inspired by Formula 1 pit wall timing screens, aerospace HUDs, and mission-critical telemetry interfaces.

### Core Principles
1. **High Contrast & Zero Clutter**: Pure blacks (`#000000` / `#09090b`), sharp grays, and crisp off-whites (`#ffffff`, `#fafafa`) ensure readability under intense race conditions.
2. **Monospace & Telemetry Data Accents**: Timestamps, lap deltas, stress scores, and radio channels leverage tabular/monospace numerical typography for instant scanning.
3. **Subtle Micro-Borders & Grids**: Thin `1px` zinc borders (`border-zinc-800`, `border-zinc-900`) define distinct telemetry modules without distracting gradients or skeuomorphism.
4. **Focused State Indicators**: Status dots (e.g. green pulse for live health, subtle white badges for active channels) provide instant status recognition.

---

## 2. Color Palette (Monochrome Focus)

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `bg-primary` | `#09090b` (Zinc 950) | Main application background |
| `bg-surface` | `#121215` (Zinc 900) | Card and telemetry container background |
| `bg-elevated` | `#18181b` (Zinc 900) | Hover states and elevated panels |
| `border-subtle` | `#27272a` (Zinc 800) | Structural dividing borders |
| `border-focus` | `#52525b` (Zinc 600) | Active inputs & highlighted cards |
| `text-primary` | `#fafafa` (Zinc 50) | Primary headlines, data points, transcripts |
| `text-muted` | `#a1a1aa` (Zinc 400) | Secondary labels, descriptions, metadata |
| `text-faint` | `#71717a` (Zinc 500) | Micro-captions, timestamps, unit labels |
| `accent-white` | `#ffffff` | High-priority CTAs, active indicators |

---

## 3. Typography Hierarchy

- **Primary Sans**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Telemetry Mono**: `JetBrains Mono`, `ui-monospace`, `SFMono-Regular`, `monospace`

```
H1: text-3xl font-bold tracking-tight text-white
H2: text-xl font-semibold tracking-tight text-white
H3: text-base font-medium text-zinc-200
Body: text-sm text-zinc-400 font-normal leading-relaxed
Caption: text-xs text-zinc-500 uppercase tracking-wider font-mono
Data / Delta: text-sm font-mono text-zinc-100 tabular-nums
```

---

## 4. Reusable Component Rules

### 4.1 Buttons
- **Primary**: Pure white background (`bg-white text-black hover:bg-zinc-200 font-medium px-4 py-2 rounded-md transition-colors`)
- **Secondary / Outline**: Bordered with dark background (`border border-zinc-700 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-800 px-4 py-2 rounded-md`)
- **Ghost**: Minimalist hover background (`text-zinc-400 hover:text-white hover:bg-zinc-800/60 px-3 py-2 rounded-md`)

### 4.2 Cards & Telemetry Containers
- Container: `rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-sm`
- Header: Title in `font-medium text-white` paired with optional right-aligned telemetry badge or status indicator.

### 4.3 Badges
- Pill-shaped or subtle rounded tags: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono border border-zinc-700 bg-zinc-800/80 text-zinc-300`

---

## 5. Navigation & Layout Guidelines

- **Top Navigation**: Fixed or sticky top bar (`border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md`) with logo, telemetry status indicator, main route links, and auth buttons.
- **Main Container**: Centered container with max width (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`).
- **Footer**: Low-profile footer (`border-t border-zinc-900 py-6 text-xs text-zinc-500`) with system stats and copyright.
