// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 566-599

// README.md:566-599
import * as Schema from "effect/Schema"
import { Column, Query, Table } from "effect-qb"
import * as Pg from "effect-qb/postgres"

const payloadSchema = Schema.Struct({
  profile: Schema.Struct({
    address: Schema.Struct({
      city: Schema.String,
      postcode: Schema.NullOr(Schema.String)
    }),
    tags: Schema.Array(Schema.String)
  }),
  note: Schema.NullOr(Schema.String)
})

const docs = Table.make("docs", {
  id: Column.uuid().pipe(Column.primaryKey),
  payload: Pg.Column.jsonb(payloadSchema)
})

const cityPath = Pg.Jsonb.path(
  Pg.Jsonb.key("profile"),
  Pg.Jsonb.key("address"),
  Pg.Jsonb.key("city")
)

const missingRequiredCity = Pg.Jsonb.delete(docs.payload, cityPath)

Query.update(docs, {
  // @ts-expect-error payload no longer satisfies payloadSchema
  payload: missingRequiredCity
})

export {};
