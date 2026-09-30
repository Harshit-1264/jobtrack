# JobTrack — Build Plan

**Owner:** Harshit Kumar Mishra
**Created:** 2026-09-20
**Sources:** `Job_Application_Tracker_Project_Specification.docx` + JobTrack UI mockup (7 screens)
**Companion doc:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 0. How we work

This is a learning project. **Harshit writes all the code.** Claude's role is teacher and reviewer only.

| Rule | Detail |
|---|---|
| No handed-over code | Explanations, reviews, and pointing at the wrong line — not finished files |
| 15-minute rule | Stuck for 15 min → bring the error text + what you already tried |
| Checkpoint quizzes | At each checkpoint, explain what you built. Can't explain it → go back |
| One step at a time | Don't start step N+1 until step N's checkpoint passes |
| API before UI | Every endpoint is tested with curl/Postman before a component consumes it |

---

## 1. Starting point

Already fluent (from Fixxly, il-website-next, mekya-b2c-web): **Next.js App Router, React 19, TypeScript, Tailwind**. Move fast on UI.

New territory — slow down here:
- Route Handlers as a *backend* (writing APIs, not consuming them)
- Prisma: schema, migrations, relations, query API
- MySQL and relational modelling
- Auth.js, password hashing, sessions, authorization

### Environment
- Node v24.20.0 ✅
- npm 11.19.0 ✅
- Docker 29.7.2 ✅
- Homebrew 6.0.22 ✅
- MySQL ❌ not installed — **installing natively via Homebrew** *(decided 2026-09-20: no Docker in Phase 1)*

### ⚠️ Install `mysql@8.4`, NOT `mysql`

```bash
brew install mysql@8.4        # ✅ 8.4.11 LTS
# brew install mysql          # ❌ would install 26.7.0
```

Bare `mysql` on Homebrew now resolves to **MySQL 26.7.0**. Prisma 7 is tested against the
5.7 / 8.0 / 8.4 line — MySQL 26 is far outside it. Any weirdness you hit would be
unsearchable and indistinguishable from your own bugs. Use the 8.4 LTS.

### Setup, in order

```bash
# 1. install
brew install mysql@8.4

# 2. it is keg-only (not symlinked), so add it to PATH
echo 'export PATH="/opt/homebrew/opt/mysql@8.4/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
mysql --version               # must print 8.4.x

# 3. start it (and restart at login)
brew services start mysql@8.4

# 4. set a root password — it installs with NO password
mysql_secure_installation

# 5. create the database
mysql -u root -p
```
```sql
CREATE DATABASE jobtrack;
SHOW DATABASES;
EXIT;
```

### Connection string

```
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/jobtrack"
```

**⚠️ URL-encode special characters in the password.** `@` → `%40`, `#` → `%23`, `/` → `%2F`,
`:` → `%3A`. An unencoded `@` splits the URL in the wrong place and Prisma reports a host it
cannot resolve — an error that points nowhere near the real cause. Easiest fix: use a password
with letters, digits, `-` and `_` only.

### Day-to-day

| Task | Command |
|---|---|
| Start | `brew services start mysql@8.4` |
| Stop | `brew services stop mysql@8.4` |
| Status | `brew services list` |
| Shell | `mysql -u root -p` |
| Browse data | `npx prisma studio` |
| **Reset everything** | `npx prisma migrate reset` |

`brew services start` means MySQL runs at every login from now on. `brew services stop` if you
want it off. **`npx prisma migrate reset`** is your undo button — it drops, recreates, re-migrates
and re-seeds. Use it freely in Phase 1; it is how you get the clean slate Docker would have given you.

**If `brew services start` fails:** a stray `/etc/my.cnf` from an old install can break startup.
Check for it and rename it. Logs are at `/opt/homebrew/var/mysql/$(hostname).err`.

> **Docker later:** the `mysql:8` container stays the right answer when you want a throwaway
> database or to match a teammate's version exactly. Nothing in this project depends on which
> you pick — only `DATABASE_URL` changes.

---

## 2. Scope decisions

The spec lists 5 phases and the mockup shows 7 screens. Collapsed into **2 phases**.

### In scope

| # | Screen (from mockup) | Phase |
|---|---|---|
| 3 | Applications List | 1 (basic) → 2 (filters, search, pagination) |
| 4 | Add / Edit Application Modal | 1 |
| 5 | Application Details — Overview tab | 1 |
| 5 | Application Details — Timeline tab | 2 |
| 1 | Login / Register | 2 |
| 2 | Dashboard (KPIs + charts) | 2 |
| 7 | Profile / Settings — Profile tab only | 2 |
| 6 | Kanban Board | 2 — **stretch, do last** |

