# README Documentation Notes

These notes were prepared without reading any existing `README.md` file. They use current source, tests, package metadata, and non-README docs as the evidence base.

## 1. What is `effect-qb`?

### Refined Outline
- Purpose: typed SQL query builder for Effect-oriented TypeScript applications.
- Positioning: portable root namespace plus concrete dialect namespaces.
- Supported querybuilder dialects: standard, Postgres, MySQL, SQLite.
- Non-goals: not a runtime ORM, not a central SQL compatibility shim, not a replacement for a concrete database renderer/executor.
- Relationship to `effect-db`: separate schema-management package; keep out of the primary `effect-qb` README path or mention only as a companion package.

### Source-Backed Details
- Package name is `effect-qb`; workspace also contains `effect-db`.
- Root entrypoint exports standard modules plus `Casing`.
- Concrete entrypoints are `effect-qb/postgres`, `effect-qb/mysql`, and `effect-qb/sqlite`.
- `docs/standard-dialect-spec.md` frames standard as a portable authoring layer, not a fourth backend.

### Progressive Disclosure
- Visible: one paragraph, a four-row dialect summary, and a tiny import example.
- Collapsible: package split with `effect-db`, deeper dialect lattice rules.

### Gaps / Risks
- Be explicit that `effect-db` CLI/schema management belongs to a different package.
- Avoid promising full SQL portability for every helper; dialect-specific helpers narrow plans.

## 2. Install

### Refined Outline
- Install package.
- Runtime requirements.
- Peer dependencies.
- Public import paths.
- Bun repo-development commands.

### Source-Backed Details
- `packages/querybuilder/package.json` requires Node `>=22` and Bun `>=1.3.5`.
- Peer dependencies: `effect`, `@effect/sql`, `@effect/experimental`.
- Public exports:
  - `effect-qb`
  - `effect-qb/standard`
  - `effect-qb/postgres`
  - `effect-qb/postgres/metadata`
  - `effect-qb/mysql`
  - `effect-qb/sqlite`

### Progressive Disclosure
- Visible: install command and canonical imports.
- Collapsible: peer dependency/version table, export map.

### Gaps / Risks
- Root README should prefer `import { Column, Table, Query } from "effect-qb"`; `effect-qb/standard` is still exported but should not be the first path.

## 3. Quick Start

### Refined Outline
- Define a table with root `Table` and `Column`.
- Build a standard query.
- Render with standard and concrete renderers.
- Execute through a concrete executor.
- Show result row type.

### Source-Backed Details
- Tests define tables with:
  ```ts
  import { Column, Function, Query, Table } from "effect-qb"

  const users = Table.make("users", {
    id: Column.uuid().pipe(Column.primaryKey),
    email: Column.text(),
    bio: Column.text().pipe(Column.nullable)
  })
  ```
- Standard plans can render through `Standard.Renderer`, `Postgres.Renderer`, `Mysql.Renderer`, and `Sqlite.Renderer`.
- `Query.ResultRow<typeof plan>` is the canonical result type.

### Progressive Disclosure
- Visible: one complete table/query/render example.
- Collapsible: same plan rendered by each dialect.

### Gaps / Risks
- Need a verified execute example using `Executor.fromDriver` or `Executor.fromSqlClient`; avoid implying the root namespace has a generic executor.

## 4. Core Mental Model

### Refined Outline
- `Column`: runtime schema, DB type, nullability, defaults, generated/default metadata.
- `Table`: source identity, fields, primary key metadata, schemas.
- `Query`: typed plan, source requirements, dialect tag, result row.
- `Renderer`: turns complete compatible plans into SQL, params, projections, value mappings.
- `Executor`: concrete execution plus row normalization/decoding.
- Standard vs concrete dialect rules.

### Source-Backed Details
- Rendered query carries `sql`, `params`, `dialect`, `projections`, optional `valueMappings`.
- Executors decode flat driver rows through projections and schemas.
- Type tests assert concrete dialect conflicts and standard-to-concrete narrowing.

### Progressive Disclosure
- Visible: conceptual diagram or bullet path: Table -> Query Plan -> Renderer -> SQL -> Executor -> typed rows.
- Collapsible: internal symbols and metadata contracts.

### Gaps / Risks
- Keep internals out of first read; users need behavior, not symbol names.

## 5. Defining Tables

### Refined Outline
- `Table.make`.
- `Table.schema`.
- `Table.Class` for class-style definitions.
- Inline column modifiers.
- Table-level options.
- Derived schemas: select/insert/update.

