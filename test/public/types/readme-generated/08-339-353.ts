// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 339-353

// README.md:339-353
import { Casing, Column } from "effect-qb"

const Snake = Casing.make({
  tables: "snake_case",
  columns: "snake_case"
})

const users = Snake.table("UserAccounts", {
  id: Column.uuid().pipe(Column.primaryKey),
  createdAt: Column.datetime()
})

void users

export {};