### Cut, and why

| Cut | Reason |
|---|---|
| **Calendar** (sidebar item) | No screen was designed, no data model exists, spec doesn't define it. Remove the nav item or render "Coming soon". |
| **Interviews tab** (screen 5) | Implies a whole `Interview` model + scheduling. Not in the spec. Separate project. |
| **Settings → Notifications / Security tabs** | Nav items only, no content designed. Ship Profile tab, disable the rest. |
| **Forgot password** | Requires transactional email. Stub the link. |
| Drag-and-drop, reminders, file upload, email | Spec Phase 4 — a second project bolted on. Revisit after Phase 2 ships. |

---

## 3. Design review — gaps found in the mockup

Read this before building. These are real problems that will bite mid-build.

### 🔴 Blocking — must resolve before the schema is written

1. **The Timeline needs a table the spec doesn't have.**
   Screen 5 shows `Applied — Sep 12` / `Shortlisted — Sep 18` / `Interview — Pending`. You **cannot** render dated history from a single `status` column. This needs a second table, `StatusHistory`, written on every status change. See ARCHITECTURE §4.
   *This is the single most important finding in this review.*

2. **`Withdrawn` exists in the spec, not in the design.**
   Spec §5.4 lists 6 statuses. The mockup shows 5 everywhere (badges, donut, Kanban columns). Decide: drop it, or add the 6th badge + column yourself.

3. **`jobType` has no defined values.**
   Both spec and mockup use it (field + filter) but never list the options. You define the enum.

### 🟡 Needs a decision

4. **Company logos** (screens 3, 5, 6) aren't in the schema. Cheapest path: derive from a domain with a favicon service rather than storing uploads. Fallback to a coloured initial.
5. **KPI "% from last month"** (screen 2) needs two date-windowed count queries and a guard for divide-by-zero. Real work — treat as its own step.
6. **Two search boxes** — global (header) and list-scoped (screen 3). Build one. Wire the header search to the list.
7. **"All Locations" filter** — a dropdown implies a list of locations. Derive with a `DISTINCT` query, or make it free text.
8. **No mobile designs.** Design spec says "Desktop first (1440px)", the project spec says "Responsive UI". You'll be inventing the mobile layout — budget time for it, especially the data table and Kanban.
9. **Bio field** (screen 7) isn't in the spec's users table. Add it or drop the field.

### 🟢 Noted, ignore

10. **Mock numbers don't reconcile.** KPI card says `Rejected 12`, the donut says `Rejected 5`, Kanban says `Shortlisted 9` vs donut `7`. It's placeholder data — do not treat these as business rules.

---

## 4. Design system — the good news

The palette is **stock Tailwind**, so there's almost nothing to configure:

| Role | Hex | Tailwind |
|---|---|---|
| Primary | `#3B82F6` | `blue-500` |
| Success | `#10B981` | `emerald-500` |
| Warning | `#F59E0B` | `amber-500` |
| Danger | `#EF4444` | `red-500` |
| Grey | `#6B7280` | `gray-500` |

