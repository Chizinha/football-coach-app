# Project Rules

## Project
A mobile-first web application for football coaches
to plan training sessions and share exercises
with other coaches within their club.

## Technology
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL

## General principles
- Keep the application simple and maintainable.
- Prioritise mobile-first design for viewing and desktop for creating.
- Reuse existing components.
- Avoid unnecessary dependencies.
- Use TypeScript properly.
- Follow consistent naming conventions.
- Keep business logic separate from UI components.

## Database and security
- Use Supabase PostgreSQL.
- Use Row Level Security.
- Never expose secret or service-role keys.
- All club data must respect membership permissions.
- Do not create database tables or policies
  without first proposing the architecture.

## Development workflow
- Plan substantial features before implementing.
- Work in small, logical steps.
- Explain significant architectural decisions.
- Test changes before finishing.
- Run the production build after substantial changes.
- Never overwrite or delete existing functionality
  without explaining why.