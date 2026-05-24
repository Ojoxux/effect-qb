import * as Std from "effect-qb"
import { Standard } from "effect-qb"

const users = Std.Table.make("users", {
  id: Std.Column.uuid().pipe(Std.Column.primaryKey),
  email: Std.Column.text()
})

const rootPlan = Std.Query.select({
  id: users.id,
  email: Std.Function.lower(users.email)
}).pipe(
  Std.Query.from(users)
)

Std.Renderer.make().render(rootPlan)

const standardUsers = Standard.Table.make("standard_users", {
  id: Standard.Column.uuid().pipe(Standard.Column.primaryKey)
})

const standardPlan = Standard.Query.select({
  id: standardUsers.id
}).pipe(
  Standard.Query.from(standardUsers)
)

Standard.Renderer.make().render(standardPlan)
