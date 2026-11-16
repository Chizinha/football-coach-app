# Football Coach — Design System

**Version:** 0.1  
**Status:** Proposed design baseline for the front-end prototype  
**Accessibility target:** WCAG 2.2 Level AA  
**Visual direction:** Modern and polished, with a classic football-green identity

## 1. Purpose

This design system is the visual and interaction source of truth for the Football Coach application. It should make the app feel like a clear, professional coaching tool: calm, useful and easy to understand rather than decorative or overly sporty.

The system covers foundations, reusable interface patterns, exercise diagrams, responsive behaviour and accessibility requirements. New screens should reuse these rules and components rather than inventing new visual treatments.

The design system is a target and implementation specification, not a certification. WCAG conformance must be checked against the implemented application with automated and manual testing.

## 2. Product design principles

1. **Clarity before decoration.** The interface should help coaches find, understand and plan exercises quickly.
2. **Consistent patterns.** Similar actions and information should look and behave the same way across the app.
3. **Accessible by default.** Keyboard access, readable contrast, clear labels and non-drag alternatives are core requirements.
4. **Mobile-first, not mobile-only.** Planning should work comfortably on desktop; viewing and quick actions should work on a phone at the pitch.
5. **Visuals explain the exercise.** Diagrams should make movement and organisation easier to understand, and never be the only source of instructions.
6. **Keep the interface quiet.** Use green purposefully for actions and emphasis. Use neutral surfaces for most of the interface.

## 3. Visual direction

- Modern, polished and understated.
- White and very light neutral surfaces.
- Forest and natural greens used as the brand accent.
- Manrope typography.
- Medium corner radii, light borders and restrained shadows.
- Clear hierarchy and balanced information density.
- Avoid gratuitous gradients, glass effects, heavy shadows and decorative sports imagery in ordinary application screens.

The supplied Club Library screenshot is a useful starting reference: a simple left navigation, clear page heading, search and filters, and a grid of exercise cards. The refined version should retain that straightforward structure while improving typography, spacing, contrast and component consistency.

## 4. Colour foundations

### 4.1 Core palette

| Token | Hex | Intended use | Restriction |
|---|---|---|---|
| `--fc-forest` | `#174D32` | Strong brand colour, headings where appropriate, focus rings, active emphasis | Use as a high-contrast foreground or accent |
| `--fc-green` | `#267A43` | Primary buttons, links, selected states | White text is suitable |
| `--fc-natural-green` | `#59A66B` | Decorative accents, illustrations and non-essential fills | Do not use for normal text or essential icons on light surfaces |
| `--fc-pale-green` | `#E8F2EA` | Selected backgrounds, soft surfaces, status backgrounds | Pair text with a dark foreground |
| `--fc-app-bg` | `#F7F9F7` | Application background | Main page surface |
| `--fc-white` | `#FFFFFF` | Cards, inputs, popovers and dialogs | Main raised surface |
| `--fc-text` | `#202821` | Main body text and headings | Default text colour |
| `--fc-text-muted` | `#5B665E` | Secondary text, supporting descriptions and metadata | Meets normal-text AA on the defined light surfaces |
| `--fc-border` | `#DDE3DE` | Decorative dividers and card separation | Not sufficient alone for a functional control boundary |
| `--fc-border-strong` | `#6F8374` | Input borders, selected outlines and meaningful control boundaries | Meets 3:1 non-text contrast on the defined light surfaces |

### 4.2 Semantic colours

| Meaning | Foreground | Background | Usage |
|---|---|---|---|
| Success | `#174D32` | `#E8F2EA` | Saved, completed or successful states; include a check icon or text |
| Error | `#B42318` | `#FEF3F2` | Validation errors and destructive warnings; include explanatory text and an icon |
| Warning | `#8A4B08` | `#FFF7ED` | Caution and potentially destructive consequences; include a text label |
| Information | `#1D4ED8` | `#EFF6FF` | Informational messages and neutral guidance; include a text label |

Do not communicate status, selection, teams or exercise meaning using colour alone. Pair colour with text, an icon, a number, a shape, a line style or another visible cue.

### 4.3 Contrast rules

Target WCAG 2.2 AA:

