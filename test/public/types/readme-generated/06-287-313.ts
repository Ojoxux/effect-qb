// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 287-313

// README.md:287-313
import { Casing, Column, Query, Table } from "effect-qb"
import * as Pg from "effect-qb/postgres"

const users = Table.make("UserAccounts", {
  id: Column.uuid().pipe(Column.primaryKey),
  createdAt: Column.datetime(),
  displayName: Column.text()
})

const readUsers = Query.select({
  createdAt: users.createdAt
}).pipe(
  Query.from(users),
  Query.where(Query.eq(users.displayName, "Ada"))
)

const renderer = Pg.Renderer.make().pipe(
  Casing.withCasing({
    tables: "snake_case",
    columns: "snake_case"
  })
)

const rendered = renderer.render(readUsers)
void rendered

export {};
