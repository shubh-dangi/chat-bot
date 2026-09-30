# College AI — Monochrome Theme System Specification

## 1. Core Visual Identity

College AI is built upon a strict, premium **Black + White + Grayscale monochrome visual system**.

### Principles
* **Pure Grayscale Contrast**: Hierarchy is established through contrast, typography scale, weight, borders, elevation, and motion—never through loud or decorative colors.
* **Zero Gradients**: No `linear-gradient`, `radial-gradient`, or decorative gradients across text, buttons, borders, or backgrounds.
* **Predictable Hierarchy**:
  * **Level 1**: Strongest contrast (Pure Black `#000000` / `#111111` vs. Pure White `#FFFFFF`).
  * **Level 2**: Dark/light grayscale surfaces (`#F7F7F7` / `#0A0A0A`).
  * **Level 3**: Muted secondary text (`#737373` / `#A3A3A3`).
  * **Level 4**: Structural borders and subtle dividers (`#E5E5E5` / `#262626`).

---

## 2. Design Tokens

### Light Mode (`[data-theme="light"]`)

```css
/* Backgrounds */
--background: #FFFFFF;
--background-secondary: #F7F7F7;
--background-tertiary: #F2F2F2;

/* Surfaces */
--surface: #FFFFFF;
--surface-secondary: #FAFAFA;
--surface-elevated: #FFFFFF;
--surface-overlay: rgba(0, 0, 0, 0.45);

/* Typography */
--text-primary: #111111;
--text-secondary: #525252;
--text-muted: #737373;
--text-disabled: #A3A3A3;
--text-inverse: #FFFFFF;

/* Borders */
--border: #E5E5E5;
--border-subtle: #EEEEEE;
--border-strong: #D4D4D4;
--border-focus: #111111;

/* Interactive */
--interactive-primary: #111111;
--interactive-primary-hover: #000000;
--interactive-secondary: #F5F5F5;
--interactive-secondary-hover: #EBEBEB;
--interactive-disabled: #D4D4D4;

/* Buttons */
--button-primary-bg: #111111;
--button-primary-text: #FFFFFF;
--button-secondary-bg: #FFFFFF;
--button-secondary-text: #111111;
--button-secondary-border: #D4D4D4;

/* Inputs */
--input-bg: #FFFFFF;
--input-border: #D4D4D4;
--input-border-focus: #111111;
--input-placeholder: #737373;
```

---

### Dark Mode (`[data-theme="dark"]`)

```css
/* Backgrounds */
--background: #000000;
--background-secondary: #0A0A0A;
--background-tertiary: #111111;

/* Surfaces */
--surface: #0D0D0D;
--surface-secondary: #141414;
--surface-elevated: #181818;
--surface-overlay: rgba(0, 0, 0, 0.70);

/* Typography */
--text-primary: #FFFFFF;
--text-secondary: #A3A3A3;
--text-muted: #737373;
--text-disabled: #525252;
--text-inverse: #000000;

/* Borders */
--border: #262626;
--border-subtle: #1C1C1C;
--border-strong: #404040;
--border-focus: #FFFFFF;

/* Interactive */
--interactive-primary: #FFFFFF;
--interactive-primary-hover: #F2F2F2;
--interactive-secondary: #171717;
--interactive-secondary-hover: #222222;
--interactive-disabled: #333333;

/* Buttons */
--button-primary-bg: #FFFFFF;
--button-primary-text: #000000;
--button-secondary-bg: #111111;
--button-secondary-text: #FFFFFF;
--button-secondary-border: #333333;

/* Inputs */
--input-bg: #111111;
--input-border: #333333;
--input-border-focus: #FFFFFF;
--input-placeholder: #737373;
```

---

## 3. Component Monochrome Patterns

### Buttons
* **Primary Button**: Solid high-contrast block (Light: `#111111` bg, `#FFFFFF` text; Dark: `#FFFFFF` bg, `#000000` text).
* **Secondary Button**: Solid elevated surface with subtle border (Light: `#FFFFFF` bg, `#111111` text, `#D4D4D4` border; Dark: `#111111` bg, `#FFFFFF` text, `#333333` border).
* **Ghost Button**: Transparent surface with subtle hover background (`#F5F5F5` in Light, `#171717` in Dark).
* **Outline Button**: Transparent surface with `#E5E5E5` / `#262626` border.

### Chat Interface
* **User Messages**: Light: `#F2F2F2` surface, `#111111` text, subtle `#E5E5E5` border; Dark: `#111111` surface, `#FFFFFF` text, subtle `#262626` border.
* **Assistant Messages**: Elevated surface `#FFFFFF` / `#181818` with `#E5E5E5` / `#262626` border.
* **Icons**: Inherit semantic `currentColor` (`text-text-primary` or `text-text-secondary`).

### Badges
* Badges convey semantic states through border intensity, background shade, and text weight rather than rainbow colors:
  * **Default / Brand**: Monochrome background, high-contrast text.
  * **Secondary / Active / Enrolled**: `#F7F7F7` / `#141414` background with structural border.

### Skeletons & Loading
* Skeletons utilize a pure solid opacity pulse between `1.0` and `0.48` on `--color-bg-skeleton` (`#F2F2F2` in Light, `#171717` in Dark). No shimmer gradients.
