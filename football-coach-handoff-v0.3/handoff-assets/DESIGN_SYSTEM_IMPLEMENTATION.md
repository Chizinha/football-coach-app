# Add the design system to the Football Coach Vite project

These instructions assume the existing project is a React + TypeScript + Vite application using Tailwind CSS v4, shadcn/ui and `lucide-react`.

## 1. Copy the files

Copy:

- `design-tokens.css` into the project root or `src/` (the import example below assumes `src/design-tokens.css`).
- `src/DesignSystemShowcase.tsx` into your project's `src/` folder.
- `src/design-showcase.css` into your project's `src/` folder.
- `DESIGN_SYSTEM.md` into the project root.

The showcase component imports `./design-showcase.css`, so keep those two files in the same folder.

## 2. Install Manrope

The existing project was set up with Inter. The agreed design system uses Manrope Variable.

From the project root, run:

```powershell
npm uninstall @fontsource-variable/inter
npm install @fontsource-variable/manrope
```

## 3. Update `src/index.css`

Keep the existing Tailwind, shadcn and animation imports. Replace the Inter import with Manrope and add the design-token import:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/manrope";
@import "./design-tokens.css";
```

If you put `design-tokens.css` in the project root instead of `src/`, adjust the import path accordingly.

Important: the previously generated `index.css` already contains `:root` and `.dark` blocks with default colours. Remove those old `:root` and `.dark` blocks so they do not override the new token values. This version intentionally defines a light theme only; do not apply a `.dark` class in the prototype.

Keep your existing `@custom-variant dark` and `@theme inline` declarations, but change the font mapping inside `@theme inline` to:

```css
--font-heading: var(--font-sans);
--font-sans: var(--fc-font-sans);
```

Keep the existing colour mappings that reference `--background`, `--foreground`, `--primary`, `--border`, `--input`, `--ring`, `--sidebar` and related shadcn variables. Those semantic variables are now supplied by `design-tokens.css`.

Keep the existing base layer, for example:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
    font-family: var(--fc-font-sans);
    line-height: var(--fc-line-body);
  }

  html {
    @apply font-sans;
  }
}
```

Do not keep a second `font-family: Inter` rule elsewhere in the project.

## 4. Temporarily display the showcase

For the simplest setup, temporarily replace the contents of `src/App.tsx` with:

```tsx
import DesignSystemShowcase from "./DesignSystemShowcase";

export default function App() {
  return <DesignSystemShowcase />;
}
```

This does not require React Router. Later, restore your normal application shell and expose the showcase only through a development-only route or development navigation item.

## 5. Run the project

```powershell
npm run dev
```

Open the local Vite URL shown in the terminal. The page demonstrates colour tokens, typography, spacing, buttons, forms, status messages, content cards and an interactive pitch example.

## 6. Verify the build

```powershell
npm run build
npm run lint
```

Resolve any errors before committing. Then review the page at desktop and mobile widths, navigate it using only the keyboard, and test at 200% zoom. The sample pitch movement buttons demonstrate a non-drag alternative; they are not a complete production diagram editor.

## 7. Commit the design system

Once reviewed, commit these files to your prototype branch. Keep `DESIGN_SYSTEM.md` in the repository root so AI coding agents can read it before implementing new screens.
