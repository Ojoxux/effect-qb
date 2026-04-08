// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 165-178, 182-189

// README.md:165-178
import * as Schema from "effect/Schema"
import * as Pg from "effect-qb/postgres"
import { Column as C, Table } from "effect-qb/postgres"

const users = Table.make("users", {
  id: C.uuid().pipe(C.primaryKey),
  email: C.text(),
  profile: C.json(Schema.Struct({
    displayName: Schema.String,
    bio: Schema.NullOr(Schema.String)
  }))
})

{
  // README.md:182-189
  const analytics = Pg.schema("analytics")

  const events = analytics.table("events", {
    id: C.uuid().pipe(C.primaryKey),
    userId: C.uuid()
  })
}

export {};
