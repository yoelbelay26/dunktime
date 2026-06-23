---
name: Full Court Press
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a98a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb693'
  primary: '#ffb693'
  on-primary: '#561f00'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#a04100'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b6b5b4'
  tertiary: '#c8c6c4'
  on-tertiary: '#30302f'
  tertiary-container: '#9a9997'
  on-tertiary-container: '#313130'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e4e2e0'
  tertiary-fixed-dim: '#c8c6c4'
  on-tertiary-fixed: '#1b1c1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  glass-bg: rgba(30, 30, 30, 0.8)
  glow-orange: rgba(255, 107, 0, 0.15)
  outline-muted: '#5a4136'
  on-surface-muted: '#e2bfb0'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  gutter: 16px
  md: 20px
  lg: 32px
  xl: 48px
  margin-mobile: 16px
  margin-tablet: 32px
---

## Brand & Style
Full Court Press is a high-energy, athletic-focused platform designed for basketball players and enthusiasts. The brand personality is **aggressive, urban, and modern**, evoking the intensity of a late-night streetball game under stadium lights.

The design style is a hybrid of **Glassmorphism** and **High-Contrast Bold**. It utilizes deep, atmospheric backgrounds with vibrant, glowing orange accents that mimic the texture of a basketball and the heat of competition. The interface feels "technical" yet "raw," combining the precision of a professional sports app with the street-level grit of urban sports culture. The target audience expects a fast-paced, high-performance experience that feels premium yet accessible.

## Colors
The palette is built on a foundation of **deep obsidian and charcoal tones**, providing a high-contrast backdrop for the signature **"Electric Orange" (#ff6b00)**. 

- **Primary:** The electric orange is used for calls-to-action, active indicators, and focal points. It carries a glow effect to simulate light.
- **Surface Strategy:** We use a hierarchy of dark grays (Surface, Surface Container Low/High) to create structure without harsh lines. 
- **Accents:** A muted terracotta/copper tone (`#e2bfb0`) is used for secondary text and labels to maintain the warm, energetic theme without competing with the primary orange.
- **Glassmorphism:** Surfaces are often semi-transparent with a backdrop blur, allowing the atmospheric background gradients to peek through.

## Typography
Typography is a critical brand driver, using a dual-font system to balance impact with utility.

- **Montserrat:** Used for all display and headline roles. It should be weighted heavily (700-900) and often set in uppercase with tight tracking for a bold, "stadium billboard" effect.
- **Inter:** Used for body text, inputs, and functional labels. This ensures maximum legibility in complex forms and data-heavy sections. 
- **Rhythm:** Line heights are kept tight for headings to maintain energy, while body text is given ample breathing room (1.5x) for comfort.
- **Localization:** As the UI supports RTL (Hebrew), ensure font-weight consistency across character sets.

## Layout & Spacing
The layout follows a **fluid-to-fixed grid model**. On mobile devices, a single-column layout with 16px margins is standard. As the viewport expands to desktop, the content is contained within a maximum width (e.g., 448px for auth cards) to maintain focus.

Spacing is based on a **4px baseline grid**. 
- **Components:** Internal padding for inputs and buttons uses `md` (20px) or `lg` (32px) to feel substantial and touch-friendly.
- **Vertical Rhythm:** A gap of `xs` (8px) is used between labels and inputs, while `md` (20px) separates distinct form fields.
- **Visual Breathing Room:** Large `xl` (48px) margins separate major sections (e.g., Logo vs. Card).

## Elevation & Depth
Depth is created through a combination of **Glassmorphism** and **Outer Glows**, rather than traditional drop shadows.

- **Surface Layering:** The base background is a dark gradient. Content sits on "Glass Panels" — semi-transparent layers (`rgba(30, 30, 30, 0.8)`) with a `12px` backdrop blur.
- **The "Orange Glow":** Active or primary containers utilize a signature `0 0 20px rgba(255, 107, 0, 0.15)` box shadow. This creates a "neon" effect that feels more modern and energetic than a black shadow.
- **Interactivity:** Elements should subtly lift or brighten on hover. Inputs use a 1px border glow (#ff6b00) when focused to command attention.

## Shapes
The shape language is **geometric and controlled**. 

- **Primary Cards:** Use `rounded-xl` (0.75rem to 1rem) to soften the large containers.
- **Inputs & Buttons:** Use `rounded-lg` (0.5rem) to maintain a modern, "tech" appearance that isn't overly bubbly.
- **Tabs/Pills:** Inner elements within a container (like segmented controls) use slightly smaller radii to maintain visual nesting logic.
- **Borders:** 1px solid borders are used consistently for structure, with varying opacities to indicate hierarchy.

## Components
- **Buttons:** 
    - *Primary:* Full width, background `#ff6b00`, uppercase text, heavy tracking. Should have a subtle brightness increase on hover.
    - *Secondary/Social:* Transparent background with 1px `#5a4136` border. Use Google/Social brand colors for icons only.
- **Input Fields:** 
    - Background: `surface-container-highest` (`#353534`).
    - Iconography: Material Symbols (Outlined) placed on the leading edge (right for RTL). Icons change color to Primary Orange when the field is focused.
- **Segmented Tabs:** A dark container (`surface-container-low`) with a sliding "indicator" pill behind the active text. Use `cubic-bezier(0.4, 0, 0.2, 1)` for the transition.
- **Form Groups:** Stacked vertically with a `gap-5` (20px). Labels should be small, bold, and slightly muted in color (`on-surface-variant`).
- **Icons:** Use **Material Symbols Outlined** with a weight of 400. Icons should be treated as functional elements, not decorative.