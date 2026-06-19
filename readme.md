# Platione Sales Assist — QA Automation Framework

A Playwright + TypeScript starter framework for the Platione Sales Assist platform.
It is the **foundation** future QA engineers build on: test-data factories, API & DB
seeders, reusable API clients, page objects, and a utility layer — all runnable today
with **zero backend** thanks to a mock mode.

> Built for the *QA Automation Framework Assignment*. The goal is to demonstrate
> framework **design and structure** for a real SaaS product, not a 100%-complete suite.

---

## Quick start

```bash
npm install
npx playwright install      # one-time: browser binaries

npm run typecheck           # tsc --noEmit — the whole framework type-checks
npm test                    # runs API tests in mock mode (no backend needed)
npm run test:api            # API tests only
npm run report              # open the HTML report
```

By default `MOCK_API=true`, so API clients return deterministic responses and tests
run anywhere (laptop, CI) without a live server. Point at a real environment by
setting `MOCK_API=false` in the relevant `.env` file.

---

## Folder structure

```
.
├─ src/
│  ├─ config/            env.ts — resolves .env.<TEST_ENV>, typed config
│  ├─ types/             models.ts — domain interfaces (single source of truth)
│  ├─ data/
│  │  ├─ factories/      realistic entity builders (Contact, Lead, Customer, …)
│  │  ├─ seeders/        ApiSeeder, DbSeeder, ContactSeeder, runDbSeed CLI
│  │  └─ seed/           static JSON fixtures (baseline data)
│  ├─ api/
│  │  ├─ clients/        BaseApiClient + typed clients (Contact, Action, …)
│  │  ├─ builders/       fluent request builders
│  │  └─ validators/     ApiAssertions (status) + ResponseValidator (shape)
│  ├─ pages/             BasePage + page objects (Login, Contacts)
│  ├─ components/        component objects (NavBar)
│  └─ utils/             logger, ScreenshotUtil, AuthHelper, DbUtil
├─ tests/
│  ├─ fixtures.ts        custom Playwright fixtures (auth + seeder + cleanup)
│  ├─ api/               API specs
│  └─ ui/                UI specs (page-object driven)
├─ sql/seed.sql          migration-style DB baseline seed
├─ .env.qa / .env.staging  per-environment configuration
├─ .github/workflows/    CI pipeline
└─ playwright.config.ts  env-aware config, multi-reporter, failure artifacts
```

---

## Architecture & design decisions

The framework is organised in **layers**, each with one responsibility. A test reads
top-down through them and never reaches around a layer:

```
 test  →  factory (data)  →  builder (tweak)  →  API client  →  validator (assert)
                                     ↘  page object  →  component  ↗
              everything sits on:  config · utils (auth, logger, db, screenshots)
```

| Decision | Why |
|---|---|
| **Typed domain models** (`types/models.ts`) | One place defines entity shape. A backend field rename breaks the build, not a test at runtime. No stringly-typed `any` payloads. |
| **Factory pattern for data** | Every factory returns a *complete, realistic* object with overridable fields. Tests pin only what they care about; faker randomises the rest → independent, non-colliding data. |
| **Named builders** (`hotLead`, `overdue`, `churned`) | Encode business meaning (score bands, due-date logic) so specs read in domain language, not magic numbers. |
| **Composite factory** (`FollowUpFactory`) | A follow-up is a *situation* (contact + interaction + action), so it composes the single-entity factories into one coherent graph. |
| **Request builders** | Complement factories: factory = realistic whole, builder = fluent per-field tweak for one scenario. |
| **BaseApiClient + mock mode** | Shared HTTP plumbing; concrete clients only declare endpoint + payload + mock shape. Mock mode lets the framework run before the backend exists. |
| **Two validator types** | `ApiAssertions` = status codes; `ResponseValidator` = body/shape. Contract checks live in one helper, not scattered across specs. |
| **Page Objects + Component Objects** | Locators via `data-testid` (decoupled from copy/CSS). Components (NavBar) are shared UI composed by pages → fix once. |
| **Custom fixtures** (`tests/fixtures.ts`) | Tests receive authenticated clients + a seeder with **automatic cleanup**. The single seam tests depend on; wiring changes never touch specs. |
| **Seeder split: API vs DB** | API seeder = data valid against current rules (preferred). DB seeder = states the API can't reach (bulk, historic timestamps, corrupt rows). |