### Source-Backed Details
- `Table.make(name, fields, schemaName?)`.
- `Table.schema(schemaName).table(...)`.
- `Table.Class<Self>("users")({...})` exists and is tested.
- Table helpers: `primaryKey`, `unique`, `index`, `foreignKey`, `check`, `alias`.
- Schema helpers: `selectSchema`, `insertSchema`, `updateSchema`, and `table.schemas`.

### Progressive Disclosure
- Visible: factory table path only.
- Collapsible: class tables, schema derivation, table option matrix.

### Gaps / Risks
- Decide whether class-style tables are promoted or documented as advanced/legacy.

## 6. Casing and Naming

### Refined Outline
- Why logical names differ from physical identifiers.
- `Casing.withCasing(...)` for table/schema namespace overrides.
- `Casing.casing(...)` for table factories.
- Categories: schemas, tables, columns, indexes, constraints, types, sequences.
- Override/merge behavior.

### Source-Backed Details
- Public root exports `Casing`.
- `Casing.withCasing(options)` accepts tables and casing-aware namespaces.
- `Casing.casing(options)` returns a factory with `table`, `schema`, and `withCasing`.
- Tests prove table/column/index/constraint casing affects DDL and metadata.

### Progressive Disclosure
- Visible: camelCase model to snake_case DB example.
- Collapsible: all casing categories and schema namespace factory examples.

### Gaps / Risks
- Need a clear rule for precedence: renderer-level casing, table-level casing, and schema/factory-level casing.

## 7. Dialect Modules

### Refined Outline
- Root portable namespace.
- Concrete namespace imports.
- What concrete namespaces add.
- Feature matrix.
- Dialect narrowing/conflict rules.

### Source-Backed Details
- Root `effect-qb` re-exports standard modules and `Casing`.
- Postgres exports `Column`, `Datatypes`, `Errors`, `Function`, `Json`, `Executor`, `Query`, `Type`, `Metadata`, `SchemaExpression`, `Schema`, `Table`, `Renderer`, `Cast`, `enum`, `sequence`.
- MySQL/SQLite export concrete `Column`, `Datatypes`, `Errors`, `Function`, `Json`, `Executor`, `Query`, `Renderer`.

### Progressive Disclosure
- Visible: canonical import block.
- Collapsible: full module export table and feature matrix.

### Gaps / Risks
- Do not imply MySQL/SQLite have schema namespace support equivalent to Postgres.

## 8. Postgres

### Refined Outline
- Postgres imports.
- Postgres column extensions.
- `jsonb`.
- arrays and identity columns.
- schemas, enums, sequences.
- Postgres table options and indexes.
- DDL/rendering behavior.

### Source-Backed Details
- Postgres column extensions include `jsonb`, `array`, `identityAlways`, `identityByDefault`, `foreignKey`, `index`, `unique`, `ddlType`, and custom types.
- `Pg.Schema.make("analytics")` creates schema-scoped table/enum/sequence namespace and supports `.withSchema` and `.withCasing`.
- Postgres table indexes support structured keys, method, include, predicate, unique.
- Tests cover Postgres placeholders, casts, DDL, CTEs, lateral, returning, upsert, data-modifying CTEs, and set operators.

### Progressive Disclosure
- Visible: Postgres schema + jsonb example.
- Collapsible: index option reference, enum/sequence docs, all Postgres-only types.

### Gaps / Risks
- Keep `effect-db` pull/push/migrate out unless this README intentionally covers both packages.

## 9. MySQL

### Refined Outline
- MySQL imports.
- MySQL-specific columns/datatypes.
- JSON helpers.
- Renderer differences.
- Unsupported features.
- DDL support.

### Source-Backed Details
- MySQL JSON helper exports `json`.
- Tests cover MySQL backtick quoting, question-mark placeholders, concat syntax, casts, enum/set casts, right/cross joins, recursive CTEs, lateral joins, locking, set operators, joined updates/deletes, multi-row inserts, duplicate-key conflict clauses, DDL.
- MySQL rejects full joins and returning projections in mutations/upsert/data-modifying CTEs.

### Progressive Disclosure
- Visible: import and one render example.
- Collapsible: MySQL-specific behavior and unsupported feature table.

### Gaps / Risks
- Need one canonical MySQL table/DDL example using current public APIs.

## 10. SQLite

### Refined Outline
- SQLite imports.
- SQLite-specific columns/datatypes.
- JSON helper.
- Renderer behavior.
- Unsupported features.
- Local/dev execution notes.

### Source-Backed Details
- SQLite entrypoint exports concrete `Column`, `Datatypes`, `Errors`, `Function`, `Json`, `Executor`, `Query`, `Renderer`.
- SQLite JSON helper exports `json`.
- DDL tests show UUID renders as `text`, blob as `blob`, and unsupported arrays/identity columns are rejected.

