# JobTrack — Architecture

**Created:** 2026-09-20
**Companion doc:** [PLAN.md](./PLAN.md)

> This is the reference. When you're unsure what a file is for, what an endpoint returns,
> or which colour a badge uses — look here, not at the mockup.

---

## 1. System overview

Next.js is doing two jobs at once here: it serves the UI **and** it is the backend.
There is no separate API server.

```
Browser
  │
  ├── page request ─────────► Next.js  ──► React Server Component ──┐
  │                           (App Router)                          │
  └── fetch /api/... ───────► Route Handler ────────────────────────┤
                              (app/api/**/route.ts)                 │
                                                                    ▼
                                                        Zod  (validate input)
                                                                    │
                                                                    ▼
                                                        Prisma Client (ORM)
                                                                    │
                                                                    ▼
                                                        MySQL 8.4 (localhost:3306)
```

**Request lifecycle for a write:**
`Client form → fetch → Route Handler → Zod parse → auth check (Phase 2) → Prisma → MySQL → JSON response → UI revalidates`

**Two ways to read data — know which you're using:**

| | Server Component | Route Handler + client fetch |
|---|---|---|
| Calls Prisma | directly | via `/api/...` |
| Runs | on the server, at render | in the browser |
| Use for | first paint of a list or detail page | anything interactive — filters, pagination, modals |

---

## 2. Tech stack

Versions verified against npm on **2026-09-20**. Re-check before Phase 2.

### Phase 1 — install now

| Layer | Package | Version | Notes |
|---|---|---|---|
| Framework | `next` | **16.3.5** | App Router. `params` is an **async Promise** |
| UI runtime | `react` / `react-dom` | **19.3.0** | |
| Language | `typescript` | **7.x** | strict mode on |
| Styling | `tailwindcss` | **4.3.3** | v4 = CSS-first config (`@theme` in CSS, no `tailwind.config.js`) |
| Font | `next/font` → Inter | built in | no package needed |
| Backend | Next.js Route Handlers | built in | no separate server |
| ORM — CLI | `prisma` | **7.10.0** ⚠️ | **must pin — see below** |
| ORM — client | `@prisma/client` | **7.10.0** | generates into `src/generated/prisma` |
| Database | MySQL | **8.4.11 LTS** | Homebrew `mysql@8.4` — *not* bare `mysql`, which is now v26 |
| Validation | `zod` | **4.6.5** | |
| Seeding | `tsx` | **4.23.15** | dev dep, runs `prisma/seed.ts` |

### ⚠️ The Prisma version trap

As of 2026-09-20 the two Prisma packages have **different `latest` tags**:

```
prisma          latest → 8.0.0-rc.15   ← a RELEASE CANDIDATE
@prisma/client  latest → 7.10.0        ← stable
```

So the obvious command installs a mismatched pair:

```bash
npm i -D prisma          # → v8 release candidate
npm i @prisma/client     # → v7 stable
```

A mismatched CLI and client produce confusing generate/migrate failures. **Pin both:**

```bash
npm i -D prisma@7
npm i @prisma/client@7
```

Verify with `npx prisma -v` — CLI and client must both report 7.x. Upgrade to 8 only once
`prisma` and `@prisma/client` agree on a stable `latest`.

### Phase 2 — install later

| Layer | Package | Version | Notes |
|---|---|---|---|
| Auth | `next-auth@beta` | **5.0.0-beta.32** | Auth.js v5. `latest` is still v4 (4.24.15) — **do not use it** |
| Hashing | `bcryptjs` | **3.0.3** | pure JS, no native build step |
| Charts | `recharts` | **3.10.1** | trend line + status donut |
| Drag & drop | `@dnd-kit/core` | **6.3.1** | Kanban — stretch only |
| Deploy | Vercel + hosted MySQL | — | PlanetScale / Railway / Aiven |

**Why `next-auth@beta` and not `latest`:** npm's `latest` tag points at v4, which predates the
App Router. v5 (Auth.js) is App-Router-native — one `auth()` helper for server components,
route handlers and middleware, instead of v4's three different APIs. v5 has been in beta a
long time and is what current docs assume. Re-verify the tag when you reach step 2.3.

---

## 3. Folder structure

