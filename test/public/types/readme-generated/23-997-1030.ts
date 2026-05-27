// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 997-1030

// README.md:997-1030
import * as Schema from "effect/Schema"
import { Column, Query, Table } from "effect-qb"
import * as Pg from "effect-qb/postgres"

const payloadSchema = Schema.Union(
  Schema.Struct({
    kind: Schema.Literal("created"),
    actorId: Schema.String
  }),
  Schema.Struct({
    kind: Schema.Literal("deleted"),
    reason: Schema.String
  })
)

const events = Table.make("events", {
  id: Column.uuid().pipe(Column.primaryKey),
  payload: Pg.Column.jsonb(payloadSchema),
  createdAt: Column.datetime()
}).pipe(
  Table.index("createdAt").pipe(
    Pg.Table.named("events_created_at_idx"),
    Pg.Table.using("btree")
  )
)

const eventKinds = Query.select({
  id: events.id,
  kind: Pg.Jsonb.text(events.payload, Pg.Jsonb.key("kind"))
}).pipe(Query.from(events))

Pg.Renderer.make().render(eventKinds)

export {};