### Test data strategy (the core of this framework)

Four capabilities the assignment asks for, and how each is met:

- **Generating** — factories produce realistic data via faker (`ContactFactory.create()`).
- **Reusing** — JSON fixtures (`data/seed/contacts.seed.json`) + `seedFromJson()` for curated baselines.
- **Customizing** — `overrides` parameter on every factory + fluent `ContactRequestBuilder`.
- **Edge cases** — `EdgeCaseFactory`: duplicates, invalid email, boundary lengths, SQL-injection, unicode, whitespace-only, missing required fields.

### Seeding strategy

| Mechanism | File | Use it for |
|---|---|---|
| **API seeder** | `data/seeders/ApiSeeder.ts` | Default. Seeds via public API → always valid; tracks ids and auto-cleans. |
| **DB seeder (SQL)** | `sql/seed.sql` + `DbSeeder.runSqlFile()` | Idempotent, migration-style baseline; safe to re-run. |
| **DB seeder (factory)** | `DbSeeder.bulkInsertContacts(n)` | Volume/perf data the API would be too slow for. |
| **JSON fixtures** | `data/seed/*.json` | Stable, human-curated reference rows. |
| **CLI** | `npm run seed:db [count]` | One-shot environment setup. |

---

## Scaling strategy: 3 → 50 → 500 tests

| Concern | How the structure scales |
|---|---|
| **Reusability** | New tests reuse factories, clients, page objects, fixtures — they add a spec, not infrastructure. A new entity = one factory + one client + one type. |
| **Maintainability** | A UI change touches one page object; a contract change touches one validator; an auth change touches `AuthHelper`. Blast radius stays O(1), not O(tests). |
| **Team collaboration** | Layered folders + typed models mean two engineers rarely touch the same file. `data-testid` locators decouple QA from frontend churn. |
| **CI/CD execution** | `fullyParallel` + Playwright sharding (`--shard=1/4`) splits 500 tests across runners. Auto-cleanup keeps shared environments clean. JUnit reporter feeds CI dashboards; HTML report + trace/video-on-failure for debugging. |

At **3 tests**: factories + one client are enough.
At **50**: fixtures and the seeder/cleanup pattern prevent data collisions.
At **500**: shard in CI, tag suites (`@smoke`, `@regression`), and lean on the DB seeder for bulk setup so wall-clock stays flat.

---

## Environment management

`TEST_ENV` selects which `.env.<name>` file `src/config/env.ts` loads. Tests never read
`process.env` directly — they ask the typed `env` object, so a missing variable fails
loudly at startup.

| Environment | File | Notes |
|---|---|---|
| **QA** | `.env.qa` | Default. Mock mode on by default; flip `MOCK_API=false` when the QA backend is up. |
| **Staging** | `.env.staging` | Hits real services; mocks off. Read-only DB user for safety. |
| **Production-like** | `.env.prod-like` (add as needed) | Same shape; smoke/read-only suites only, no destructive seeding. |

```bash
npm run test:qa        # TEST_ENV=qa
npm run test:staging   # TEST_ENV=staging
```

**Secrets** stay out of git: committed `.env.*` files hold non-secret defaults and
placeholders; real credentials come from CI secrets / a vault and override file values
at runtime.

---

## CI/CD

`.github/workflows/playwright.yml` runs on push/PR: install → install browsers →
`playwright test` → upload the HTML report as an artifact. To scale, add a matrix
`shard: [1/4, 2/4, 3/4, 4/4]` and run `playwright test --shard=${{ matrix.shard }}`.

---

## Conventions

- **Language:** TypeScript, strict mode.
- **Naming:** Factories `*Factory`, clients `*ApiClient`, pages `*Page`, seeders `*Seeder`.
- **Locators:** `data-testid` only — never CSS/text selectors in page objects.
- **No `any` payloads:** everything flows through `types/models.ts`.
- **Cleanup:** every seeded entity is tracked and removed in fixture teardown.
