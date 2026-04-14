import { Executor, Column as C, Query as Q, Table } from "effect-qb/postgres"

const users = Table.make("users", {
  id: C.uuid().pipe(C.primaryKey),
  email: C.text()
})

const readPlan = Q.select({
  id: users.id,
  email: users.email
}).pipe(
  Q.from(users)
)

const insertPlan = Q.insert(users, {
  id: "11111111-1111-1111-1111-111111111111",
  email: "alice@example.com"
})

const readStream = Executor.make().stream(readPlan)
void readStream

// @ts-expect-error write plans are not streamable
Executor.make().stream(insertPlan)
