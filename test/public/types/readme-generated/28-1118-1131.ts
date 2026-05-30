// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 1118-1131

// README.md:1118-1131
import { Casing, Column, Table } from "effect-qb"

const users = Table.make("Users", {
  id: Column.uuid().pipe(Column.primaryKey),
  createdAt: Column.datetime()
}).pipe(
  Casing.withCasing({
    tables: "snake_case",
    columns: "snake_case"
  })
)


export {};
