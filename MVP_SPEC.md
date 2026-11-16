# Football Coach — MVP Specification

**Document status:** Initial product specification  
**Version:** 0.1  
**Date:** 9 November 2026  
**Product:** A shared football coaching platform for coaches within a club

---

## 1. Product vision

Build a simple, mobile-first web application that helps football coaches create clear exercises, assemble training sessions, and share useful coaching material across their club.

The product should make it easy for a coach to understand an exercise at a glance and to reuse good material created by other coaches. It should support the club in developing a shared coaching approach through an accessible library of exercises, sessions, principles, and guidelines.

### Core value proposition

**Help coaches spend less time recreating training material and more time preparing and delivering good training sessions.**

### Product principles

1. **Clarity first:** Exercises must be easy to understand, including through clear static diagrams.
2. **Fast to use:** Creating, finding, and adding content should require as little effort as possible.
3. **Share without losing ownership:** Coaches can use shared material directly or make their own copy without changing the original.
4. **Club knowledge should be accessible:** Shared exercises, sessions, and club guidance should be easy to find.
5. **Mobile-first:** Coaches must be able to comfortably view material on a phone at the pitch. Planning should also work well on desktop.
6. **No AI features in the product:** The application will not generate exercises, sessions, text, or diagrams using AI. AI may be used as a development tool while building the application, but it is not a product feature.

---

## 2. MVP goals and success criteria

### MVP goals

A coach should be able to:

- Sign in after being invited to the club.
- Create, edit, view, and delete their own exercises.
- Add a clear static football-pitch diagram to an exercise using an in-app diagram editor.
- Find and filter exercises available to them.
- Create a training session and arrange exercises in a chosen order.
- Adjust the duration of an exercise for a particular session without changing the original exercise.
- Use a shared club exercise directly in a session, or duplicate it into their own library.
- Share their own exercises and sessions with the club.
- Browse and read the club's principles and coaching guidelines.

A club administrator should additionally be able to:

- Invite coaches by email.
- Manage club membership and coach/admin roles.
- Create and update the club's principles and guidelines page.
- Manage shared club content when moderation is needed.

### MVP success criteria

The MVP is ready for a small club pilot when:

1. An invited coach can accept an invitation, create an account, and access the club.
2. A coach can create an exercise with instructions and a saved pitch diagram.
3. Another coach in the same club can find that shared exercise and open it.
4. The second coach can either add the shared exercise directly to a session or duplicate it into their own library.
5. A coach can create, save, reopen, and share a complete training session.
6. Changes to an original exercise do not silently alter an already-saved session's exercise content or diagram.
7. A coach cannot access private content belonging to another coach or content from a club they do not belong to.
8. The application is usable on a typical mobile phone and desktop browser.

---

## 3. Users, roles, and permissions

The first release is designed for one club in the user interface. The database should include club identifiers so that support for multiple clubs can be added later without redesigning every table.

### Roles

**Coach**

- Create and manage their own exercises and sessions.
- View shared exercises and sessions belonging to their club.
- Add shared exercises directly to their sessions.
- Duplicate shared exercises and sessions into their own library.
- Share their own exercises and sessions with the club.
- Read club principles and guidelines.

**Club administrator**

- All coach permissions.
- Invite coaches by email.
- Resend or revoke pending invitations.
- Manage club membership and roles.
- Edit the club principles and guidelines page.
- Moderate or remove shared content when necessary.

### Ownership and editing rules

- A creator owns the content they create.
- A coach can edit and delete their own content.
- Other coaches can view club-shared content but cannot edit the original.
- A coach can make a separate copy of another coach's shared content and edit that copy.
- Club administrators can moderate shared content. Administrative actions should be clearly distinguished from ordinary editing.
- Private content is visible only to its owner and authorised administrators where required for support or moderation. The exact admin access policy should be explicit in the database rules rather than accidental.

### Visibility states

Exercises and training sessions have two MVP visibility states:

- **Private:** Visible to the creator only.
- **Shared with club:** Discoverable by active members of the same club.

New content should default to **Private**. Sharing should require an explicit action by the creator.

---

## 4. Information architecture and navigation

### Primary navigation

1. **Dashboard** — overview and shortcuts.
2. **Exercises** — searchable exercise library, including the coach's own private exercises and club-shared exercises.
3. **Training sessions** — list and manage training sessions.
4. **Club library** — discover shared exercises and sessions from the club.
5. **Club principles** — the club's coaching principles and guidelines for reference.
6. **My content** — the coach's own exercises and sessions, with visibility and ownership information.
7. **Settings** — account and basic club information. Membership administration is available to club administrators.

