# Mobile dashboard components

Use this folder for **mobile-only** dashboard components so changes here
don't accidentally affect the desktop layout.

Suggested pattern for later:

- Create a `DashboardMobileShell.tsx` that renders the mobile navigation + layout.
- Keep `DashboardShell.tsx` focused on the desktop layout.
- In `src/app/dashboard/layout.tsx` (or a wrapper component), conditionally
  render the mobile or desktop shell using a client-side hook or
  Tailwind-based layout composition.

For now, the project still uses the original `DashboardShell.tsx` from `main`.
