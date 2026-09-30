# College AI — Design System & Visual Architecture

## 1. Product Design Philosophy

College AI is an enterprise institutional intelligence platform. The user interface embodies seriousness, speed, institutional trust, and high usability.

### Core Tenets
1. **Calm & Confident**: No flashing neon lights, no decorative gradients, and no distracting accent colors.
2. **Typography-Driven**: Hierarchy is achieved through deliberate font weight, font size, and line height.
3. **High Accessibility (WCAG 2.1 AA)**: All text meets or exceeds a 4.5:1 contrast ratio. Interactive elements feature visible, accessible focus indicators.
4. **Motion with Purpose**: Transitions are fast (120–220ms) and communicate state changes without exaggerated bouncing. All animations respect `prefers-reduced-motion`.

---

## 2. Typography Scale

Font Stack:
```text
Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

Monospace Stack (code blocks, citations, hashes):
```text
JetBrains Mono, SF Mono, Fira Code, monospace
```

### Scale & Hierarchy
* **Display / Hero**: `clamp(2rem, 4vw, 3.75rem)` (Weight: 700)
* **Heading 1**: `clamp(2rem, 3.5vw + 0.5rem, 3.25rem)` (Weight: 700)
* **Heading 2**: `clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)` (Weight: 600)
* **Heading 3**: `clamp(1.25rem, 2vw + 0.25rem, 1.75rem)` (Weight: 600)
* **Heading 4**: `clamp(1.125rem, 1.5vw + 0.375rem, 1.375rem)` (Weight: 600)
* **Body**: `16px / 1rem` (Weight: 400)
* **Body Small**: `14px / 0.875rem` (Weight: 400/500)
* **Caption / Meta**: `12px / 0.75rem` (Weight: 500)
* **Monospace Citations**: `11px / 0.6875rem` (Weight: 500)

---

## 3. Spacing Scale

Strict 4px/8px incremental scale:
* `4px` (`0.25rem`) — Micro gaps, inline badge padding
* `8px` (`0.5rem`) — Element spacing, button icon gaps
* `12px` (`0.75rem`) — Compact card padding, dropdown item padding
* `16px` (`1rem`) — Standard component padding, list gap
* `24px` (`1.5rem`) — Card padding, modal internal spacing
* `32px` (`2rem`) — Section internal padding
* `48px` (`3rem`) — Page section separation
* `64px` (`4rem`) — Major landing page block separation

---

## 4. Radius Hierarchy

* **Small (`6px`)**: Badges, inline code tags, compact buttons
* **Medium (`8px`)**: Form inputs, standard buttons, dropdown menus
* **Large (`12px`)**: Cards, sidebar containers, message bubble corners
* **Extra Large (`16px`)**: Modal dialogs, drawer panels
* **Full (`9999px`)**: Status chips, avatar circles

---

## 5. Shadow & Elevation Hierarchy

In monochrome design, elevation is communicated predominantly through subtle borders (`#E5E5E5` in light, `#262626` in dark). Shadows are restrained and neutral:
* **`shadow-xs`**: Subtle card resting state
* **`shadow-sm`**: Button hover feedback
* **`shadow-md`**: Active popovers and dropdowns
* **`shadow-lg`**: Modal overlays and drawers

---

## 6. Layout Grid & Responsive System

Fluid multi-column layouts adapting across breakpoints:
* **Mobile (<640px)**: Single column, touch-friendly 44px minimum target sizes, slide-out drawer navigation.
* **Tablet (640px - 1023px)**: Compact sidebar rail (72px), 2-column grids, fixed top navbar.
* **Desktop (1024px - 1439px)**: Full persistent sidebar (280px), multi-column workspaces, centered search bar.
* **Ultrawide (1440px+)**: Constrained maximum content width (`1280px` or `1440px`), generous whitespace.
