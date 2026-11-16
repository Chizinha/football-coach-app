# Football Coach — Front-end Prototype Specification

**Version:** 0.2  
**Status:** Ready for implementation planning  
**Date:** 16 November 2026  
**Product:** Football Coach — exercise and training-session planning for a football club  
**Prototype type:** Front-end only; local browser data; no backend  
**Design reference:** `DESIGN_SYSTEM.md` v0.1 and `design-tokens.css`

---

## 1. Purpose

Build a lightweight, interactive prototype to test the core coaching experience before committing to the full MVP, backend, authentication, club permissions or production infrastructure.

The prototype should let a coach:

1. Browse a small library of football exercises.
2. Create and edit an exercise.
3. Create a clear static exercise diagram using a simple pitch editor.
4. Assemble exercises into a training session.
5. Browse simulated club-shared exercises and sessions.
6. Use a shared exercise directly in a session or duplicate it into their own library.
7. Read and locally edit a sample club-principles and guidelines page.

The most important product question is whether exercises are easy to understand and whether planning a session feels straightforward.

This is a user-experience prototype, not a production release.

## 2. Product principles

Use these principles to resolve implementation and design questions:

1. **Clarity before decoration.** Coaches should understand an exercise quickly.
2. **Fast to use.** Finding, creating and adding content should involve as few steps as practical.
3. **Visuals explain the exercise.** Diagrams should clarify setup and movement, not add visual complexity.
4. **Written instructions remain essential.** A diagram is never the only explanation of an exercise.
5. **Shared content is safe to reuse.** Using a shared exercise in a session must not alter its original content.
6. **Accessible by default.** Keyboard, screen-reader, contrast, zoom and non-drag operation are part of the prototype, not future enhancements.
7. **Mobile-first.** Coaches should be able to read exercises and sessions comfortably on a phone at the pitch.
8. **No AI product features.** AI is used only as a development tool. Do not add AI-generated exercises, sessions, text or diagrams.

## 3. Scope

### 3.1 In scope

- Responsive application shell and navigation.
- Dashboard with useful shortcuts and recent prototype content.
- Exercise library with seeded examples, search and filters.
- Exercise detail view.
- Create, edit, duplicate and delete exercises.
- Static SVG pitch-diagram editor.
- Training-session list, detail view and builder.
- Add, remove, reorder and adjust session exercises.
- Calculate total session duration automatically.
- Simulated club library for exercises and training sessions.
- Simulated visibility state: Private or Shared with club.
- Direct use of shared exercises in a session.
- Duplication of shared exercises into the coach's own library.
- Club principles and guidelines reference page.
- Local persistence using `localStorage`.
- Realistic seed data and a reset-to-demo-data action.
- A development-only route or access method for the Design System Showcase.
- WCAG 2.2 AA-informed implementation and manual accessibility checks.

### 3.2 Explicitly out of scope

Do not implement any of the following:

- Supabase, a database, backend APIs or migrations.
- Authentication, login, registration or password reset.
- Email invitations or real club membership.
- Real sharing or synchronisation between devices or coaches.
- Real role-based permissions or administrator security.
- AI features of any kind inside the product.
- Animated exercise creation or playback.
- PDF export or printing workflows.
- Calendars, attendance, player management or team management.
- Payments, analytics or external integrations.

The interface may simulate private/shared states for usability testing, but it must not imply that changes are synchronised with other coaches. Clearly label the app or demo data as a local prototype where appropriate.

## 4. Technical approach

Use the existing project and dependencies wherever possible.

- React
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui configured for the already-selected Base UI component library
- `lucide-react` for icons
- SVG for the static pitch and diagram objects
- `localStorage` for persistence

Do not introduce a backend or a new state-management library. Do not add dependencies unless a real requirement cannot be met with the existing stack. Explain any proposed new dependency before installing it.

### 4.1 Design-system files

Treat these files as the visual source of truth:

- `DESIGN_SYSTEM.md`
- `design-tokens.css` (the project may have this under `src/`)
- `src/DesignSystemShowcase.tsx`
- `src/design-showcase.css`

Before implementation:

1. Inspect the actual project structure and locate these files.
2. Read `DESIGN_SYSTEM.md` and inspect the tokens and showcase component.
3. Check how the token stylesheet is currently imported.
4. Check whether Manrope Variable is installed and configured.
5. Reuse the existing showcase and design tokens; do not create a competing palette or a second styling system.
6. Do not overwrite working Tailwind, shadcn or Vite configuration without explaining why.

Use the existing Design System Showcase as the component reference. Keep it available through a development-only route such as `/design-system`, or another simple development-only access method if the project has no router. Do not add a routing dependency solely for the showcase. Do not put it in the normal user navigation.

The screenshot `reference/Sample design.png` is a layout reference for the Club Library: simple sidebar, clear page heading, search/filter controls, category chips and a grid of exercise cards. Follow the more refined visual direction and accessibility rules in `DESIGN_SYSTEM.md` rather than copying the screenshot's bare styling.

## 5. Visual and interaction design

The design system takes precedence over this section if a detail conflicts.

### 5.1 Direction

- Modern and polished, professional but approachable.
- White and very light neutral surfaces.
- Classic football-green brand identity.
- Manrope typography.
- Balanced density and consistent spacing.
- Medium corner radii, restrained borders and subtle elevation.
- Functional and calm; avoid decorative gradients, glass effects, heavy shadows and unnecessary sports imagery.

### 5.2 Design-system rules

- Use CSS custom properties from `design-tokens.css` for colour, typography, spacing, radius, focus and layout values.
- Use the semantic shadcn variables mapped to the design tokens.
- Use Manrope Variable as the primary typeface.
- Use Lucide outline icons consistently.
- Reuse shadcn/Base UI components and existing project components where possible.
- Do not add arbitrary hex colours, one-off spacing values or one-off radii when an existing token is suitable.
- Maintain the defined primary, secondary, tertiary and destructive button hierarchy.
- Provide visible hover, focus-visible, active, disabled and loading states where relevant.
- Use semantic HTML and appropriate ARIA only when native semantics are insufficient.
- Do not remove focus outlines.

### 5.3 Application shell and navigation

Use the supplied library screenshot as a structural reference, refined using the design system.

Primary navigation:

1. Dashboard
2. Exercises
3. Training sessions
4. Club library
5. Club principles

Use a desktop sidebar with a placeholder brand mark and the name **Football Coach**. On narrow screens, use an accessible compact navigation pattern such as a bottom navigation for primary destinations plus an accessible menu for secondary actions. Navigation labels must remain available; do not rely on icons alone.

Do not add a login screen. The prototype may display a simple demo coach identity in the interface, but it is not an actual account.

## 6. Information architecture and screens

### 6.1 Dashboard

Purpose: provide a quick starting point, not a large analytics dashboard.

Include:

- Welcome heading with a short neutral introduction.
- Quick actions: Create exercise and Create training session.
- Recently edited exercises and sessions.
- A small summary of the coach's exercises and sessions.
- A useful link to the Club library and Club principles.

All dashboard actions must navigate to a working destination.

### 6.2 Exercises library

Purpose: browse and manage the current demo coach's exercises.

Include:

- Page title and exercise count.
- Search field.
- Category filter and age-group filter.
- Optional quick category chips for common themes.
- Responsive exercise-card grid/list.
- Clear exercise title, category/theme, age group, duration, player count and visibility where relevant.
- Create exercise action.
- Helpful empty state when no results match.

Seed approximately **6–8 realistic exercises**. Do not create 100 placeholder records simply to match the reference screenshot's example count.

Exercise cards must have a clear click/keyboard interaction and must not be implemented as clickable `div` elements. Use a link or button with a useful accessible name.

### 6.3 Exercise detail

Show:

- Exercise title and short objective.
- Static diagram prominently near the top.
- Duration, player count, equipment, area and age group as supporting information when present.
- Setup and organisation.
- Numbered instructions or clearly structured steps.
- Coaching points.
- Optional progressions/variations.
- Written diagram description or movement summary.
- Creator and simulated visibility state.

Available actions depend on the demo state:

- Edit own exercise.
- Duplicate exercise.
- Add exercise to a training session.
- Change simulated visibility for own exercise.
- Delete own exercise after confirmation.

### 6.4 Create/edit exercise

Keep the form focused and progressive. Do not force the coach to fill every optional field.

Fields:

| Field | Requirement |
|---|---|
| Name | Required |
| Short description / objective | Recommended |
| Theme/category | Recommended |
| Age group | Optional |
| Duration | Optional, in minutes |
| Player count | Optional |
| Equipment | Optional, selectable or free-form |
| Playing area | Optional |
| Setup and organisation | Recommended |
| Instructions | Required; allow ordered steps |
| Coaching points | Recommended; allow a short list |
| Progressions / variations | Optional |
| Diagram | Recommended |
| Diagram text description | Required when a diagram communicates meaningful movement |
| Visibility | Private by default; simulated Private or Shared with club |

Use visible labels, associate helper text and validation messages with controls, and clearly identify required fields. On validation failure, provide an error summary or move focus to the first invalid field without surprising the user.

### 6.5 Static exercise diagram editor

Purpose: create simple diagrams that make the exercise immediately understandable. This is not a professional tactical-analysis tool.

Use an SVG canvas and structured diagram data. Use a stable viewBox, for example `0 0 1000 600`, with object coordinates stored consistently in that space. Keep the data model extensible for future animation, but do not implement animation now.

Supported pitch/area backgrounds:

- Full pitch.
- Half pitch.
- Simple rectangular training area.

Supported objects:

- Team A players.
- Team B players.
- Goalkeeper.
- Ball.
- Cones.
- Goals.
- Directional arrows for pass, movement/run or dribbling.
- Short text labels.

Visual meaning should follow `DESIGN_SYSTEM.md`:

- Pale green pitch surface and sufficiently contrasting pitch markings.
- Team A blue markers and Team B red markers.
- White jersey numbers or clear labels.
- Distinguishable shapes or text labels so team identity is not conveyed by colour alone.
- Cones as orange triangular symbols.
- Ball and goal with recognisable high-contrast shapes.
- Different arrow styles for passing and player movement; use line pattern and arrowheads as well as colour.

Editor interactions:

- Add objects using clear toolbar buttons.
- Select an object and show its selection state clearly.
- Move objects using pointer drag where practical.
- Provide non-drag alternatives: object list selection, directional nudge buttons and labelled X/Y position inputs (or equivalent controls).
- Edit basic object properties such as team, number/label and arrow type where relevant.
- Delete selected object.
- Provide undo if reasonably achievable without adding significant complexity; if omitted, provide a clear reset/clear action with confirmation.
- Save and reopen the diagram as structured data.
- Support usable viewing on mobile. If detailed editing is difficult on a phone, prioritise accessible viewing and make the editor controls adapt to the viewport rather than disappear.

Accessibility:

- The canvas must have an accessible name and description.
- Provide a written exercise explanation that describes the important setup and movement independently of the diagram.
- Provide a selectable object list or equivalent textual inventory.
- Do not require dragging to add, select, move or delete objects.
- Keyboard users must be able to operate object selection and all controls.
- The diagram must not rely on colour alone.
- Decorative SVG sub-elements should not create noisy screen-reader output. Expose a concise graphic description and provide detailed information in the surrounding text/object list.

### 6.6 Training sessions

Seed **2 realistic example sessions**.

Training session list:

- Session name.
- Main theme.
- Age group.
- Total duration.
- Number of exercises.
- Simulated visibility state.
- Create, open, duplicate and delete actions where applicable.