- Normal text: at least **4.5:1**.
- Large text: at least **3:1**.
- Essential graphical objects and visual information identifying controls or states: at least **3:1** against adjacent colours.
- Decorative borders and graphics do not need to meet the non-text contrast threshold when they convey no information and are not needed to identify a control.

Reference contrast ratios for the palette (calculated using the WCAG relative-luminance formula):

| Foreground | Background | Ratio | Use |
|---|---|---:|---|
| Forest `#174D32` | White `#FFFFFF` | 9.79:1 | AAA for normal text |
| Primary green `#267A43` | White `#FFFFFF` | 5.32:1 | AA for normal text |
| Primary green `#267A43` | Pale green `#E8F2EA` | 4.64:1 | AA for normal text |
| Muted text `#5B665E` | White `#FFFFFF` | 5.99:1 | AA for normal text |
| Muted text `#5B665E` | App background `#F7F9F7` | 5.66:1 | AA for normal text |
| Muted text `#5B665E` | Pale green `#E8F2EA` | 5.22:1 | AA for normal text |
| Functional border `#6F8374` | White `#FFFFFF` | 4.06:1 | Meets 3:1 non-text contrast |
| Functional border `#6F8374` | App background `#F7F9F7` | 3.84:1 | Meets 3:1 non-text contrast |
| Functional border `#6F8374` | Pale green `#E8F2EA` | 3.54:1 | Meets 3:1 non-text contrast |
| Natural green `#59A66B` | White `#FFFFFF` | 2.96:1 | Decorative use only; fails normal-text AA and is below 3:1 |

These ratios cover the combinations shown. Check every new foreground/background combination before introducing it. Do not infer that a colour passes against every surface because it passes against white.

## 5. Typography

### 5.1 Typeface

Use **Manrope Variable** throughout the application.

Recommended package: `@fontsource-variable/manrope`.

Fallback stack:

```css
"Manrope Variable", Manrope, ui-sans-serif, system-ui, sans-serif
```

### 5.2 Type scale

| Role | Size | Weight | Line height |
|---|---:|---:|---:|
| Page title | 30–32px | 700 | 1.2 |
| Section heading | 22–24px | 600 | 1.3 |
| Card title | 18px | 600 | 1.35 |
| Body | 16px | 400 | 1.5 |
| Form label | 14–16px | 600 | 1.4 |
| Supporting text | 14px | 400–500 | 1.5 |
| Metadata | 13–14px | 500 | 1.4 |

Rules:

- Use 16px as the default body text size.
- Do not use tiny text to squeeze more content into cards.
- Use muted text only where the contrast requirement is still met.
- Avoid long line lengths; aim for roughly 60–80 characters for long-form text.
- Do not justify paragraphs.
- Content must remain usable when text is resized to 200% and when WCAG text-spacing overrides are applied.

## 6. Spacing, layout and density

Use a 4px base spacing scale.

| Token | Value | Typical use |
|---|---:|---|
| `--fc-space-1` | 4px | Tight icon/text gap |
| `--fc-space-2` | 8px | Related controls |
| `--fc-space-3` | 12px | Compact component spacing |
| `--fc-space-4` | 16px | Default internal padding |
| `--fc-space-6` | 24px | Card and section spacing |
| `--fc-space-8` | 32px | Major section spacing |
| `--fc-space-12` | 48px | Page-level separation |

Use balanced information density: enough whitespace to scan comfortably without wasting space. Keep content aligned to a consistent page grid. At narrow widths, stack content rather than squeezing desktop columns.

## 7. Surfaces, corners and elevation

| Component | Radius |
|---|---:|
| Small control / chip | 6px |
| Button / input | 8px |
| Card | 10px |
| Dialog / popover | 12px |

- Use 1px light-grey borders for cards and decorative separation.
- Use the stronger functional border for inputs and controls where the boundary is needed to identify the component.
- Use subtle shadows mainly for overlays, menus and dialogs.
- Do not use shadows as the only way to distinguish important controls.
- Selected and focused states must have a visible indicator independent of a subtle shadow.

## 8. Buttons and interactive controls

### 8.1 Button hierarchy

