# AI Sheet Builder – UI & Theme Rules

This document is for **developers and AI assistants** working on this repo.
Follow these rules when changing UI or styling.

---

## 1. General principles

- Default dashboard experience is **light theme**:
  - App background: light gray.
  - Cards/panels: white with subtle border and small shadow.
- Do **not** introduce brand new colors without a good reason.
- Prefer **reusing tokens** from `src/design-system/theme.ts`.

---

## 2. Colors

- Primary background:
  - `bg-slate-50` for app background (main workspace).
  - `bg-white` for cards and panels.
- Primary text:
  - `text-slate-900` for headings and main numbers.
  - `text-slate-600` / `text-slate-500` for secondary text and labels.
- Accent:
  - Use **emerald** for primary accents (buttons, highlights):
    - `text-emerald-600`, `bg-emerald-50`, `border-emerald-200`.
- Borders:
  - Use subtle borders only:
    - `border border-slate-200` for cards and panels.

**Do NOT:**

- Switch dashboard cards to `bg-slate-900` / dark mode by default.
- Add neon or saturated colors not aligned with this palette.

---

## 3. Components

### Cards

- Use `cardClasses.primary` from `src/design-system/theme.ts` for most dashboard cards.
- Structure:
  - Rounded corners: `rounded-2xl`.
  - Small shadow: `shadow-sm`.
  - Padding: `p-6`.

### Typography

- Card labels: use `textStyles.cardLabel`.
- Main metric numbers: use `textStyles.cardMetric`.
- Section headings (e.g. "Usage trend"): `text-sm font-medium text-slate-900`.

---

## 4. Charts (Recharts)

- Charts should sit inside light cards.
- Never force background colors inside Recharts; let the card set the bg.
- Donut chart interactions:
  - Hover should enlarge or highlight the hovered segment.
  - Clicking is optional, but should not be required to see state.
- Do not change chart color palette drastically without updating this doc.

---

## 5. Light vs Dark mode

- The **default** appearance we optimize for:
  - Light dashboard like the original design.
- If a dark mode theme exists:
  - Do NOT override global theme providers in per-page code.
  - Any dark-specific styles must still respect structure defined here.

---

## 6. Rules for AI assistants (Cursor, Claude, ChatGPT, etc.)

When modifying UI:

1. **First**, open `src/design-system/theme.ts` and reuse:
   - `cardClasses.*`
   - `textStyles.*`
   - `palette.*`
2. **Do not**:
   - Replace white dashboard cards with dark ones.
   - Introduce new random Tailwind color classes.
   - Change layout spacing or card shapes unless asked.
3. **If in doubt**:
   - Keep the layout and colors the same.
   - Only update the minimal code needed (e.g., add a button, change text).

This file is the source of truth. Any major visual change should update this doc.
