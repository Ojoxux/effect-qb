// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 850-869

// README.md:850-869
import { Column, Query, Table } from "effect-qb"
import * as Pg from "effect-qb/postgres"

const users = Table.make("users", {
  id: Column.uuid().pipe(Column.primaryKey),
  email: Column.text()
})

const readUsers = Query.select({
  id: users.id,
  email: users.email
}).pipe(Query.from(users))

const rowsEffect = Pg.Executor.make().execute(readUsers)
const rowStream = Pg.Executor.make().stream(readUsers)

void rowsEffect
void rowStream

export {};