```
jobtrack/
├── docs/
│   ├── PLAN.md
│   └── ARCHITECTURE.md
├── prisma/                             # stays at root, NOT in src/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── prisma7.config.ts                   # Prisma 7: holds DATABASE_URL, loads dotenv
├── src/
│   ├── app/
│   │   ├── layout.tsx              # root: font, <html>, providers
│   │   ├── page.tsx                # → redirect to /dashboard
│   │   │
│   │   ├── (auth)/                 # Phase 2 — no sidebar
│   │   │   ├── login/page.tsx      # screen 1
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── (app)/                  # sidebar + header shell
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx  # screen 2   — Phase 2
│   │   │   ├── applications/
│   │   │   │   ├── page.tsx        # screen 3
│   │   │   │   └── [id]/page.tsx   # screen 5
│   │   │   ├── kanban/page.tsx     # screen 6   — Phase 2 stretch
│   │   │   └── settings/page.tsx   # screen 7   — Phase 2
│   │   │
│   │   └── api/
│   │       ├── applications/
│   │       │   ├── route.ts        # GET list, POST create
│   │       │   └── [id]/route.ts   # GET, PUT, DELETE
│   │       ├── stats/route.ts      # dashboard aggregates — Phase 2
│   │       └── auth/
│   │           ├── register/route.ts
│   │           └── [...nextauth]/route.ts
│   │
│   ├── components/
│   │   ├── layout/                 # Sidebar, Header
│   │   ├── ui/                     # StatusBadge, Modal, Pagination, DataTable, KpiCard
│   │   └── applications/           # ApplicationForm, ApplicationsTable, FilterBar, Timeline
│   │
│   ├── generated/prisma/           # GENERATED by `prisma generate` — gitignored, never edit
│   ├── lib/
│   │   ├── prisma.ts               # singleton client
│   │   ├── validations.ts          # Zod schemas
│   │   ├── auth.ts                 # Auth.js config — Phase 2
│   │   └── utils.ts                # formatDate, formatSalary, cn
│   │
│   ├── types/
│   └── middleware.ts               # route protection — Phase 2
│
├── .env                            # gitignored
├── .env.example
└── package.json
```

**`src/` note:** `prisma/` stays at the **project root**, not inside `src/` — Prisma's CLI looks for it there by default. `middleware.ts` must sit **inside `src/`** when you use a `src/` directory; at the root it is silently ignored and your Phase 2 route protection will do nothing.

**Import alias:** `create-next-app` will set `@/*` → `./src/*`. Use `@/lib/prisma`, never `../../../lib/prisma`.

**Route groups:** `(auth)` and `(app)` are parenthesised, so they **don't appear in the URL**. They exist purely so the two groups can have different layouts — login has no sidebar, everything else does.

---

## 4. Data model

### 4.1 Phase 1 — one table

> **Prisma 7 note (verified on the real install, 2026-09-20):** most tutorials online are
> written for Prisma 5/6 and will not match what you have. Three real differences:
>
> | | Old tutorials (Prisma 5/6) | **Prisma 7, what you actually have** |
> |---|---|---|
> | Generator | `provider = "prisma-client-js"` | `provider = "prisma-client"` + an `output` path |
> | Where the client lands | `node_modules/@prisma/client` | **`src/generated/prisma`** (already gitignored) |
> | Connection URL | `url = env("DATABASE_URL")` inside `datasource` | **`prisma7.config.ts`** at the project root |
> | Import in your code | `from '@prisma/client'` | **`from '@/generated/prisma'`** |
>
> If a tutorial tells you to put `url = env("DATABASE_URL")` in the schema, it is out of date.
> Your `datasource` block only names the provider.
>
> **Fourth difference — a driver adapter is now REQUIRED.** `new PrismaClient()` with no
> arguments throws `A driver adapter is required to connect to your database`. For MySQL the
> adapter is **`@prisma/adapter-mariadb`** (yes, MariaDB — it is Prisma's MySQL driver):
>
> ```ts
> const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
> const prisma = new PrismaClient({ adapter })
> ```
>
> Note `prisma migrate` works **without** the adapter — it uses Prisma's own engine. So the
> schema and migrations can be perfect while the runtime client still cannot connect.

> ### ⚠️ Use `127.0.0.1`, never `localhost`, in DATABASE_URL
>
> Homebrew MySQL listens on **IPv4 only** (`127.0.0.1:3306`). Node resolves `localhost` to
> **`::1` (IPv6) first**, where nothing is listening. The result is a 10-second hang and:
>
> ```
> pool timeout: failed to retrieve a connection from pool after 10001ms
>     (pool connections: active=0 idle=0 limit=10)
> ```
>
> It looks like a pool or credentials problem. It is neither — it is the wrong IP family.
> `mysql` on the command line hides this because it uses a unix socket for `localhost`.
>
> ```
> mysql://root:pw@localhost:3306/jobtrack   ❌ hangs then times out
> mysql://root:pw@127.0.0.1:3306/jobtrack   ✅
> ```

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
  // no `url` here in Prisma 7 — it comes from prisma7.config.ts
}