On mobile, use a compact navigation pattern such as a bottom navigation bar or a simple collapsible menu. Do not make the desktop sidebar the only way to navigate.

### Main screens

- Sign in / accept invitation
- Dashboard
- Exercise library
- Exercise detail
- Create/edit exercise
- Exercise diagram editor
- Training session list
- Session detail / session viewer
- Session builder
- Club library
- My content
- Club principles and guidelines
- Basic account settings
- Club member and invitation management (administrator only)

---

## 5. Functional requirements

## 5.1 Authentication and club invitations

### Invitation flow

Club membership is invitation-based for the MVP. There should not be an unrestricted public registration flow that automatically grants access to the club.

1. A club administrator enters a coach's email address and selects a role (Coach or Club administrator, if role assignment is permitted for the MVP).
2. The application creates a pending invitation associated with the club and intended email address.
3. The invited person receives an email containing a secure invitation link.
4. The recipient opens the link and either creates an account or signs in to an existing account.
5. The application validates the invitation and adds the authenticated user to the club.
6. The invitation is marked as accepted and cannot be reused.

### Invitation management

Administrators can:

- See pending and accepted invitations.
- Resend a pending invitation.
- Revoke a pending invitation.
- See current club members and their roles.
- Remove a member or change their role, subject to the club's ownership rules.

### Invitation security

- Invitation links must use unpredictable, single-use tokens.
- Tokens must expire after a defined period.
- The invited email address must be verified or otherwise matched to the account accepting the invitation.
- A revoked, expired, or already-used token must not grant access.
- Do not rely on frontend-only checks for membership. Enforce access in Supabase policies.

### Authentication scope

Use Supabase Auth for account creation and sign-in. Email/password or an email-based sign-in flow can be selected during implementation. Password reset or account recovery should use Supabase's supported flow.

---

## 5.2 Exercise library and exercise management

### Exercise information

An exercise should support the following fields:

| Field | Required? | Notes |
|---|---|---|
| Name | Yes | Short, recognisable title. |
| Short description | Recommended | One- or two-sentence summary. |
| Objective / theme | Recommended | What the exercise trains, e.g. passing, finishing, defending, transition, possession. |
| Setup and organisation | Recommended | Player arrangement, area, teams, and starting positions. |
| Instructions | Yes | Clear, ordered explanation of how to run the exercise. |
| Coaching points | Recommended | What the coach should observe or emphasise. |
| Progressions / variations | Optional | Ways to make the exercise easier, harder, or different. |
| Duration | Optional | Suggested duration in minutes. |
| Player count | Optional | Recommended minimum/maximum or a simple range. |
| Equipment | Optional | Balls, cones, goals, bibs, mannequins, etc. |
| Playing area | Optional | Suggested dimensions or area description. |
| Age group | Optional | Recommended age group(s). |
| Diagram | Recommended | Static diagram made with the in-app pitch editor. |
| Visibility | Yes | Private or Shared with club. |
| Creator and timestamps | System fields | Creator, created date, updated date. |

Do not force coaches to fill in every optional field. The creation experience should support a useful exercise with a small amount of information and allow more detail to be added when needed.

### Exercise library functions

- View exercises the user owns and exercises shared with their club.
- Search by exercise name and relevant text fields.
- Filter by theme, age group, player count, duration, and equipment where those fields are present.
- Make it clear whether an exercise is private or shared.
- Display creator information for shared content.
- Open an exercise detail view optimised for reading on a phone.
- Edit or delete own exercises.
- Duplicate an exercise into the user's own library.
- Share or unshare own exercises.

### Exercise detail view

Prioritise comprehension and readability:

- Show the title and objective clearly.
- Show the diagram prominently, without requiring the coach to scroll past long text first on a phone.
- Separate setup, instructions, coaching points, and progressions into clear sections.
- Show duration, player count, equipment, playing area, and age group as compact supporting information.
- Make the creator and sharing state visible.
- Provide clear actions based on permissions: Edit, Duplicate, Add to session, Share/Unshare, or Delete.

---

## 5.3 Static exercise diagram editor

**Static diagrams are an MVP requirement.** The goal is to make exercises easier to understand, not to create a professional tactical-analysis suite.

### MVP editor capabilities

Provide a simple top-down pitch/playing-area editor that lets a coach:

- Choose a pitch layout or field area (for example, full pitch, half pitch, or a simple rectangular area).
- Add, move, and remove player markers.
- Distinguish teams using clear visual styles or colours.
- Add a goalkeeper marker.
- Add a ball marker.
- Add cones and goals.
- Add arrows/lines to show passes, runs, dribbling, or movement.
- Add short text labels where useful.
- Select an object and change its position or basic properties.
- Clear or undo accidental changes where practical.
- Save the diagram with the exercise.
- Reopen and edit the saved diagram.
- View the diagram in the exercise detail page and in a training session.

### Diagram usability requirements

- The editor should be usable with a mouse on desktop and touch on mobile. If precise editing on mobile is too difficult for the first release, mobile must at least support viewing diagrams comfortably; editing may be optimised for desktop first.
- Objects must remain legible at common phone widths.
- Use simple, consistent visual conventions for players, teams, goals, cones, and arrows.
- Provide a visible legend or simple labels when a diagram uses symbols that may not be obvious.
- Avoid relying on colour alone to distinguish teams or meaning.
- The diagram should scale without becoming blurry.
- Saved diagrams should reopen in the editor with their objects and positions intact.

### Diagram data and future compatibility

Do not store a diagram only as a flattened screenshot. Store a structured, versioned diagram document (for example, JSON) containing the pitch configuration and objects with their types, positions, labels, and arrow paths. The application can render that data as SVG or another suitable scalable format.

This makes diagrams editable and provides a foundation for possible animated exercises later. The data format should have a version field so it can be migrated if the diagram model changes.

### Not required for MVP

- Animated player movement.
- Timelines or keyframes.
- Playback, pause, or playback speed controls.
- Multi-frame tactical sequences.
- 3D views.
- Advanced tactical drawing tools.

---

## 5.4 Training session management and builder

A training session is a planned sequence of exercises. Exercises remain independent library items and can be reused across multiple sessions.

### Training session information

| Field | Required? | Notes |
|---|---|---|
| Session name | Yes | E.g. "Passing and movement". |
| Description | Optional | Overall purpose or notes. |
| Age group | Optional | Intended age group. |
| Main theme | Optional | Main session focus. |
| Planned date | Optional | Do not require a calendar in the MVP. |
| Visibility | Yes | Private or Shared with club. |
| Creator and timestamps | System fields | Creator, created date, updated date. |

### Session builder functions

- Create a new session.
- Search and browse exercises available to the coach.
- Add an exercise owned by the coach.
- Add a club-shared exercise directly without duplicating it into the coach's library.
- Add a duplicated exercise from the coach's own library.
- Reorder exercises in the session.
- Remove an exercise from the session without deleting the library exercise.
- Set a planned duration for each exercise in the context of that session.
- Add session-specific notes for an exercise.
- Show the total planned session duration and update it automatically when durations change.
- Save, reopen, edit, duplicate, and share the session.

### Exercise content snapshot rule

When an exercise is added to a session, save a snapshot of the exercise content and its diagram as it existed when added (or when the coach explicitly refreshes the item). This ensures a later edit to the original library exercise does not unexpectedly change an existing session plan.

The session item should also retain a reference to the source exercise when one exists. This allows the interface to show where the exercise came from and optionally offer a deliberate refresh action in a future iteration.

For MVP, do not silently refresh snapshots when the source exercise changes.

### Session detail / viewing mode

- Present exercises in the planned order.
- Show the planned duration for each exercise.
- Show session-specific notes.
- Show the exercise instructions and diagram in a readable format.
- Show the total session duration.
- Make the session comfortable to use on a phone while coaching on the pitch.

---

## 5.5 Shared club library and reuse behaviour

The club library is the discoverable collection of exercises and training sessions explicitly shared by members of the same club.

### Browse and discovery

- Separate Exercises and Training sessions, or provide clear filters between the two.
- Search and filter using relevant metadata.
- Show the creator and sharing status.
- Make it clear when content belongs to another coach.

### Two supported reuse actions

**Use directly**

- A coach can add a club-shared exercise directly to a session.
- The exercise remains owned by its original creator.
- The coach can set a session-specific duration and notes without changing the original.
- The session stores a snapshot of the exercise content and diagram.

**Duplicate into my library**

- A coach can create a separate copy of a shared exercise or session.
- The copy is owned by the coach who duplicated it.
- The coach can edit the copy without affecting the original.
- The copy should retain attribution to the original creator/source where practical (for example, "Based on an exercise by …").
- The duplicated content should default to Private, with the option to share it with the club.

### Original content protection