Spacing is an 8px system (Tailwind's 4px scale — use even steps: `2`, `4`, `6`, `8`). Radius 12px = `rounded-xl`. Font: Inter via `next/font`. Type scale in ARCHITECTURE §8.

**Do not write a custom theme config.** Use the defaults; add semantic aliases only if you find yourself repeating a colour.

---

## 5. PHASE 1 — Working CRUD (no auth)

**Definition of done:** create, list, view, edit and delete a job application in the browser. Data survives a restart. No login. Looks like screens 3, 4 and 5 (Overview tab).

### 1.1 Scaffold
```bash
cd ~/Desktop/JobTrack
npx create-next-app@latest .
```
Answer: TypeScript **yes** · ESLint **yes** · Tailwind **yes** · **`src/` directory yes** · App Router **yes** · Turbopack yes · import alias `@/*` **yes**.

> `docs/` is on create-next-app's allowed-files list, so it won't complain. If it does, move `docs/` out, scaffold, move it back.

Then set up Inter with `next/font` and delete the boilerplate page.

**✅ Checkpoint:** dev server runs, blank styled page, Inter is applied.

### 1.2 MySQL up
Follow the Homebrew sequence in §1 — install `mysql@8.4`, add it to PATH, start the service,
secure it, create the `jobtrack` database.
**✅ Checkpoint:** `mysql --version` prints **8.4.x**, and `mysql -u root -p` → `SHOW DATABASES;` lists `jobtrack`.

### 1.3 Prisma installed and connected
```bash
npm i -D prisma@7          # ⚠️ pin the 7 — see ARCHITECTURE §2
npm i @prisma/client@7
npx prisma init --datasource-provider mysql
```
**⚠️ Do not drop the `@7`.** Right now `prisma`'s npm `latest` tag is an 8.0 release *candidate*
while `@prisma/client`'s is stable 7.10 — installing both unpinned gives you a mismatched pair
and confusing migrate failures. Check with `npx prisma -v`: both must say 7.x.

Then set `DATABASE_URL` in `.env` and confirm `.env` is gitignored.
**📚 Learn first:** What is an ORM? What does it save you from? What does it cost you?
**✅ Checkpoint:** you can explain, in your own words, what Prisma sits between.

### 1.4 The schema
Model `Application` only — no `User` yet. Enums for status and job type.
**✅ Decided:** `id` = `Int @default(autoincrement())` · `salary` = `Int?` · `WITHDRAWN` kept (6 statuses) · `src/` directory.
**🤔 Still yours to decide:** which remaining fields are nullable, and the `jobType` enum values.

**⚠️ MySQL gotcha:** Prisma maps `String` to `VARCHAR(191)`. `notes` and `jobUrl` will overflow — they need `@db.Text`.

**✅ Checkpoint:** `npx prisma migrate dev --name init` succeeds; the table is visible in MySQL; you can name the two files it generated and say what each is for.

### 1.5 Prisma client singleton
Write `lib/prisma.ts`.
**📚 Learn first:** why the `globalThis` trick exists (hot reload → connection pool exhaustion). Ask before you paste.
**✅ Checkpoint:** explain the file in one sentence.

### 1.6 Seed data
`prisma/seed.ts` with ~10 fake applications so the UI has something to render.
**✅ Checkpoint:** `npx prisma studio` shows your rows.

### 1.7 API — collection routes
`app/api/applications/route.ts` → `GET` (list), `POST` (create).
**📚 Learn:** status codes. `201` for create, `400` for bad input, `500` for server faults. Don't return `200` for everything.
**✅ Checkpoint:** both work in Postman/curl. **No UI yet.**

### 1.8 API — item routes
`app/api/applications/[id]/route.ts` → `GET`, `PUT`, `DELETE`.
**⚠️ Two gotchas, both guaranteed to bite:**
1. In Next.js 16, `params` is a **Promise** — you must `await` it.
2. Your ids are `Int`, but `params.id` arrives as a **string**. Parse with `Number()` and reject `NaN` with a `400`. Without that guard, `/api/applications/abc` throws a `500`.

**📚 Learn:** `404` when the id doesn't exist — never a silent `200` with `null`.
**✅ Checkpoint:** all 5 endpoints pass a curl script, including the 404 path.

### 1.9 Zod validation
`lib/validations.ts`. Parse every request body. Return `400` with field-level errors.
**📚 Learn:** never trust a client. Your React form validating is a UX nicety, not a security control.
**✅ Checkpoint:** POST with a missing `companyName` returns `400` and names the field.

### 1.10 App shell
Sidebar + Header from the mockup's component list. Static nav, no auth yet. Active-link highlighting.
**✅ Checkpoint:** shell matches screen 3's chrome.

### 1.11 Applications List
`StatusBadge` and `DataTable` components. Plain list — **no filters, no search, no pagination yet**.
**📚 Learn:** Server Component fetching directly vs. Client Component calling your API. Know why you'd pick each.
**✅ Checkpoint:** seeded rows render with correct badge colours.

### 1.12 Add / Edit modal
One `Modal` + one `ApplicationForm`, reused for both create and edit — not two components.
**✅ Checkpoint:** create and edit both work and the list refreshes.

### 1.13 Delete
With a confirmation step. Never a one-click destructive action.
**✅ Checkpoint:** delete works, confirm cancels cleanly.

### 1.14 Details page — Overview
`app/applications/[id]/page.tsx`. Overview tab only; other tabs visible but disabled.
**✅ Checkpoint:** matches screen 5's left panel.

### 🎯 Phase 1 complete
Commit, push, write the README. **This is already a real full-stack app.** Stop and take stock before Phase 2.

---

## 6. PHASE 2 — Auth, dashboard, polish

### 2.1 Add the User model — the deliberately painful step
Add `User`, add `userId` to `Application`, create the relation, migrate.

**It will fail.** Existing rows have no `userId` and the column is required. This is on purpose.
**📚 Learn:** how to add a required foreign key to a table that already has data. It's a genuine production problem and a very common interview question. We solve it together — options are a nullable-then-backfill-then-tighten sequence, a default row, or a reset. Know why you picked one.

### 2.2 Register
`POST /api/auth/register`. Hash with `bcryptjs`. Unique constraint on email.
**📚 Learn:** hashing vs. encryption, what a salt is, why cost factor matters.
**✅ Checkpoint:** the stored password is unreadable and different for two users with the same password.

### 2.3 Login / logout
Auth.js with a Credentials provider. Build screen 1 (split layout, password eye toggle, "Remember me" → session `maxAge`).
**✅ Checkpoint:** register → logout → login round-trips.

### 2.4 Lock it down
Middleware protects `/dashboard` and `/applications`. **Every query filters by the session user's id.**

**🔒 The security lesson:** hiding a button is not authorization. Logged in as user A, `curl` an endpoint with user B's application id — you must get `404`, not their data. We test this deliberately.
**✅ Checkpoint:** the cross-user curl test returns 404.

### 2.5 Status history + Timeline
Add the `StatusHistory` table (finding #1). Write a row on every status change. Build the Timeline tab (screen 5, right panel).
**📚 Learn:** transactions — the status update and the history row must both succeed or both fail.

### 2.6 List: search, filter, sort, paginate
Filter bar from screen 3 + pagination component. Drive it from URL search params so the view is shareable and back/forward works.

**⚠️ The #1 junior mistake in this exact feature:** paginating in JavaScript after fetching all rows. Pagination belongs in the query — `skip` / `take` — with a separate `count()` for the total.
**✅ Checkpoint:** with 500 seeded rows, page 5 is as fast as page 1.

### 2.7 Dashboard — KPIs
Screen 2's four cards. Use `groupBy` / `count`, not four round trips.
**📚 Learn:** aggregation in the database vs. in JS.

### 2.8 Dashboard — charts
Trend line + status donut. Recharts is the usual pick.
**⚠️** The "% from last month" delta needs two date-windowed counts and a divide-by-zero guard.

### 2.9 Dashboard — recent applications
Reuse `DataTable` with a row limit. No new component.

### 2.10 Profile / Settings
Screen 7, Profile tab only. Name, email (read-only), bio. Other tabs disabled.

### 2.11 Production readiness
Central error handler, consistent error shape, loading + empty + error states for every list, env var validation, README.

### 2.12 Deploy
Vercel + a hosted MySQL (PlanetScale / Railway / Aiven). `prisma migrate deploy` in the build step.
**⚠️** Serverless + MySQL needs connection pooling. Expect to hit this.

### 2.13 Kanban — stretch, only after everything above ships
Screen 6. `@dnd-kit` for drag-and-drop. Optimistic update, rollback on failure, and it must write a `StatusHistory` row like any other status change.

---

## 7. Open decisions for Harshit

**Decided 2026-09-20:**

- [x] **`src/` directory** — yes. `prisma/` stays at root; `middleware.ts` goes *inside* `src/`
- [x] **`Withdrawn` kept** — 6 statuses. You design the 6th badge + Kanban column yourself
- [x] **`salary` = `Int?`** — whole rupees
- [x] **`id` = `Int @default(autoincrement())`** — every `[id]` route needs a `Number()` parse + `NaN` guard

**Deferred — defaults assumed, change any time before the step that needs it:**

- [ ] `jobType` enum — assuming `FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, FREELANCE` *(needed by 1.4)*
- [ ] Company logos — assuming favicon service with initials fallback *(needed by 1.11)*
- [ ] `bio` field — assuming kept *(needed by 2.10)*

---

## 8. Progress tracker

### Phase 1
- [ ] 1.1 Scaffold
- [ ] 1.2 MySQL up
- [ ] 1.3 Prisma connected
- [ ] 1.4 Schema + first migration
- [ ] 1.5 Prisma singleton
- [ ] 1.6 Seed data
- [ ] 1.7 Collection API
- [ ] 1.8 Item API
- [ ] 1.9 Zod validation
- [ ] 1.10 App shell
- [ ] 1.11 Applications list
- [ ] 1.12 Add/Edit modal
- [ ] 1.13 Delete
- [ ] 1.14 Details page

### Phase 2
- [ ] 2.1 User model + migration
- [ ] 2.2 Register
- [ ] 2.3 Login/logout
- [ ] 2.4 Authorization
- [ ] 2.5 Status history + timeline
- [ ] 2.6 Search/filter/sort/paginate
- [ ] 2.7 KPI cards
- [ ] 2.8 Charts
- [ ] 2.9 Recent applications
- [ ] 2.10 Profile
- [ ] 2.11 Production readiness
- [ ] 2.12 Deploy
- [ ] 2.13 Kanban (stretch)