- **Primary:** solid primary green with white text; reserved for the main action in a region.
- **Secondary:** white or neutral surface with a visible border and dark text.
- **Tertiary:** text action, used for low-emphasis actions where the target remains easy to identify.
- **Destructive:** clear destructive text/appearance, with confirmation for irreversible actions.

### 8.2 Sizing

- Aim for at least 44px height for buttons and form controls.
- Aim for 44 × 44px for icon-only touch controls.
- WCAG 2.2 AA's Target Size (Minimum) is 24 × 24 CSS pixels, subject to its exceptions; the larger application target is a usability preference.
- Keep adequate spacing between neighbouring small targets.

### 8.3 Required states

Every interactive component must define default, hover, focus-visible, active/pressed, disabled, loading and error states as applicable.

- Focus indicators must be visible and must not be removed.
- Use a clear 2–3px forest-green focus outline with an offset where practical.
- Do not rely on colour change alone to show focus or selection.
- Disabled controls must be programmatically disabled and not appear interactive.

## 9. Forms

- Every control has a persistent visible label; placeholders are not labels.
- Identify required fields before submission.
- Associate help text and error messages programmatically with their controls.
- Explain how to fix validation errors; do not indicate errors by colour alone.
- On failed submission, provide an error summary or move focus to an appropriate error location without unexpectedly interrupting typing.
- Use native input types and semantic form elements where possible.
- Radio buttons, checkboxes, selects and custom controls must work with keyboard and assistive technology.

## 10. Navigation and page structure

### Desktop

Use a fixed or sticky left sidebar with clear text labels and icons. Show the active destination using more than colour alone (for example, a pale-green background plus a left marker and stronger text weight).

### Mobile

Use a compact bottom navigation for the primary destinations and a clearly labelled menu for secondary destinations. Ensure labels remain available; do not rely on icon recognition alone.

### Semantics

- Provide a skip-to-main-content link.
- Use semantic `header`, `nav`, `main`, `aside` and `footer` landmarks where appropriate.
- Use one clear page-level heading and a logical heading hierarchy.
- Mark the current navigation item programmatically (for example, `aria-current="page"`).
- Use real links for navigation and real buttons for actions.
- Avoid clickable generic containers and nested interactive controls.
- Decorative icons should be hidden from assistive technology. Icon-only buttons need an accessible name.

## 11. Cards, lists and data display

- Exercise and session cards should have a clear title, useful metadata and a predictable action area.
- The whole card may be a link only when it navigates to one destination; do not place other buttons inside that link.
- Use semantic lists for repeated items and real table markup for tabular data.
- Ownership and sharing status need text labels or icons as well as colour.
- Empty states should explain why the list is empty and offer a useful next action.
- Keep action placement consistent across similar cards.

## 12. Exercise diagrams and tactical visuals

Exercise diagrams are central to the product and require a dedicated visual language.

### 12.1 Suggested diagram tokens

| Object | Visual treatment | Additional cue |
|---|---|---|
| Team A | Blue circular marker `#1D4ED8` | White jersey number and accessible label |
| Team B | Red circular marker `#B42318` | White jersey number and accessible label |
| Neutral player/object | Dark neutral `#202821` with outline | Distinct shape or label |
| Cone | Orange `#A34A00` | Triangular cone symbol |
| Ball | High-contrast black/white symbol | Accessible name “Football” |
| Pitch surface | Pale green `#E8F2EA` | — |
| Pitch markings | Functional green-grey `#6F8374` | Do not use faint white lines on pale green |
| Player movement | Forest green `#174D32`, solid line | Arrowhead and movement label where needed |
| Pass direction | Blue `#1D4ED8`, dashed line | Arrowhead and “Pass” label where needed |
| Goal | Dark neutral outline | Text or shape recognisable without colour |

The object colours are a proposed palette. Check contrast for the final marker size, outlines and adjacent surfaces. Team identity must not depend on colour alone.

### 12.2 Diagram alternatives

- Each diagram must have an equivalent written explanation of setup and movements.
- The diagram should have a concise accessible name and, where useful, a longer description.
- Provide a textual inventory or sequence for the key objects and actions when the diagram conveys meaningful relationships.
- SVG graphics must expose appropriate accessible names and descriptions; purely decorative SVGs should be hidden from assistive technology.

