# Antigravity handoff prompt — integrate design system, then prepare prototype

Use this prompt with Antigravity while the EXISTING `football-coach-app` project is open. The handoff files are in `football-coach-handoff-v0.3/handoff-assets/`.

---

We are preparing a front-end-only prototype for a football coaching application. I have added a handoff folder containing both the design system and the prototype specification. The design system has NOT yet been integrated into this project.

## Read these sources first

Read the following files in full before proposing changes:

1. `football-coach-handoff-v0.3/handoff-assets/DESIGN_SYSTEM.md` — the visual, component and accessibility source of truth.
2. `football-coach-handoff-v0.3/handoff-assets/design-tokens.css` — the approved CSS tokens.
3. `football-coach-handoff-v0.3/handoff-assets/DESIGN_SYSTEM_IMPLEMENTATION.md` — integration guidance.
4. `football-coach-handoff-v0.3/handoff-assets/PROTOTYPE_SPEC.md` — exact front-end prototype scope and acceptance criteria.
5. `football-coach-handoff-v0.3/README_FIRST.md` — handoff and safety instructions.
6. `PROJECT_RULES.md` in the project root, if it exists.

Also inspect the supplied reference image at `football-coach-handoff-v0.3/handoff-assets/reference/Sample design.png`.

## Project context

This is an existing Windows project using React, TypeScript, Vite, Tailwind CSS v4, shadcn configured with Base UI, and lucide-react. Do not assume its current files match a clean starter. Inspect the actual repository before deciding how to integrate the design system.

## Important: two-stage task

The design system is not installed yet. Your job is to plan how to integrate it safely AND how to build the prototype using it. Do not skip the design-system integration stage.

### Stage A — integrate the design system

Your plan must cover:

- Add `@fontsource-variable/manrope` and replace the old Inter font dependency/import if Inter is currently used and no longer needed.
- Copy `design-tokens.css` into the actual source tree at a suitable location, normally `src/design-tokens.css`.
- Integrate its import into the existing `src/index.css` without deleting required Tailwind v4, tw-animate, shadcn or Vite setup.
- Reconcile the old shadcn `:root` / `.dark` semantic variables with the approved light-theme tokens. Avoid duplicate definitions that override the design tokens.
- Preserve any required existing CSS configuration and explain any theme mapping changes.
- Add the supplied `DesignSystemShowcase.tsx` and `design-showcase.css` to the application in the right locations. The showcase component source is in `football-coach-handoff-v0.3/handoff-assets/src/`.
- Make the showcase accessible through a temporary development-only route or access method, without putting it in normal end-user navigation.
- Keep the app's existing structure and working features. Do not replace `App.tsx` wholesale without explaining why and obtaining approval.
- Do not enable a dark theme for this prototype unless the existing project already requires it; the supplied token set is a light theme.

### Stage B — build the front-end prototype

Follow `PROTOTYPE_SPEC.md` strictly. The prototype uses the integrated design system, SVG diagrams and browser `localStorage` only.

It includes the dashboard, exercise library and editor, static pitch diagram editor, training-session builder, simulated Club Library, and Club Principles page.

Do NOT build Supabase, backend APIs, database migrations, authentication, email invitations, real sharing/synchronisation, AI product features, animated exercise playback, PDF export or player management.

The prototype specification defines the exact required behaviour and demo data. Do not invent extra product scope.

## Visual and accessibility rules

- `DESIGN_SYSTEM.md` is the visual and accessibility source of truth. Do not invent a second design system.
- Use Manrope, the classic football-green palette, balanced spacing, soft polished surfaces, medium radii and restrained shadows.
- Use the design tokens rather than hardcoding new colours, radii or spacing values in components.
- Retain the supplied Club Library screenshot as a structural reference only; improve it using the agreed design system.
- Target WCAG 2.2 AA-informed implementation. Use semantic HTML, accessible names, visible keyboard focus, keyboard-operable interactions, properly labelled form fields, associated error messages, status announcements and responsive reflow.
- Aim for 44 × 44px pointer targets where practical.
- Do not rely on colour alone to communicate team, status, selection or movement.
- Every diagram needs a written explanation. The diagram editor must provide non-drag alternatives to positioning objects.
- Respect `prefers-reduced-motion`.
- Do not claim WCAG conformance. Report the checks actually performed and anything still needing manual review.

## Development safeguards

- Preserve the current Git branch and uncommitted work. Do not reset, clean, checkout another branch, force-push or discard changes.
- Never inspect, print, copy into source control or expose secrets from `.env`, `.env.local` or other environment files.
- Do not add dependencies unless needed. Explain why before installing them.
- Do not change Cloudflare, Supabase or GitHub settings.
- Avoid changing project configuration until you have inspected the current files and explained the proposed edits.

## Your first response must be a plan only

**Do not modify any files yet.** Inspect and report:

1. Current project structure, Git status and relevant dependencies.
2. Current `src/index.css`, font imports and shadcn semantic theme setup.
3. Whether Manrope is already installed and whether Inter is still referenced.
4. Where and how the design tokens should be integrated.
5. How the design showcase should be wired in without disrupting the current app.
6. Any conflicts between the existing project and the supplied design-system/prototype files.
7. A proposed file-by-file change list for Stage A and Stage B.
8. A staged implementation plan, including build/lint and accessibility checks.
9. Any risks or decisions that need my approval.

Stop after presenting the plan. Wait for my approval before changing files.