enum ApplicationStatus {
  APPLIED
  SHORTLISTED
  INTERVIEW
  OFFER
  REJECTED
  WITHDRAWN        // ← decide: keep, or match the mockup's 5?
}

enum JobType {
  FULL_TIME
  PART_TIME
  INTERNSHIP
  CONTRACT
  FREELANCE
}

model Application {
  id              Int               @id @default(autoincrement())
  companyName     String
  jobTitle        String
  location        String
  jobType         JobType
  status          ApplicationStatus @default(APPLIED)
  applicationDate DateTime
  salary          Int?
  jobUrl          String?           @db.Text
  notes           String?           @db.Text
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([status])
  @@index([applicationDate])
}
```

### 4.2 Phase 2 — users and history

```prisma
model User {
  id           Int           @id @default(autoincrement())
  name         String
  email        String        @unique
  password     String                          // bcrypt hash — never plaintext
  bio          String?       @db.Text
  image        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  applications Application[]
}

model StatusHistory {
  id            Int               @id @default(autoincrement())
  applicationId Int
  status        ApplicationStatus
  changedAt     DateTime          @default(now())
  note          String?           @db.Text

  application   Application       @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@index([applicationId])
}
```

…plus, added to `Application`:

```prisma
  userId  Int
  user    User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  history StatusHistory[]

  @@index([userId, status])
  @@index([userId, applicationDate])
```

### 4.3 Relationships

```
User (1) ──────< (many) Application (1) ──────< (many) StatusHistory
```

- One user has many applications. `Application.userId` is the foreign key.
- One application has many status-history rows.
- `onDelete: Cascade` on both — deleting a user removes their applications; deleting an application removes its history. No orphans.

### 4.4 Why `StatusHistory` exists

Screen 5's Timeline shows *dated* transitions:

```
● Applied      Sep 12, 2025
● Shortlisted  Sep 18, 2025
○ Interview    Pending
○ Offer        —
```

A single `status` column stores only *where the application is now*. It cannot answer *when it got there* or *where it has been*. Every status change writes a `StatusHistory` row **inside a transaction** with the `Application` update — both succeed or both roll back.

`Application.status` stays as the denormalised current value so list queries and filters don't need a join. That's a deliberate trade: a little duplication for much simpler reads.

### 4.5 Field decisions to make

**DECIDED 2026-09-20:**

| Field | Chosen | Rationale / consequence |
|---|---|---|
| `id` | **`Int @default(autoincrement())`** | Simplest to type by hand while testing. ⚠️ Consequence: URL params arrive as **strings** — every route handler must `Number()`-parse and reject `NaN` with a `400`. See §5. |
| `salary` | **`Int?`** | Whole rupees. Never `Float` for money. |
| `status` | **6 values, `WITHDRAWN` kept** | Needs a 6th badge style and a 6th Kanban column — neither is in the mockup, so you design them. |
| `applicationDate` | `DateTime` | Must be sortable and range-queryable for the dashboard. |
| `location` | free text | The mockup mixes cities and "Remote"; an enum would fight you. |

**MySQL gotcha:** Prisma maps `String` → `VARCHAR(191)`. `notes` and `jobUrl` need `@db.Text` or long values will be rejected.

---

## 5. API contract

Base: `/api`. All request and response bodies are JSON.

| Method | Endpoint | Body | Success | Errors |
|---|---|---|---|---|
| `GET` | `/applications` | — | `200` `{ data, meta }` | `401` |
| `POST` | `/applications` | `CreateApplication` | `201` `{ data }` | `400`, `401` |
| `GET` | `/applications/:id` | — | `200` `{ data }` | `401`, `404` |
| `PUT` | `/applications/:id` | `UpdateApplication` | `200` `{ data }` | `400`, `401`, `404` |
| `DELETE` | `/applications/:id` | — | `204` no body | `401`, `404` |
| `GET` | `/stats` | — | `200` `{ data }` | `401` — *Phase 2* |
| `POST` | `/auth/register` | `{ name, email, password }` | `201` | `400`, `409` — *Phase 2* |

### Query params on `GET /applications` — Phase 2

| Param | Example | Notes |
|---|---|---|
| `search` | `google` | matches company **or** job title |
| `status` | `INTERVIEW` | |
| `jobType` | `FULL_TIME` | |
| `location` | `Bangalore` | |
| `sort` | `applicationDate` | whitelist the allowed columns |
| `order` | `asc` \| `desc` | |
| `page` | `1` | 1-based |
| `limit` | `10` | cap it — never let a client request 100000 |

### Response shapes

```jsonc
// list
{
  "data": [ /* … */ ],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}