### 12.3 Editor operation

Dragging may be supported, but it must not be the only way to position or reorder objects.

Provide non-drag alternatives such as:

- Select an object from an object list.
- Move selected objects using directional buttons.
- Adjust X/Y position using labelled numeric controls where precise placement is needed.
- Add, remove and reorder objects with buttons.
- Make selection state visually clear and programmatically available.
- Ensure keyboard users can reach and operate all editing controls.

### 12.4 Future animation

Animation is outside the current prototype scope. Keep the data model extensible, but do not implement animated playback yet.

Future animation must be user-initiated, controllable (play, pause, restart and speed where appropriate), respect `prefers-reduced-motion`, avoid flashing, and have a textual step sequence or equivalent explanation. Static diagrams must remain available.

## 13. Responsive behaviour

- Desktop: full sidebar and multi-column layouts where useful.
- Tablet: compact navigation and fewer columns.
- Mobile: one-column content, touch-friendly controls and a clear primary navigation.
- At a 320 CSS pixel viewport, ordinary content should reflow without two-dimensional scrolling or loss of functionality.
- Diagrams are a legitimate two-dimensional visual workspace; their canvas may need horizontal/vertical panning or zooming, but supporting text and controls must still reflow.
- Support 200% text resize and 400% browser zoom without clipping or obscuring ordinary content.
- Ensure sticky navigation and overlays do not obscure keyboard focus.
- Avoid fixed-height containers that clip enlarged text.

## 14. Feedback, status and motion

- Use text plus an icon for success, error, warning and information messages.
- Announce important asynchronous feedback programmatically (for example, a status region for “Exercise saved”).
- Associate validation errors with the relevant fields.
- Confirm irreversible destructive actions.
- Use restrained transitions. Respect `prefers-reduced-motion: reduce` and avoid motion that is not necessary to understand the interface.
- Do not automatically play animations or sound.

## 15. Accessibility acceptance criteria

The implementation should be tested against WCAG 2.2 AA, including at least:

- 1.1.1 Non-text Content
- 1.3.1 Info and Relationships
- 1.3.2 Meaningful Sequence
- 1.3.3 Sensory Characteristics
- 1.3.4 Orientation
- 1.4.3 Contrast (Minimum)
- 1.4.4 Resize Text
- 1.4.10 Reflow
- 1.4.11 Non-text Contrast
- 1.4.12 Text Spacing
- 2.1.1 Keyboard
- 2.1.2 No Keyboard Trap
- 2.4.1 Bypass Blocks
- 2.4.3 Focus Order
- 2.4.7 Focus Visible
- 2.4.11 Focus Not Obscured (Minimum)
- 2.5.3 Label in Name
- 2.5.7 Dragging Movements
- 2.5.8 Target Size (Minimum)
- 3.3.1 Error Identification
- 3.3.2 Labels or Instructions
- 4.1.2 Name, Role, Value
- 4.1.3 Status Messages

This is a design-system checklist, not a claim that the application has already passed these criteria.

### Test process

1. Run automated checks (for example, axe) on every primary page and major component state.
2. Complete the main user flows using only a keyboard.
3. Test representative workflows with a screen reader (NVDA on Windows is a useful starting point).
4. Check colour contrast for all real foreground/background combinations.
5. Test at 200% text size, 400% zoom and 320 CSS pixel viewport width.
6. Apply WCAG text-spacing overrides and check for clipping or lost functionality.
7. Test the diagram editor without dragging and without relying on colour alone.
8. Record issues and retest after fixes.

## 16. Design system showcase

The companion `DesignSystemShowcase.tsx` is a temporary, interactive reference page. It demonstrates the core tokens and representative components. It should be used to review the system and to keep component styling consistent.

The showcase is not a production application screen. It should be placed behind a development-only route or temporarily rendered from `App.tsx`. Do not expose it as a normal club navigation item.

## 17. Out of scope for this version

- Dark mode (the current prototype uses the light theme only).
- Animated exercise playback.
- Full production authentication or permissions.
- Final brand logo and club-specific branding.
- A claim of WCAG conformance before the implemented product has been tested.

## 18. Standards and references

- [W3C — Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C WAI — What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C WAI — WCAG Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
