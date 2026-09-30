# JobTrack — UI Spec (Web & Mobile)

**Created:** 2026-09-20
**Visual reference:** https://claude.ai/artifact/Q2MEFhczGskm5LGge39SYW — 12 artboards, desktop + mobile, both phases
**Companions:** [PLAN.md](./PLAN.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

> The original mockup was **desktop only** (1440px). The project spec asks for a responsive UI.
> This file is the missing half: what every screen does below 768px, and why.

---

## 1. Breakpoints

Tailwind defaults. Only one of them actually matters.

| Name | Min width | What changes |
|---|---|---|
| *(base)* | 0 | **Mobile layout.** Bottom tab bar, card lists, full-screen sheets |
| `sm:` | 640px | Larger phones — minor padding only |
| `md:` | **768px** | **The real switch.** Sidebar appears, cards become a table |
| `lg:` | 1024px | Dashboard charts sit side by side |
| `xl:` | 1280px | Content caps at `max-w-7xl` |

Design targets: **390px** (iPhone 14/15) and **1440px** (the mockup's canvas).

**Build mobile-first.** Write the base styles for 390px, then add `md:` overrides. Going the
other way means fighting your own CSS — you end up writing `md:flex-row` *and* `flex-col`
everywhere instead of just `flex-col md:flex-row`.

---

## 2. The three structural swaps

Everything else is padding. These three are real layout changes.

### Swap 1 — Sidebar → bottom tab bar

| | Desktop (`md:` and up) | Mobile |
|---|---|---|
| Position | Fixed left, 240px | Fixed bottom, 68px tall |
| Items | Dashboard, Applications, Kanban, Profile, + Settings/Logout at the base | **Four maximum** |
| Active state | Blue pill background `bg-blue-50 text-blue-700` | Blue icon + label, no pill |

Four is not a style preference: at a 44px minimum touch target, a 390px screen fits four
comfortable items and no more. Settings and Logout move inside the Profile screen.

### Swap 2 — Data table → card list

A six-column table cannot shrink to 390px. Don't try — no amount of horizontal scrolling
makes it usable.

```
DESKTOP  │ Company │ Position │ Status │ Location │ Applied On │ Actions │
         └─────────┴──────────┴────────┴──────────┴────────────┴─────────┘

MOBILE   ┌──────────────────────────────────────┐
         │ [G]  Google              [Interview] │   ← logo, company, status
         │      SDE                             │   ← role
         │ ──────────────────────────────────── │
         │ Bangalore    Sep 12, 2025        ••• │   ← meta + actions
         └──────────────────────────────────────┘
```

Same data, same API response. Only the component changes.

### Swap 3 — Centred modal → full-screen sheet

| | Desktop | Mobile |
|---|---|---|
| Size | 680px wide, centred, dark scrim | Full screen |
| Dismiss | X button, scrim click, Esc | X at top-left |
| Submit | Footer buttons, bottom-right | **Save in the top-right header** |
| Fields | 2-column grid | Single column |

---

## 3. Touch and input rules

Non-negotiable on mobile:

| Rule | Value | Why |
|---|---|---|
| Touch target | **≥44×44px** | Below that, taps miss |
| Input height | **48px** | Comfortable thumb target |
| Input font size | **≥16px** | **Under 16px, iOS Safari zooms the page on focus.** The single most common mobile form bug |
| Bottom padding on scroll areas | ~88px | Otherwise the tab bar covers the last row |

That 16px rule catches everyone once. Your input looks fine at `text-sm`, then a real iPhone
zooms in the moment a field is tapped and the user has to pinch back out on every field.

---

## 4. Screen-by-screen

### PHASE 1

#### Applications list
| | Desktop | Mobile |
|---|---|---|
| Shell | 240px sidebar + 64px header | 56px header + 68px bottom tabs |
| Body | Table, 6 columns | Card list |
| Add button | Top-right, in the page header | **Floating action button**, above the tab bar |
| Row actions | Edit + Delete icon buttons in the row | `•••` menu on the card |

Phase 1 has **no filter bar and no pagination** — they arrive in Phase 2. Show a plain
`6 applications` count at the foot of the table.

#### Add / Edit form
Desktop: 2-column grid inside a 680px modal. Mobile: full-screen sheet, one column, `Save`
in the header.

Draw the **error band** now (red, above the footer). It renders the field errors your Zod
schema returns. Designing it at the same time as the happy path costs ten minutes; retrofitting
it at 1am costs an hour.

#### Application details
| | Desktop | Mobile |
|---|---|---|
| Header | Back link left, Edit/Delete right | Back arrow, icon buttons in the header |
| Company block | Horizontal — logo, name, meta, status right | Centred, stacked |
| Info rows | `170px` label column + value | Label left, **value right-aligned** |
| Tabs | Underline style | Segmented pill control |

Overview tab only. Timeline and Notes are visible but disabled, tagged `P2` — that's honest
about scope and stops you half-building them.

### PHASE 2

#### Sign in
Desktop: 620px brand panel left (`bg-blue-50`), form right, 400px wide.
Mobile: brand block collapses to a short header, form fills the rest. Same fields, no sidebar.

#### Dashboard
| | Desktop | Mobile |
|---|---|---|
| KPI cards | 4 across | **2×2 grid** |
| Trend line chart | Full width | **Dropped entirely** |
| Status donut | Beside the trend chart | Full width, legend to the right of the donut |
| Recent applications | Table | Compact card rows |

**Drop the trend chart on mobile.** Six months of data in 350px is unreadable — the axis
labels collide and the line becomes noise. The KPI cards and the donut carry the same
information. Removing a chart is a legitimate responsive decision, not a cop-out.

#### Applications list — Phase 2 additions
Filter bar (Status, Location, Job Type) sits inline on desktop. On mobile it becomes
**horizontally scrolling chips** or a filter sheet — a row of three `<select>`s at 390px is
unusable.

Pagination: numbered pages on desktop; `Prev / 1 of 5 / Next` on mobile.

#### Kanban — the hard one
Six columns cannot be shown at once on a phone, and HTML5 drag-and-drop **fights the browser's
native scroll** on touch — you get a board that neither scrolls nor drags cleanly.

| | Desktop | Mobile |
|---|---|---|
| Columns | 6 visible, grid | Horizontal scroll with `scroll-snap`, ~1.4 columns visible |
| Position indicator | none | Progress bar above the board |
| Change status | Drag and drop | **A "Move to…" button on each card** |

Keep drag-and-drop desktop-only. This is a large part of why Kanban is the last thing you build.

#### Profile / Settings
Desktop: settings sub-nav on the left, panel right. Mobile: the sub-nav becomes a stacked list
that pushes to a sub-page. Profile tab only; Notifications and Security stay disabled.

---

## 5. Component responsive behaviour

| Component | Desktop | Mobile |
|---|---|---|
| `Sidebar` | 240px fixed left | hidden — replaced by `BottomNav` |
| `BottomNav` | hidden | fixed bottom, 4 items |
| `Header` | 64px, search + avatar | 56px, logo + avatar |
| `KpiCard` | 4-col grid | 2-col grid, smaller numerals |
| `FilterBar` | inline row | scrolling chips / sheet |
| `DataTable` | `<table>` semantics | renders `ApplicationCard` list |
| `Modal` | centred, 680px | full-screen sheet |
| `StatusBadge` | 12px | 11px — identical otherwise |
| `Timeline` | right column, 340px | below the info panel, full width |
| `Pagination` | numbered | Prev / Next |

`DataTable` doing two completely different things at two sizes is fine and normal. Render both
and toggle with `hidden md:block` / `md:hidden` — **do not** try to make one DOM structure
work at both sizes with CSS alone.

---

## 6. Colour and type

Unchanged from [ARCHITECTURE.md](./ARCHITECTURE.md) §8 — stock Tailwind, Inter, 8px spacing,
`rounded-xl`. One addition the mockup didn't define:

| Status | Badge classes | Kanban accent |
|---|---|---|
| Applied | `bg-blue-50 text-blue-700` | `#3B82F6` |
| Shortlisted | `bg-emerald-50 text-emerald-700` | `#10B981` |
| Interview | `bg-amber-50 text-amber-700` | `#F59E0B` |
| Offer | `bg-indigo-50 text-indigo-700` | `#6366F1` |
| Rejected | `bg-red-50 text-red-700` | `#EF4444` |
| **Withdrawn** | `bg-gray-100 text-gray-700` | `#6B7280` |

`Withdrawn` and the indigo for `Offer` are new — the mockup had neither. Offer was originally
the same green as Shortlisted, which made the donut ambiguous.

**Company logos:** coloured rounded square with the first letter, brand colour as background.
No uploads, no external logo service, no schema field. Works offline and never 404s.

---

## 7. Mock-data note

The original mockup's numbers don't reconcile: the KPI card said `Rejected 12` while the donut
directly below said `Rejected 5`, and the Kanban showed `Shortlisted 9` against the donut's `7`.

These artboards use **one consistent set**: Applied 20, Shortlisted 7, Interview 8, Offer 2,
Rejected 5, Withdrawn 1 — total 42 (the Withdrawn row is extra, so the donut still sums to 42
across the original five). Don't treat placeholder numbers in a mockup as business rules.

---

## 8. Build order for the UI

1. Design tokens + `StatusBadge` — smallest piece, used everywhere
2. App shell — `Sidebar` + `Header` + `BottomNav`, responsive from the start
3. `DataTable` **and** `ApplicationCard` together — they're one feature
4. `Modal` + `ApplicationForm` — including the error band
5. Details page
6. *(Phase 2)* everything else

Do the responsive work **as you build each component**, not as a pass at the end. A "make it
responsive" phase means rewriting every component you already wrote.