// single
{ "data": { "id": 1, "companyName": "Google" } }

// error — one shape, everywhere
{
  "error": {
    "message": "Validation failed",
    "fields": { "companyName": "Company name is required" }
  }
}
```

### ⚠️ Integer ids — the parsing rule

Because `id` is an `Int`, `params.id` arrives as the **string** `"1"`, but Prisma expects a
number. Every `[id]` route handler starts the same way:

```
await params  →  Number(id)  →  Number.isInteger()? no → 400  →  Prisma findFirst → null? → 404
```

Skip the `NaN` guard and `/api/applications/abc` throws a `500` instead of returning `400`.

### Status codes — use them properly

| Code | When |
|---|---|
| `200` | read or update succeeded |
| `201` | created — return the new record |
| `204` | deleted — no body |
| `400` | the client's input is malformed or fails Zod |
| `401` | not logged in |
| `404` | doesn't exist, **or exists but isn't yours** |
| `409` | conflict — e.g. email already registered |
| `500` | your bug. Log it; never leak the stack trace |

> **Why `404` and not `403` for someone else's record:** `403` confirms the record exists. `404` reveals nothing. Treat "not yours" and "not there" identically.

---

## 6. Authorization model — Phase 2

Every query is scoped to the session user. There is no such thing as "fetch by id" alone:

```
❌ prisma.application.findUnique({ where: { id } })
✅ prisma.application.findFirst({ where: { id, userId: session.user.id } })
```

Three layers, all required:

1. **Middleware** — blocks unauthenticated page navigation. *UX, not security.*
2. **Route handler** — reads the session, returns `401` if absent.
3. **Query** — every `where` includes `userId`. **This is the one that actually protects data.**

Layer 3 is non-negotiable. Layers 1 and 2 are both bypassable with curl.

**Password handling:** bcrypt hash on register, `bcrypt.compare` on login. Never store, log, or return the plaintext. Never send the hash to the client either.

---

## 7. Component inventory

Mapped from the mockup's "Reusable Frontend Components" strip.

| # | Component | Location | Props (sketch) | Phase |
|---|---|---|---|---|
| 1 | `Sidebar` | `layout/` | active route | 1 |
| 2 | `Header` | `layout/` | search, user | 1 |
| 3 | `KpiCard` | `ui/` | `label, value, delta, icon, tone` | 2 |
| 4 | `FilterBar` | `applications/` | status, location, jobType, onChange | 2 |
| 5 | `DataTable` | `ui/` | `columns, rows, onRowClick` | 1 |
| 6 | `Modal` | `ui/` | `open, onClose, title, children` | 1 |
| 7 | `StatusBadge` | `ui/` | `status` | 1 |
| 8 | `Timeline` | `applications/` | `history[]` | 2 |
| 9 | `Pagination` | `ui/` | `page, totalPages, onChange` | 2 |

Plus: `ApplicationForm` (create **and** edit — one component, not two), `EmptyState`, `ConfirmDialog`.

**Rule:** build a component when you need it the second time, not speculatively. `DataTable` is the exception — the mockup uses it on three screens, so generalise it from the start.

---

## 8. Design tokens

From the mockup's "Design Specs" and "Color Palette & Typography" panels.

### Colours — all stock Tailwind, no config needed

| Role | Hex | Tailwind | Used for |
|---|---|---|---|
| Primary | `#3B82F6` | `blue-500` | buttons, links, active nav, Applied badge |
| Success | `#10B981` | `emerald-500` | Offer badge, positive deltas |
| Warning | `#F59E0B` | `amber-500` | Interview badge |
| Danger | `#EF4444` | `red-500` | Rejected badge, delete |
| Grey | `#6B7280` | `gray-500` | secondary text, borders |

### Status badge mapping