A user must never be able to alter another coach's original content through the ordinary edit flow. The UI and database permissions must both enforce this.

---

## 5.6 Club principles and coaching guidelines page

A dedicated **Club principles** page is an MVP requirement. It is a reference area for the club's principles and guidelines, interpreted here as information coaches should be able to consult while planning and delivering training.

### Coach experience

- Every active club member can access and read the page.
- Content should be organised into clear sections with headings.
- The page should work well on mobile and be easy to scan.
- Show when the content was last updated.

### Administrator experience

- Club administrators can create and edit the page content.
- Administrators can add, edit, reorder, and remove sections.
- Content may include the club's playing philosophy, coaching principles, age-group guidance, training expectations, terminology, and other club-specific guidelines.
- The MVP does not need a complex publishing workflow or approval system.

### Content ownership

The club supplies the actual principles and guidelines. The application should provide a clear place to maintain and read them; it should not invent club policy or provide AI-generated coaching guidance.

---

## 5.7 Dashboard and basic settings

### Dashboard

Keep the dashboard useful and simple. It may show:

- Quick actions: Create exercise and Create session.
- Recently edited exercises and sessions.
- Recently shared club content.
- A shortcut to Club principles.

Do not add analytics or recommendation systems in the MVP.

### Settings

- Basic account details.
- Sign out.
- Basic club name/details where relevant.
- Administrator-only member and invitation management.

---

## 6. Suggested data model

This is a starting schema proposal for implementation, not a requirement to use these exact names. Review it before generating migrations.

### `clubs`

- `id` — UUID primary key
- `name` — text
- `created_at` — timestamp

### `profiles`

- `id` — UUID, references `auth.users`
- `display_name` — text
- `created_at` — timestamp
- `updated_at` — timestamp

### `club_memberships`

- `id` — UUID primary key
- `club_id` — UUID, references `clubs`
- `user_id` — UUID, references `profiles`
- `role` — enum or constrained text: `coach`, `admin`
- `status` — e.g. `active`, `removed`
- `joined_at` — timestamp
- Unique constraint on `(club_id, user_id)`

### `club_invitations`

- `id` — UUID primary key
- `club_id` — UUID, references `clubs`
- `email` — text
- `role` — `coach` or `admin`
- `token_hash` — securely stored token hash, not the raw invitation token
- `status` — `pending`, `accepted`, `revoked`, `expired`
- `expires_at` — timestamp
- `invited_by` — UUID, references `profiles`
- `created_at` — timestamp
- `accepted_at` — nullable timestamp

### `exercises`

- `id` — UUID primary key
- `club_id` — UUID, references `clubs`
- `owner_id` — UUID, references `profiles`
- `name` — text
- `short_description` — text, nullable
- `objective` — text, nullable
- `setup` — text, nullable
- `instructions` — structured text or ordered content, depending on implementation
- `coaching_points` — structured text or ordered content, nullable
- `progressions` — structured text or ordered content, nullable
- `duration_minutes` — integer, nullable
- `player_count_min` — integer, nullable
- `player_count_max` — integer, nullable
- `equipment` — text array or related table
- `playing_area` — text, nullable
- `age_groups` — text array or related table
- `theme` — text or related taxonomy
- `visibility` — `private` or `club`
- `source_exercise_id` — nullable UUID for attribution when duplicated
- `diagram_document` — versioned JSON document, nullable until a diagram is added
- `created_at` — timestamp
- `updated_at` — timestamp

### `training_sessions`

- `id` — UUID primary key
- `club_id` — UUID, references `clubs`
- `owner_id` — UUID, references `profiles`
- `name` — text
- `description` — text, nullable
- `age_group` — text, nullable
- `main_theme` — text, nullable
- `planned_date` — date, nullable
- `visibility` — `private` or `club`
- `source_session_id` — nullable UUID for attribution when duplicated
- `created_at` — timestamp
- `updated_at` — timestamp

### `session_exercises`

- `id` — UUID primary key
- `session_id` — UUID, references `training_sessions`
- `source_exercise_id` — nullable UUID, references `exercises`
- `position` — integer
- `planned_duration_minutes` — integer, nullable
- `session_notes` — text, nullable
- `exercise_snapshot` — JSONB containing the exercise fields and diagram document as added to the session
- `created_at` — timestamp
- `updated_at` — timestamp

### `club_guideline_sections`

- `id` — UUID primary key
- `club_id` — UUID, references `clubs`
- `title` — text
- `content` — structured content or markdown, depending on editor choice
- `position` — integer
- `updated_by` — UUID, references `profiles`
- `updated_at` — timestamp

