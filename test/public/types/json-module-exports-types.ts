import * as Schema from "effect/Schema"
import { Column, Json, Table } from "effect-qb"
import { Query as PgQuery } from "effect-qb"
import { Column as PgColumn, Jsonb } from "effect-qb/postgres"
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

const jsonDocs = Table.make("json_docs", {
  id: Column.uuid().pipe(Column.primaryKey),
  payload: Column.json(payloadSchema)
})

const jsonbDocs = Table.make("jsonb_docs", {
  id: Column.uuid().pipe(Column.primaryKey),
  payload: PgColumn.jsonb(payloadSchema)
})

const cityText = jsonDocs.payload.pipe(
  Json.key("profile"),
  Json.key("address"),
  Json.key("city"),
  Json.text
)

const jsonbCityText = jsonbDocs.payload.pipe(
  Jsonb.key("profile"),
  Jsonb.key("address"),
  Jsonb.key("city"),
  Jsonb.text
)

const missingRequiredCity = jsonbDocs.payload.pipe(
  Jsonb.key("profile"),
  Jsonb.key("address"),
  Jsonb.key("city"),
  Jsonb.delete
)

// @ts-expect-error shared JSON path helpers are exported from effect-qb/Json
Pg.Json.key("profile")
// @ts-expect-error Json.path has been replaced by successive Json.key/Json.index pipes
Json.path(Json.key("profile"))
// @ts-expect-error Jsonb.path has been replaced by successive Jsonb.key/Jsonb.index pipes
Jsonb.path(Jsonb.key("profile"))

PgQuery.update(jsonbDocs, {
  // @ts-expect-error jsonb update values must still satisfy the target column schema
  payload: missingRequiredCity
})

void cityText
void jsonbCityText
