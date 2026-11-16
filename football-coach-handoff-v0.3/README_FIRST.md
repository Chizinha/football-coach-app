# Football Coach — complete Antigravity handoff v0.3

This package combines the design system and the front-end prototype brief. It is intended to be added to your existing `football-coach-app` repository.

## What is included

- `ANTIGRAVITY_HANDOFF_PROMPT.md` — the first prompt to paste into Antigravity.
- `APPROVAL_AND_BUILD_PROMPT.md` — the follow-up prompt to use only after you review and approve Antigravity's plan.
- `handoff-assets/DESIGN_SYSTEM.md` — the visual and accessibility source of truth.
- `handoff-assets/design-tokens.css` — CSS custom properties and accessible semantic tokens.
- `handoff-assets/src/DesignSystemShowcase.tsx` and `design-showcase.css` — the React showcase source.
- `handoff-assets/DESIGN_SYSTEM_IMPLEMENTATION.md` — detailed integration notes.
- `handoff-assets/PROTOTYPE_SPEC.md` — the front-end-only prototype scope and acceptance criteria.
- `handoff-assets/reference/Sample design.png` — the original Club Library screenshot reference.

## Safest way to add it to your project

1. In GitHub Desktop, confirm you are on your `prototype` branch. Commit or stash any work you want to keep.
2. Extract this ZIP somewhere convenient, such as Downloads.
3. Copy the entire `football-coach-handoff-v0.3` folder into `C:\Projects\football-coach-app`.
4. Your project should now contain the handoff folder alongside `src`, `package.json` and the rest of your existing app:

   ```text
   football-coach-app/
   ├── src/
   ├── package.json
   ├── PROJECT_RULES.md          (if you created one)
   └── football-coach-handoff-v0.3/
       ├── README_FIRST.md
       ├── ANTIGRAVITY_HANDOFF_PROMPT.md
       ├── APPROVAL_AND_BUILD_PROMPT.md
       └── handoff-assets/
   ```

5. Open the existing `C:\Projects\football-coach-app` folder in Antigravity. Do not open the handoff folder as a separate project.
6. Start an agent conversation and paste the contents of `ANTIGRAVITY_HANDOFF_PROMPT.md`.
7. Antigravity should inspect the existing app and return a plan without changing files. Review that plan.
8. Once the plan looks right, paste the contents of `APPROVAL_AND_BUILD_PROMPT.md`.

## Important safeguards

- Do not replace your existing project with the contents of this ZIP.
- Do not copy the handoff assets over the project blindly. Let Antigravity inspect and integrate them while preserving existing configuration.
- Keep `.env.local` and all real secrets out of Git. The prototype does not need Supabase, so it should not read or use Supabase credentials.
- Do not include the full `MVP_SPEC.md` in the prototype task. The dedicated `PROTOTYPE_SPEC.md` intentionally restricts the task to a local front-end prototype and prevents backend scope creep.
- Keep the work on the `prototype` branch until you are happy with it.
