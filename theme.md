# College AI — Monochrome Theme System Specification

> See full documentation in [docs/theme.md](file:///C:/Users/SDX30/Desktop/clg-chatbot/docs/theme.md) and [docs/design.md](file:///C:/Users/SDX30/Desktop/clg-chatbot/docs/design.md).

## 1. Visual Identity
* Strictly **Black + White + Grayscale** monochrome system.
* No decorative colors: Zero blue, purple, green, orange, pink, cyan, neon colors, or gradients.
* Contrast, typography scale, borders, and elevation define hierarchy.

## 2. Quick Token Reference

### Light Mode (`[data-theme="light"]`)
* Backgrounds: Primary `#FFFFFF`, Secondary `#F7F7F7`, Tertiary `#F2F2F2`
* Surfaces: Elevated `#FFFFFF`, Secondary `#FAFAFA`, Overlay `rgba(0, 0, 0, 0.45)`
* Text: Primary `#111111`, Secondary `#525252`, Muted `#737373`, Disabled `#A3A3A3`
* Borders: Default `#E5E5E5`, Subtle `#EEEEEE`, Strong `#D4D4D4`, Focus `#111111`
* Primary Buttons: `#111111` background with `#FFFFFF` text

### Dark Mode (`[data-theme="dark"]`)
* Backgrounds: Primary `#000000`, Secondary `#0A0A0A`, Tertiary `#111111`
* Surfaces: Elevated `#181818`, Secondary `#141414`, Overlay `rgba(0, 0, 0, 0.70)`
* Text: Primary `#FFFFFF`, Secondary `#A3A3A3`, Muted `#737373`, Disabled `#525252`
* Borders: Default `#262626`, Subtle `#1C1C1C`, Strong `#404040`, Focus `#FFFFFF`
* Primary Buttons: `#FFFFFF` background with `#000000` text