### Progressive Disclosure
- Visible: import and standard DDL render example.
- Collapsible: type-affinity notes and unsupported feature table.

### Gaps / Risks
- Need a dedicated SQLite behavior-test chapter source if the README wants broad SQLite examples beyond DDL.

## 11. Writing Queries

### Refined Outline
- Select and projections.
- `from`, joins, source requirements.
- Predicates and boolean composition.
- Aliases and nested selections.
- Aggregates, group/order/limit/offset.
- CTEs, derived tables, lateral.
- Mutations: insert/update/upsert/delete/merge.
- Set operators.
- Raw/escape hatches, if any.

### Source-Backed Details
- Standard `Query` exports broad read, mutation, DDL, transaction, set operator, function, and predicate helpers.
- Tests cover nested selections, alias projections, joins, group/order, distinct/limit/offset, exists, CTEs, lateral, mutations, merge, upsert, set operators.
- Projection aliases affect rendered SQL aliases without changing decoded result paths.

### Progressive Disclosure
- Visible: select/from/where/join/order example.
- Collapsible: full query surface, mutation examples, set operators, advanced source forms.

### Gaps / Risks
- Query API is broad; README should avoid becoming a full reference before users see one complete happy path.

## 12. Rendering SQL

### Refined Outline
- Built-in renderers.
- `Renderer.make(options)`.
- `valueMappings`.
- `casing`.
- SQL, params, projections, dialect.
- Custom renderer boundary.

### Source-Backed Details
- Standard, Postgres, MySQL, SQLite renderers each expose `make(options = {})`.
- Built-in renderer options are `valueMappings?` and `casing?`.
- Renderer output includes `sql`, `params`, `dialect`, `projections`, optional `valueMappings`.
- Core custom `Renderer.make(dialect, render)` requires an explicit render implementation; built-ins use trusted renderers.

### Progressive Disclosure
- Visible: `Pg.Renderer.make({ casing, valueMappings }).render(plan)`.
- Collapsible: full output shape, projection metadata, custom renderer docs.

### Gaps / Risks
- Need a current public example for type-safe `valueMappings` keys.

## 13. Executing Queries

### Refined Outline
- Concrete executor concept.
- `Executor.fromDriver`.
- `Executor.fromSqlClient`.
- Row remapping and decoding.
- Streaming.
- Error surface.

### Source-Backed Details
- Internal executor has `Driver`, `Executor`, `FlatRow`, `DriverMode`, and `RowDecodeError`.
- Drivers execute rendered queries and return flat alias-keyed rows.
- Executors normalize raw driver values, validate runtime schemas, and remap aliases to nested result rows.
- Type tests use `Executor.fromDriver(runtimeRenderer, runtimeDriver)` and `Executor.fromSqlClient(runtimeRenderer)`.

### Progressive Disclosure
- Visible: one `fromSqlClient` example.
- Collapsible: custom driver and decode pipeline internals.

### Gaps / Risks
- Confirm public dialect executors re-export all helper names used in docs.

## 14. Schema Management

### Refined Outline
- Decide whether this belongs in `effect-qb` README or companion `effect-db` docs.
- If included: separate package install, CLI, Postgres-only scope, push/pull/migrate.
- Source discovery, diff planning, migration files.
- Safety model.

### Source-Backed Details
- Schema management package is `effect-db`, not `effect-qb`.
- CLI binary is `effectdb`.
- Exports include `./postgres/pull`, `./postgres/push`, `./postgres/migrate`.
- CLI has `push`, `pull`, and `migrate` subcommands.

### Progressive Disclosure
- Visible in `effect-qb` README: short companion-package pointer only.
- Collapsible or separate doc: CLI config, Postgres source discovery, migration internals.

### Gaps / Risks
- Mixing `effect-db` into the main `effect-qb` README may confuse package boundaries.

## 15. Advanced Types

### Refined Outline
- Runtime schemas and canonical values.
- Custom columns and custom DB types.
- JSON/jsonb.
- Enums and sequences.
- Arrays.
- Generated/default columns.
- Driver value mappings.

### Source-Backed Details
- Standard columns include uuid, text, varchar, char, int, bigint, number/decimal, real, boolean, date, time, datetime, timestamp, blob, json.
- Runtime values include branded string schemas for bigint, decimal, local date/time/datetime.
- Postgres adds jsonb, bytea, array, identity, timestamp variants, and custom types.
- `Column.schema` can refine select/insert/update schemas.

### Progressive Disclosure
- Visible: runtime value table for common types.
- Collapsible: custom type authoring, driver mapping internals, dialect-specific type list.

### Gaps / Risks
- Need exact runtime contract table checked against tests for every type.

## 16. Recipes

