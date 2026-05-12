import { Column as C, Query as Q, Renderer, Table } from "effect-qb/postgres"

const users = Table.make("users", {
  id: C.uuid().pipe(C.primaryKey),
  email: C.text()
})

const rendered = Renderer.make().render(Q.select({
  id: users.id,
  email: users.email
}).pipe(
  Q.from(users)
))

type RenderedRow = Renderer.RowOf<typeof rendered>

const validRenderedRow: RenderedRow = {
  id: "11111111-1111-1111-1111-111111111111",
  email: "alice@example.com"
}

// @ts-expect-error Renderer.RowOf should require every selected projection.
const missingRenderedField: RenderedRow = {
  id: "11111111-1111-1111-1111-111111111111"
}

// @ts-expect-error Renderer.RowOf should preserve the selected projection runtime types.
const wrongRenderedFieldType: RenderedRow = {
  id: 123,
  email: "alice@example.com"
}

void validRenderedRow
void missingRenderedField
void wrongRenderedFieldType
