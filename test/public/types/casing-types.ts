import { Casing, Column, Query, Renderer, Table } from "effect-qb"
import * as My from "effect-qb/mysql"
import * as Pg from "effect-qb/postgres"
import * as Sq from "effect-qb/sqlite"

const Snake = Casing.make({
  tables: "snake_case",
  columns: "snake_case"
})

const SnakeShorthand = Casing.make("snake_case")

const snakeUsers = Snake.table("UserAccounts", {
  id: Column.uuid().pipe(Column.primaryKey),
  createdAt: Column.datetime(),
  displayName: Column.text()
})

const snakePlan = Query.select({
  createdAt: snakeUsers.createdAt,
  displayName: snakeUsers.displayName
}).pipe(
  Query.from(snakeUsers),
  Query.where(Query.eq(snakeUsers.displayName, "Alice"))
)

Renderer.make({
  // @ts-expect-error renderer casing is configured with Casing.withCasing pipes
  casing: {
    tables: "snake_case",
    columns: "snake_case"
  }
})

Pg.Renderer.make({
  // @ts-expect-error renderer casing is configured with Casing.withCasing pipes
  casing: {
    tables: "snake_case",
    columns: "snake_case",
    schemas: "snake_case"
  }
}).render(snakePlan)

My.Renderer.make({
  // @ts-expect-error renderer casing is configured with Casing.withCasing pipes
  casing: {
    tables: "snake_case",
    columns: "snake_case"
  }
}).render(snakePlan)

Sq.Renderer.make({
  // @ts-expect-error renderer casing is configured with Casing.withCasing pipes
  casing: {
    tables: "snake_case",
    columns: "snake_case"
  }
}).render(snakePlan)

Renderer.make().pipe(
  Casing.withCasing("snake_case")
).render(snakePlan)

Pg.Renderer.make().pipe(
  Casing.withCasing({
    tables: "snake_case",
    columns: "snake_case",
    schemas: "snake_case"
  })
).render(snakePlan)

Table.make("UserAccounts", {
  id: Column.uuid().pipe(Column.primaryKey),
  createdAt: Column.datetime()
}).pipe(
  Casing.withCasing({ columns: "snake_case" })
)

SnakeShorthand.table("ShorthandUsers", {
  id: Column.uuid().pipe(Column.primaryKey),
  createdAt: Column.datetime()
})

Table.make("ShorthandAccounts", {
  id: Column.uuid().pipe(Column.primaryKey),
  createdAt: Column.datetime()
}).pipe(
  Casing.withCasing("snake_case")
)

// @ts-expect-error casing pipes only apply to tables, schema factories, or renderers
snakePlan.pipe(Casing.withCasing({ columns: "snake_case" }))
// @ts-expect-error casing helpers only apply to tables, schema factories, or renderers
Casing.withCasing({ columns: "snake_case" })("not-a-casing-target")

// @ts-expect-error casing styles are a closed set unless a custom function is supplied
Casing.make({ columns: "snakeCase" })