### Data model notes

- Every club-owned record must be scoped to a `club_id`.
- Use foreign keys and appropriate indexes.
- Use `owner_id` for ownership and `visibility` for private/club sharing.
- If a coach belongs to multiple clubs in a future release, the active club context must determine which club's shared content they can access.
- A duplicated record should be a new record with a new ID, owner, and optional source attribution.
- A session snapshot should be independent of later changes to the source exercise.
- Store diagram data as structured versioned JSON, not only as a rendered image.

---

## 7. Security and access-control requirements

Use Supabase Row Level Security (RLS) for all user-facing tables. Frontend visibility checks are not sufficient.

At a minimum:

- A user can read their own private exercises and sessions.
- A user can read club-shared exercises and sessions only when they are an active member of that same club.
- A user can create content only for a club they belong to.
- A coach can update or delete their own content.
- A coach cannot update or delete another coach's original content.
- An administrator can manage membership, invitations, guideline content, and perform explicitly defined moderation actions.
- Only active club members can read club guidelines.
- Only administrators can create or update club guidelines.
- Invitation acceptance must be validated securely on the server/Edge Function side, not trusted solely to frontend code.
- Never expose Supabase service-role or secret keys in browser code.

Before inviting real coaches, test permissions using at least two different coach accounts and one administrator account.

---

## 8. UX and visual design requirements

### General

- Mobile-first, responsive layouts.
- Clear typography and readable line lengths.
- Consistent buttons, forms, cards, dialogs, and navigation using the existing component system.
- Avoid dense screens and unnecessary decorative elements.
- Use plain, familiar language for coaches.
- Make saving, sharing, and ownership states obvious.
- Provide useful empty states, loading states, and error messages.

### Exercise comprehension

- Show the diagram prominently.
- Use consistent visual symbols in all diagrams.
- Keep instructions structured and scannable.
- Separate instructions from coaching points and progressions.
- Show the information needed to set up the exercise before optional detail.

### Pitch diagram accessibility

- Do not use colour alone to encode team identity or meaning.
- Maintain sufficient contrast.
- Use text labels or shapes where needed to clarify the diagram.
- Ensure diagrams scale to narrow screens.

---

## 9. Explicitly out of scope for MVP

These should not be implemented in the first release unless a critical pilot need emerges:

- AI-generated exercises, session plans, descriptions, or diagrams.
- Animated exercises, animation creation tools, or animation playback.
- Timeline/keyframe editors or playback controls.
- 3D or advanced tactical simulation.
- Comments, likes, ratings, and social feeds.
- Team calendars or scheduling workflows.
- Player registration, player profiles, attendance, or team management.
- Push notifications.
- Complex analytics or recommendation systems.
- Public searchable content outside the club.
- Multi-club user interface and switching between clubs (database should remain compatible with this later).
- Complex approval workflows for shared content.
- PDF export and advanced printing, unless needed after initial pilot feedback.

---

## 10. Future consideration: animated exercises

Animated exercises are **not part of the MVP**, but should be considered when designing the static diagram feature.

The future ambition is to support both:

1. **Creating animations:** Coaches can define movement over time, including player runs, ball movement, passes, and other actions.
2. **Viewing animations:** Other coaches can play, pause, and understand an animated exercise.

To avoid blocking this future work:

- Keep the diagram representation structured and versioned.
- Keep the pitch renderer separate from the exercise form and detail page.
- Avoid storing the diagram only as a bitmap or screenshot.
- Treat a static diagram as a single state/scene that could later become one state in a sequence.
- Do not build timeline or animation abstractions in the MVP unless they are needed to keep the static format extensible.

When animation becomes a real feature, define a separate specification for timeline, keyframes, playback controls, authoring tools, and data migration.

---

## 11. Suggested implementation milestones

### Milestone 1 — Foundation and access

- Confirm data model and RLS strategy.
- Set up Supabase migrations.
- Implement profiles and club memberships.
- Implement invitation creation, delivery, and acceptance.
- Implement sign-in and sign-out.
- Test coach and admin permissions.

**Completion check:** An invited coach can join the club and access only authorised club content.

### Milestone 2 — Exercise library

- Implement exercise creation and editing.
- Implement exercise detail view.
- Implement library listing, search, and filters.
- Implement private/shared visibility.
- Implement duplicate exercise.

**Completion check:** A coach can create an exercise, share it, and another coach can find and duplicate it without altering the original.

### Milestone 3 — Static diagram editor

