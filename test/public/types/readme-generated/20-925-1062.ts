// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 925-943, 949-960, 968-978, 986-990, 996-1014, 1022-1038, 1044-1062

// README.md:925-943
import { Column as C, Query as Q, Table } from "effect-qb/postgres"

const users = Table.make("users", {
  id: C.text().pipe(C.primaryKey),
  email: C.text()
})

const posts = Table.make("posts", {
  id: C.text().pipe(C.primaryKey),
  userId: C.text(),
  title: C.text()
})

const insertUser = Q.insert(users, {
  id: "user-1",
  email: "alice@example.com"
})

{
  // README.md:949-960
  const pendingUsers = Q.values([
    { id: "user-1", email: "alice@example.com" },
    { id: "user-2", email: "bob@example.com" }
  ]).pipe(
    Q.as("pending_users")
  )

  const insertMany = Q.insert(users).pipe(
    Q.from(pendingUsers)
  )
}

{
  // README.md:968-978
  const updateUsers = Q.update(users, {
    email: "author@example.com"
  }).pipe(
    Q.from(posts),
    Q.where(Q.and(
      Q.eq(posts.userId, users.id),
      Q.eq(posts.title, "hello")
    ))
  )
}

{
  // README.md:986-990
  const deleteUser = Q.delete(users).pipe(
    Q.where(Q.eq(users.id, "user-1"))
  )
}

{
  // README.md:996-1014
  const insertOrIgnore = Q.insert(users, {
    id: "user-1",
    email: "alice@example.com"
  }).pipe(
    Q.onConflict(["id"])
  )

  const upsertUser = Q.insert(users, {
    id: "user-1",
    email: "alice@example.com"
  }).pipe(
    Q.onConflict(["id"], {
      update: {
        email: Q.excluded(users.email)
      }
    })
  )
}

{
  // README.md:1022-1038
  const insertedUser = Q.insert(users, {
    id: "user-1",
    email: "alice@example.com"
  }).pipe(
    Q.returning({
      id: users.id,
      email: users.email
    })
  )

  type InsertedUserRow = Q.ResultRow<typeof insertedUser>
  // {
  //   id: string
  //   email: string
  // }
}

{
  // README.md:1044-1062
  const insertedUsers = Q.insert(users, {
    id: "user-1",
    email: "alice@example.com"
  }).pipe(
    Q.returning({
      id: users.id,
      email: users.email
    }),
    Q.with("inserted_users")
  )

  const insertedUsersPlan = Q.select({
    id: insertedUsers.id,
    email: insertedUsers.email
  }).pipe(
    Q.from(insertedUsers)
  )
}

export {};