Session builder:

- Create and edit a session.
- Set name, description, age group and theme.
- Add an exercise from the coach's library or Club library.
- Remove an exercise.
- Reorder exercises. Provide explicit Move up and Move down buttons; drag-and-drop may be an additional convenience but must not be the only method.
- Override planned duration for this session without changing the source exercise.
- Add session-specific notes for each exercise.
- Automatically calculate and display total duration.
- Save, reopen and duplicate the session.
- Set simulated visibility to Private or Shared with club.

Session detail/viewer:

- Show a readable session overview.
- Present exercises in order with duration and session notes.
- Make each exercise easy to open for more detail.
- Use a useful phone layout for viewing on the pitch.

### 6.7 Direct use versus duplication of shared content

The prototype must make both reuse behaviours testable.

**Use directly:**

- Add a club-shared exercise to a session without creating a new exercise in the coach's library.
- Store an exercise snapshot in the session item so the session remains stable if the source exercise is later edited.
- Allow session-specific duration and notes.
- Do not allow editing the source exercise through the session item.

**Duplicate:**

- Create a new independent exercise record in the local coach library.
- Copy the description, instructions, metadata and diagram.
- Give the copy a new ID and set its visibility to Private by default.
- Make the copy editable without affecting the original.

The UI must make the difference clear. Since this is a local prototype, do not imply that another real coach will see content marked as shared.

### 6.8 Club library

Purpose: simulate discovering shared club material.

Include:

- Two content views or tabs: Exercises and Training sessions.
- Search and useful filters.
- Category/age-group chips where appropriate.
- Creator information and clear Shared with club label.
- Exercise and session detail access.
- Actions to Use in session and Duplicate.

Seed a small set of realistic shared exercises and sessions. Some can be the same records used in demo sessions; avoid unnecessary duplicate data.

The library screenshot provided by the user should inform the page structure: heading, count, search, filters and clear cards. Apply the current design system to the visual treatment.

### 6.9 Club principles and guidelines

Create a simple, readable reference page with sample content for:

- Club playing principles.
- Coaching principles.
- Training-session guidance.
- Language and behaviours expected from coaches.

Use clear headings, short sections, lists and callouts only where helpful. Make example content visibly editable in the local prototype (for example, an Edit mode that saves to localStorage). Do not invent a real club philosophy or claim the sample text is approved club policy; mark it as placeholder/demo guidance.

## 7. Data model and local persistence

Use TypeScript interfaces for all stored data. Keep the model simple and typed.

Suggested conceptual types:

### Exercise

- `id: string`
- `title: string`
- `description: string`
- `theme: string`
- `ageGroups: string[]`
- `durationMinutes?: number`
- `playerCount?: { min?: number; max?: number }`
- `equipment: string[]`
- `playingArea?: string`
- `setup: string`
- `instructions: string[]`
- `coachingPoints: string[]`
- `progressions: string[]`
- `diagram?: DiagramDocument`
- `diagramDescription?: string`
- `visibility: "private" | "club"`
- `creatorName: string`
- `createdAt: string`
- `updatedAt: string`
- Optional source metadata for duplicated demo content.

### DiagramDocument

- A schema version.
- Pitch type and stable coordinate/viewBox information.
- An ordered array of typed objects.
- Objects use a discriminated union for players, goalkeeper, cone, ball, goal, arrow and label.
- Positions use the stable diagram coordinate system, not viewport pixels.
- Arrows include start/end points and a semantic type such as `pass`, `run` or `dribble`.
- Players include team, number and optional label.

### TrainingSession

- `id: string`
- `title: string`
- `description: string`
- `theme: string`
- `ageGroup?: string`
- `visibility: "private" | "club"`
- `creatorName: string`
- `items: SessionExercise[]`
- `createdAt: string`
- `updatedAt: string`

### SessionExercise

