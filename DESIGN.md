---
name: Gravity Zero
colors:
  surface: "#131313"
  surface-dim: "#131313"
  surface-bright: "#393939"
  surface-container-lowest: "#0e0e0e"
  surface-container-low: "#1c1b1b"
  surface-container: "#20201f"
  surface-container-high: "#2a2a2a"
  surface-container-highest: "#353535"
  on-surface: "#e5e2e1"
  on-surface-variant: "#bac9cd"
  inverse-surface: "#e5e2e1"
  inverse-on-surface: "#313030"
  outline: "#859397"
  outline-variant: "#3b494c"
  surface-tint: "#00daf8"
  primary: "#baf2ff"
  on-primary: "#00363f"
  primary-container: "#00e0ff"
  on-primary-container: "#005f6d"
  inverse-primary: "#006877"
  secondary: "#ffdb9d"
  on-secondary: "#412d00"
  secondary-container: "#feb700"
  on-secondary-container: "#6b4b00"
  tertiary: "#e8e8e8"
  on-tertiary: "#303030"
  tertiary-container: "#cccccc"
  on-tertiary-container: "#565656"
  error: "#ffb4ab"
  on-error: "#690005"
  error-container: "#93000a"
  on-error-container: "#ffdad6"
  primary-fixed: "#a5eeff"
  primary-fixed-dim: "#00daf8"
  on-primary-fixed: "#001f25"
  on-primary-fixed-variant: "#004e5a"
  secondary-fixed: "#ffdea8"
  secondary-fixed-dim: "#ffba20"
  on-secondary-fixed: "#271900"
  on-secondary-fixed-variant: "#5e4200"
  tertiary-fixed: "#e2e2e2"
  tertiary-fixed-dim: "#c6c6c6"
  on-tertiary-fixed: "#1b1b1b"
  on-tertiary-fixed-variant: "#474747"
  background: "#131313"
  on-background: "#e5e2e1"
  surface-variant: "#353535"
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: "600"
    lineHeight: "1.2"
  headline-sm:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.3"
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.6"
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: "400"
    lineHeight: "1.5"
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: "1"
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style

This design system is built for a code learning platform that treats programming as an exploration of the unknown. The brand personality is **Futuristic, High-Precision, and Immersive**, designed to appeal to developers who value focus and technical depth.

The visual style is a blend of **Minimalism and subtle Glassmorphism**, set against a deep "void" backdrop. It utilizes high-contrast accents to guide the eye through complex logic, mimicking a heads-up display (HUD) or a starship terminal. Every element is designed to feel like it is floating in a zero-gravity environment, supported by a structural underlying grid that represents the order of code.

## Colors

The palette is centered on a **pure black (#000000) base**, providing an infinite depth that reduces eye strain during long coding sessions.

- **Electric Blue (Primary):** Used for primary actions, success states, and progress indicators. It carries a subtle outer glow to simulate luminescence.
- **Amber (Secondary):** Reserved for warnings, critical highlights, and "hot" code paths. It provides a sharp, warm contrast to the cool primary blue.
- **Surface & Borders:** Semi-transparent grays (based on #FFFFFF with low alpha) are used to create structural layers without breaking the "void" aesthetic.
- **Text:** High-contrast white for readability, with secondary text in a dimmed, desaturated blue-gray.

## Typography

The typography system prioritizes technical precision. **Geist** is used for the interface and content, providing a clean, humanist-leaning sans-serif that remains highly legible in dark modes.

**JetBrains Mono** is utilized for code blocks, labels, and metadata to reinforce the developer-centric nature of the platform. Headline levels use tight tracking and bold weights to feel impactful and structural. Labels are set in uppercase with increased letter spacing to mimic instrument panel telemetry.

## Layout & Spacing

The layout is governed by a **12-column fluid grid** on desktop and a **4-column grid** on mobile. All spacing is derived from a strict **8px base unit** to ensure mathematical consistency.

To reflect the "Gravity" theme, the layout utilizes generous margins and "breathing room" to let elements float. A subtle background grid (1px lines at 5% opacity) should be visible across the entire canvas, acting as a technical texture. Layout transitions should feel weightless, using ease-out cubic timing functions to simulate momentum.

## Elevation & Depth

Depth is conveyed through **backlight and transparency** rather than traditional drop shadows.

1.  **Backdrop Blur:** Floating panels use a `20px` blur with a 10% opaque surface color.
2.  **Luminescent Glows:** Primary buttons and active indicators emit a soft `0px 0px 12px` glow of their respective accent color.
3.  **Tiered Surfaces:** Lower-level containers are defined by 1px solid borders (`#FFFFFF` at 10% opacity) instead of fills.
4.  **Parallax:** As the user scrolls, background "star" particles or grid lines move at a slower speed to create a sense of three-dimensional space.

## Shapes

The design system uses a **Soft (0.25rem)** roundedness for standard components to maintain a modern, technical feel without appearing too organic or "friendly."

Corners are sharp enough to feel like precision-engineered hardware but soft enough to be approachable. Coding editors and terminal windows use a `0px` radius for a professional, utilitarian look, while interactive cards and buttons use the `rounded-sm` and `rounded-md` variables.

## Components

- **Buttons:** Primary buttons have a solid Electric Blue fill with black text and a matching glow. Secondary buttons are "Ghost" style with an Electric Blue border and text.
- **Code Editor:** Pure black background with a 1px border. Line numbers are dimmed. Active line is highlighted with a 5% Blue tint and a subtle left-edge glow.
- **Cards:** Semi-transparent background with a 1px white border at 10% opacity. Upon hover, the border opacity increases to 40%, and a subtle blue glow appears at the bottom edge.
- **Chips/Status:** Small, JetBrains Mono labels. "Active" uses Primary Blue; "Error" uses Secondary Amber. They should look like terminal tags.
- **Input Fields:** Bottom-border only or very thin 1px outlines. Focus state triggers a primary color "glow" that bleeds slightly into the field area.
- **Progress Bars:** Thin 4px tracks. The filled portion should have a linear gradient from Electric Blue to a slightly brighter cyan to indicate energy flow.