| Status | Background / Text |
|---|---|
| Applied | `bg-blue-50 text-blue-700` |
| Shortlisted | `bg-emerald-50 text-emerald-700` |
| Interview | `bg-amber-50 text-amber-700` |
| Offer | `bg-emerald-100 text-emerald-800` |
| Rejected | `bg-red-50 text-red-700` |
| Withdrawn | `bg-gray-100 text-gray-700` *(if kept)* |

### Typography — Inter

| Token | Size | Weight | Tailwind |
|---|---|---|---|
| H1 | 24px | Semibold | `text-2xl font-semibold` |
| H2 | 20px | Semibold | `text-xl font-semibold` |
| H3 | 16px | Semibold | `text-base font-semibold` |
| Body | 14px | Regular | `text-sm` |
| Small | 12px | Regular | `text-xs` |

### Layout

- Desktop-first, 1440px canvas
- 8px spacing system → use even Tailwind steps (`p-2`, `p-4`, `p-6`, `p-8`)
- Radius 12px → `rounded-xl`
- Sidebar ~220px fixed; content fluid with `max-w-7xl`
- Cards: white, `border border-gray-200`, `rounded-xl`, subtle shadow

---

## 9. Screen → route → API map

| # | Screen | Route | Reads | Writes |
|---|---|---|---|---|
| 1 | Login | `/login` | — | Auth.js `signIn` |
| 1b | Register | `/register` | — | `POST /api/auth/register` |
| 2 | Dashboard | `/dashboard` | `GET /api/stats`, `GET /api/applications?limit=5` | — |
| 3 | Applications List | `/applications` | `GET /api/applications?…` | `POST`, `DELETE` |
| 4 | Add/Edit Modal | *(overlay)* | `GET /api/applications/:id` | `POST`, `PUT` |
| 5 | Details | `/applications/:id` | `GET /api/applications/:id` | `PUT`, `DELETE` |
| 6 | Kanban | `/kanban` | `GET /api/applications?limit=200` | `PUT` (status only) |
| 7 | Settings | `/settings` | session | `PUT /api/profile` |

---

## 10. Conventions

- **Naming:** components `PascalCase.tsx`; everything else `kebab-case.ts`; DB columns `camelCase` (Prisma default).
- **Env vars:** `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`. `.env` is gitignored; `.env.example` is committed with empty values.
- **Errors:** never `console.log` an error and return `200`. One error shape, always.
- **Dates:** store UTC, format at render. Display format `Sep 12, 2025`; input format `dd-mm-yyyy` per the mockup.
- **Every list needs four states:** loading, empty, error, and populated. The mockup only draws the fourth — you design the other three.
- **Migrations are append-only.** Never hand-edit a migration that has run. Make a new one.

---

## 11. Decision log

| # | Decision | Rationale |
|---|---|---|
| 1 | Next.js Route Handlers, no separate backend | One deploy, one repo; the spec asks for it |
| 2 | MySQL 8.4 LTS native via Homebrew *(revised 2026-09-20)* | Docker deferred to later. Pinned to 8.4 because bare `brew install mysql` is now v26, outside Prisma's tested range. `prisma migrate reset` replaces the container-rebuild reset |
| 3 | Phase 1 ships with **no** `User` table | Avoids debugging two unfamiliar systems at once; the Phase 2 migration is a deliberate lesson |
| 4 | `StatusHistory` added in Phase 2 | The Timeline UI is impossible without it |
| 5 | `Application.status` kept alongside history | Denormalised for cheap list filtering |
| 6 | Stock Tailwind palette, no theme config | The mockup's hexes already *are* Tailwind defaults |
| 7 | Calendar + Interviews tab cut | Designed in the nav but never specified or drawn |
| 8 | Kanban deferred to the end | Highest effort, lowest learning-per-hour |
| 9 | `404` not `403` for other users' records | Doesn't confirm existence |
| 10 | URL search params drive list state | Shareable, survives refresh, back/forward works |
| 11 | `src/` directory | Matches Harshit's existing repo conventions. `prisma/` stays at root; `middleware.ts` moves inside `src/` |
| 12 | `Int` autoincrement ids *(decided 2026-09-20)* | Simplest to work with by hand. Requires `Number()` parsing + `NaN` guard in every `[id]` route |
| 13 | `WITHDRAWN` status kept *(decided 2026-09-20)* | Spec wins over mockup; you design the missing badge + column |
| 14 | `salary` as `Int?` *(decided 2026-09-20)* | Whole rupees, no float arithmetic on money |
