# Antigravity follow-up prompt — after reviewing its plan

Use this only after Antigravity has presented its inspection and implementation plan and you have approved it.

The plan is approved. Proceed with the work in the agreed order.

1. **Integrate the design system first.** Add Manrope, integrate `design-tokens.css`, reconcile the global/shadcn theme variables, add the showcase source and make the showcase accessible through the agreed development-only route or access method. Preserve existing application structure and project configuration wherever possible.
2. Run the app and verify the design-system showcase renders correctly. Run `npm run build` and `npm run lint`. Fix any issues introduced by the integration before moving on.
3. **Then implement the prototype** in small stages according to `football-coach-handoff-v0.3/handoff-assets/PROTOTYPE_SPEC.md`.
4. Follow `football-coach-handoff-v0.3/handoff-assets/DESIGN_SYSTEM.md` as the visual and accessibility source of truth. Use tokens and reusable components; do not invent parallel styles.
5. Keep the prototype front-end-only with localStorage. Do not add backend, Supabase, authentication, real sharing, AI product features, animation, PDF export or unrelated features.
6. Preserve seeded demo content only on first run; never overwrite users' local changes on refresh. Provide a clearly labelled reset-to-demo-data action with confirmation.
7. After each implementation stage, summarise files changed, working flows, checks performed and remaining issues.
8. At the end, run `npm run build` and `npm run lint`; test the main exercise, diagram, session and club-library flows; test keyboard-only operation, visible focus, responsive layouts and relevant accessibility checks.
9. Do not claim WCAG conformance. Report automated results and manual checks separately, and list anything that still needs human testing.

Do not make changes outside the approved plan without asking first.
