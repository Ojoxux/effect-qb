// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 1044-1067

// README.md:1044-1067
import * as Schema from "effect/Schema"
import { Column, Query, Table } from "effect-qb"
import * as Sq from "effect-qb/sqlite"

const docs = Table.make("docs", {
  id: Column.text().pipe(Column.primaryKey),
  payload: Column.json(Schema.Struct({
    profile: Schema.Struct({
      city: Schema.String
    })
  }))
})

const readDocs = Query.select({
  id: docs.id,
  city: Sq.Json.text(
    docs.payload,
    Sq.Json.path(Sq.Json.key("profile"), Sq.Json.key("city"))
  )
}).pipe(Query.from(docs))

Sq.Renderer.make().render(readDocs)

export {};
