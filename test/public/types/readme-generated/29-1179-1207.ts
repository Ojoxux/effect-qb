// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 1179-1207

// README.md:1179-1207
import * as Schema from "effect/Schema"
import { Column, Query, Table } from "effect-qb"
import * as Pg from "effect-qb/postgres"

const docs = Table.make("docs", {
  id: Column.uuid().pipe(Column.primaryKey),
  payload: Pg.Column.jsonb(Schema.Struct({
    profile: Schema.Struct({
      address: Schema.Struct({
        city: Schema.String
      })
    })
  }))
})

const city = Pg.Jsonb.text(
  docs.payload,
  Pg.Jsonb.path(
    Pg.Jsonb.key("profile"),
    Pg.Jsonb.key("address"),
    Pg.Jsonb.key("city")
  )
)

const plan = Query.select({ city }).pipe(Query.from(docs))

void plan

export {};