- Implement pitch templates.
- Implement player, goalkeeper, ball, cone, goal, arrow, and label objects.
- Implement object positioning and basic editing.
- Save and reload structured diagram data.
- Render diagrams in exercise details.

**Completion check:** A coach can create, save, reopen, and view a clear static exercise diagram.

### Milestone 4 — Training sessions

- Implement session creation and editing.
- Add exercises from the user's own library and club library.
- Implement ordering, session-specific duration, and notes.
- Implement exercise snapshots.
- Implement session detail/viewing mode.
- Implement session sharing and duplication.

**Completion check:** A coach can build and share a session, and existing session content remains stable when the source exercise changes.

### Milestone 5 — Club library and principles

- Implement shared exercise and session discovery.
- Implement search and filtering.
- Implement the Club principles page.
- Implement administrator editing of guideline sections.
- Implement basic membership management.

**Completion check:** Coaches can find club resources and consult club guidelines; administrators can maintain the page and membership.

### Milestone 6 — Mobile refinement and pilot

- Test core screens on mobile and desktop.
- Refine diagram viewing and touch interactions.
- Test empty, loading, and error states.
- Test security with multiple accounts.
- Fix usability issues from a small coach pilot.

**Completion check:** A small group of coaches can use the app for real exercise and session planning without developer assistance.

---

## 12. Testing and acceptance checklist

### Accounts and membership

- [ ] An administrator can invite a coach by email.
- [ ] An invited person can accept the invitation and create or access an account.
- [ ] An invitation cannot be reused after acceptance.
- [ ] An expired or revoked invitation cannot grant access.
- [ ] A non-member cannot access club content by guessing a URL or API request.

### Exercises

- [ ] A coach can create, edit, and delete their own exercise.
- [ ] A coach can save an exercise with a static diagram.
- [ ] A saved diagram can be reopened and edited.
- [ ] A coach can search and filter exercises.
- [ ] A coach can share and unshare their own exercise.
- [ ] Another coach can view a shared exercise but cannot edit the original.
- [ ] Another coach can duplicate a shared exercise and edit the duplicate.

### Diagrams

- [ ] The editor supports the agreed MVP objects and arrows.
- [ ] Diagram objects remain positioned correctly after save and reload.
- [ ] Diagrams are readable on a phone.
- [ ] The diagram is not stored solely as a flattened image.

### Training sessions

- [ ] A coach can create, edit, and delete their own session.
- [ ] A coach can add private and club-shared exercises.
- [ ] A coach can reorder and remove exercises from a session.
- [ ] A coach can change planned duration without changing the library exercise.
- [ ] Total duration recalculates correctly.
- [ ] Session exercise snapshots preserve the content and diagram used when added.
- [ ] A coach can share and duplicate a session.

### Club library and guidelines

- [ ] Coaches can browse shared club exercises and sessions.
- [ ] Coaches can distinguish shared content from their own private content.
- [ ] Coaches can read the Club principles page.
- [ ] Only administrators can edit Club principles.
- [ ] Updated guideline sections display the latest content and update date.

### General quality

- [ ] Main workflows work on mobile and desktop.
- [ ] Loading, empty, and error states are handled.
- [ ] No AI-generation features are present in the product.
- [ ] No secret/service-role key is exposed in the frontend.

---

## 13. Decisions to confirm during implementation

These are implementation choices, not blockers to the product scope:

1. Whether diagram editing on mobile is included in the first pilot or whether mobile editing is simplified while mobile viewing is fully supported.
2. Whether exercise themes, equipment, and age groups use predefined club-managed lists or free-form values in the first release.
3. The exact rich-text format/editor for club principles and exercise instructions.
4. The exact email provider and Supabase invitation implementation.
5. Whether deleting a coach should preserve their shared content under an administrator or require reassignment. Do not silently delete club knowledge when a membership is removed.

---

## 14. First instruction for the AI coding agent

Before implementing features, ask the agent to:

1. Read this specification and the project's `PROJECT_RULES.md`.
2. Inspect the existing React/Vite/Supabase setup.
3. Identify gaps between the current project and the specification.
4. Propose the database schema, migration order, and Row Level Security policies.
5. Explain the invitation acceptance flow and how it will be secured.
6. Propose a versioned diagram JSON structure that supports static diagrams now and does not block animation later.
7. Propose an implementation plan split into small, testable milestones.

**Do not start implementing the full application in one pass.** Review and approve the database, access-control, invitation, and diagram architecture before asking the agent to build the first milestone.