- `id: string`
- `sourceExerciseId: string`
- `sourceVisibility: "private" | "club"`
- `order: number`
- `plannedDurationMinutes?: number`
- `sessionNotes?: string`
- `exerciseSnapshot: ExerciseSnapshot`

The snapshot should contain the exercise content and diagram required to render the session independently of future source changes. Avoid storing unnecessary duplicate system metadata.

### Persistence requirements

- Use `localStorage` with namespaced keys, such as `football-coach-prototype:v1:exercises` and `football-coach-prototype:v1:sessions`.
- Persist edits, creates, deletes, duplications and local principles-page edits.
- Load seed data only when no saved prototype data exists; do not overwrite user changes on every load.
- Handle malformed or unavailable localStorage gracefully with a useful error/fallback.
- Include a clearly labelled Reset demo data action with confirmation.
- Keep a simple storage schema version so future prototype changes can be migrated or reset safely.
- Do not store credentials, personal data or secrets.

## 8. Seed content

Seed realistic examples that demonstrate the product, not placeholder lorem ipsum.

- 6–8 exercises across warm-up, passing, possession, dribbling, defending, shooting and finishing.
- Each seed exercise should have a useful title, short objective, player count, equipment, setup, instructions and coaching points.
- At least 4 seed exercises should have static diagrams with meaningful objects and movement arrows.
- 2 complete training sessions with coherent exercise order and total duration.
- A small shared club library with representative exercises and at least 1 shared session.
- Example club principles and coaching guidelines clearly marked as demo content.

Do not create excessive data. Quality and clarity matter more than volume.

## 9. Accessibility requirements

Target **WCAG 2.2 Level AA**. This is an implementation target, not a claim of conformance. Follow `DESIGN_SYSTEM.md` and include the following in the prototype:

### Visual

- Normal text contrast at least 4.5:1; large text at least 3:1.
- Essential controls and graphical information at least 3:1 against adjacent colours.
- Do not use the natural-green decorative token for normal text or essential icons on light surfaces.
- Do not use colour alone to communicate category, team, visibility, errors, selection or state.
- Use 16px default body text and the agreed Manrope type scale.
- Support 200% text resize, 400% browser zoom and text-spacing overrides without clipping ordinary content.

### Keyboard and pointer

- All functions must be reachable and operable using a keyboard.
- Provide a visible, high-contrast `:focus-visible` indicator.
- Include a Skip to main content link.
- Avoid keyboard traps; dialogs must manage and restore focus correctly.
- Provide a non-drag alternative for every drag-based operation.
- Aim for 44 × 44px touch targets. Never fall below WCAG 2.2 AA's 24 × 24 CSS pixel minimum except where a documented criterion exception applies.
- Do not make hover the only way to discover or use an action.

### Semantics and assistive technology

- Use semantic landmarks and a logical heading hierarchy.
- Use links for navigation and buttons for actions.
- Give icon-only buttons accessible names.
- Associate visible labels, help text and errors with their form controls.
- Announce important asynchronous feedback using an appropriate status/live region.
- Provide text alternatives for meaningful diagrams and a textual object inventory.
- Ensure selected, expanded, invalid and disabled states are exposed programmatically.

### Motion and responsive behaviour

- Respect `prefers-reduced-motion`.
- No automatic animation or sound.
- Ordinary content must reflow at 320 CSS pixels without two-dimensional scrolling.
- Diagrams may require their own pan/zoom workspace, but supporting controls and text must still reflow.
- Sticky elements and overlays must not obscure focused controls.

### Testing

- Run automated accessibility checks (axe or an equivalent tool if already available).
- Test all primary flows using keyboard only.
- Test representative screens with NVDA or another screen reader.
- Test at 200% text resize, 400% zoom and 320 CSS pixel viewport width.
- Apply text-spacing overrides and check for clipping.
- Test the diagram editor without dragging and without colour-only information.
- Fix all critical and serious automated findings before calling the prototype ready for review.

## 10. Main prototype user flows

The following flows must work end-to-end:

### Flow A — Create an exercise

1. Open Exercises.
2. Select Create exercise.
3. Enter a name, objective, setup and instructions.
4. Add a diagram using the pitch editor.
5. Enter a written diagram description.
6. Save the exercise.
7. Find and open it in the exercise library.
8. Refresh the page and confirm it remains saved.

### Flow B — Edit and duplicate an exercise

1. Open an existing exercise.
2. Edit a field or diagram and save.
3. Duplicate the exercise.
4. Change the duplicate's title or instructions.
5. Confirm that the original remains unchanged.

### Flow C — Build a training session

1. Open Training sessions.
2. Create a session.
3. Add at least two exercises.
4. Change order using explicit controls.
5. Adjust one planned duration and add a session note.
6. Confirm the total duration updates.
7. Save, reopen and refresh the page.

### Flow D — Use shared content

1. Open Club library.
2. Find a shared exercise.
3. Add it directly to a session.
4. Confirm that the source exercise was not duplicated into the personal exercise library.
5. Duplicate another shared exercise.
6. Edit the duplicate and confirm the shared original is unchanged.

### Flow E — Read club principles

1. Open Club principles.
2. Browse the sample sections.
3. Enter edit mode.
4. Change a piece of demo content and save.
5. Refresh and confirm the change persists.

### Flow F — Accessibility of diagram editing

1. Navigate to the diagram editor using only the keyboard.
2. Add a player and a cone without dragging.
3. Select an object through the object list.
4. Move it using keyboard-operable nudge or coordinate controls.
5. Confirm the accessible description/object inventory reflects the diagram.

## 11. Definition of done

The prototype is ready for user review when:

- All primary navigation destinations work.
- Exercise create, view, edit, duplicate and delete flows work.
- Static diagram objects can be added, selected, moved, edited and removed.
- Every diagram can be understood through accompanying text.
- Session creation, ordering, duration calculation, notes and persistence work.
- Direct use and duplication of shared exercises behave differently and correctly.
- Club library search and filters work on seeded data.
- Club principles can be read and locally edited.
- Refreshing the browser does not lose saved work.
- Reset demo data works with confirmation.
- Design-system tokens and components are used consistently.
- The Design System Showcase remains accessible in development but is not part of ordinary user navigation.
- `npm run build` passes.
- `npm run lint` passes, or any pre-existing unrelated issues are documented.
- The main accessibility checks in Section 9 have been performed and issues recorded.

## 12. Implementation approach

Implement in small, reviewable stages:

1. **Inspect and plan:** Review the existing app, dependencies, design-system files and project rules. Identify any setup gaps. Present a component/file plan and wait for approval before changing files.
2. **Design foundations and shell:** Apply the tokens, verify Manrope, build the responsive app shell and navigation. Preserve the Design System Showcase.
3. **Exercise library and detail:** Add typed data models, seed data, search/filter, detail view and local persistence.
4. **Exercise form and diagram editor:** Build the form and accessible static SVG editor.
5. **Training sessions:** Build list, detail and session builder with snapshot behaviour and duration calculation.
6. **Club library and principles:** Add simulated sharing, use/duplicate flows and editable local reference content.
7. **Accessibility and QA:** Test all flows, responsive layouts, keyboard operation, diagram alternatives, build and lint.

Do not build all screens in one unreviewed code dump. Keep components focused, reuse common patterns and test each stage before moving on.

## 13. Important implementation constraints

- No Supabase imports or environment variables are needed for this prototype.
- Do not create production database tables, migrations or RLS policies.
- Do not build authentication or a real invitation flow.
- Do not claim the local shared library is synchronised with a club.
- Do not add animated diagrams; preserve a future-friendly data structure only.
- Do not add AI features.
- Do not replace the design system with a new visual direction.
- Do not remove or break the existing Design System Showcase.
- Do not silently change project dependencies or configuration.
- Ask before installing a new dependency or replacing a major existing setup.