### Refined Outline
- Portable CRUD query.
- CamelCase model to snake_case DB.
- Postgres schema with enum/sequence/jsonb.
- Self-join with aliases.
- Typed JSON path query.
- Render-only usage.
- Execute through Effect SQL client.

### Source-Backed Details
- Tests cover alias self-joins and explicit projection aliases.
- Casing tests cover snake_case conversion.
- Postgres schema tests cover `Pg.Schema.make`, enums, sequences, and pulled json/cast chains.
- Executor tests cover `fromDriver` and `fromSqlClient`.

### Progressive Disclosure
- Visible: 3 high-value recipes only.
- Collapsible: recipe index with advanced examples.

### Gaps / Risks
- Recipes should be copied from passing tests or type tests to avoid drift.

## 17. Type Safety Guarantees

### Refined Outline
- Literal table/column names and aliases.
- Dialect compatibility and narrowing.
- Source requirements.
- Result row inference.
- Insert/update schema inference.
- Type-level validation vs runtime boundary checks.
- `any` policy.

### Source-Backed Details
- Type tests assert dialect conflicts across Postgres/MySQL queries, expressions, derived sources, CTEs, lateral sources, mutations, values, unnest, and table functions.
- Tests intentionally preserve malformed metadata without runtime validation in builder paths.
- Runtime checks remain at renderer/executor/planning boundaries for untyped or impossible usage.

### Progressive Disclosure
- Visible: what users get by staying typed.
- Collapsible: `any` boundary and examples of intentional runtime checks.

### Gaps / Risks
- Keep this honest: builders often trust types; renderers/planners defend public boundaries.

## 18. Limitations

### Refined Outline
- Dialect-specific SQL not portable.
- Unsupported standard DDL modifiers.
- Unsupported arrays/identity outside Postgres.
- MySQL returning limitations.
- SQLite type/DDL limitations.
- Runtime validation boundaries.
- Companion package boundary for schema management.

### Source-Backed Details
- Standard create/drop index/table reject some existence modifiers.
- MySQL rejects returning projections for insert/update/delete/upsert/data-modifying CTEs.
- MySQL rejects full joins.
- Standard/MySQL/SQLite reject Postgres identity and array column options.

### Progressive Disclosure
- Visible: short limitations list.
- Collapsible: dialect-specific unsupported feature table.

### Gaps / Risks
- Need avoid stale limitation claims; source from behavior tests where possible.

## 19. API Reference

### Refined Outline
- Root modules:
  - `Column`
  - `Table`
  - `Query`
  - `Function`
  - `Renderer`
  - `Datatypes`
  - `Casing`
- Concrete modules:
  - `Pg.Column`, `Pg.Table`, `Pg.Query`, etc.
  - `Mysql.*`
  - `Sqlite.*`
- Companion references:
  - `effect-qb/postgres/metadata`
  - `effect-db` if covered separately.

### Source-Backed Details
- Public export files are small and can seed a reference table.
- Standard `Query` re-exports many helpers from internal DSL; group them by purpose rather than alphabetically.

### Progressive Disclosure
- Visible: module map.
- Collapsible: full function tables by module.

### Gaps / Risks
- README API reference should not duplicate generated docs if those are planned.

## 20. Contributing / Development

### Refined Outline
- Install with Bun.
- Test commands.
- Type test commands.
- Build commands.
- Red-green-refactor workflow.
- Where behavior and type tests live.

### Source-Backed Details
- Root scripts:
  - `bun run build`
  - `bun test`
  - `bun run test:types`
  - `bun run test:integration`
  - `bun run test:pack`
- Project uses `bunx tsgo` through the type-test script.
- Tests are under `test/internal/behavior`, `test/public/behavior`, and `test/internal/types`.

### Progressive Disclosure
- Visible: minimal command list.
- Collapsible: test taxonomy and release/pack checks.

### Gaps / Risks
- Current repo instructions prefer Bun and `tsgo`; docs should not mention `tsc`, npm, yarn, pnpm, or vite as the primary workflow.

## Recommended README Order

1. What is `effect-qb`?
2. Install
3. Quick Start
4. Core Mental Model
5. Defining Tables
6. Writing Queries
7. Rendering SQL
8. Executing Queries
9. Casing and Naming
10. Dialect Modules
11. Postgres
12. MySQL
13. SQLite
14. Advanced Types
15. Recipes
16. Type Safety Guarantees
17. Limitations
18. API Reference
19. Contributing / Development
20. Companion: `effect-db` Schema Management

Reasoning: start with user value and a working path, then deepen into table/query/render/execute concepts. Casing should come before dialect specifics because it affects examples across all dialects. `effect-db` should move to the end or a separate README because it is a separate package and would otherwise interrupt the `effect-qb` learning path.
