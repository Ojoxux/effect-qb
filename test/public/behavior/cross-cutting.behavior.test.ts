// @ts-nocheck
import { describe, expect, test } from "bun:test"

import * as Mysql from "#mysql"
import * as Postgres from "#postgres"
import * as Sqlite from "#sqlite"
import * as StdRoot from "#standard"

describe("cross-cutting statement behavior", () => {
  test("renders postgres truncate, merge, and transaction-control statements", () => {
    const users = StdRoot.Table.make("users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey),
      email: StdRoot.Column.text(),
      bio: StdRoot.Column.text().pipe(StdRoot.Column.nullable)
    })
    const incomingUsers = StdRoot.Table.make("incoming_users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey),
      email: StdRoot.Column.text(),
      bio: StdRoot.Column.text().pipe(StdRoot.Column.nullable)
    })

    const truncatePlan = StdRoot.Query.truncate(users, {
      restartIdentity: true,
      cascade: true
    })
    const mergePlan = StdRoot.Query.merge(users, incomingUsers, StdRoot.Query.eq(users.id, incomingUsers.id), {
      whenMatched: {
        update: {
          email: incomingUsers.email,
          bio: incomingUsers.bio
        }
      },
      whenNotMatched: {
        values: {
          id: incomingUsers.id,
          email: incomingUsers.email,
          bio: incomingUsers.bio
        }
      }
    })

    expect(Postgres.Renderer.make().render(truncatePlan).sql).toBe(
      'truncate table "users" restart identity cascade'
    )
    expect(Postgres.Renderer.make().render(mergePlan).sql).toBe(
      'merge into "users" using "incoming_users" on ("users"."id" = "incoming_users"."id") when matched then update set "email" = "incoming_users"."email", "bio" = "incoming_users"."bio" when not matched then insert ("id", "email", "bio") values ("incoming_users"."id", "incoming_users"."email", "incoming_users"."bio")'
    )
    expect(Postgres.Renderer.make().render(StdRoot.Query.transaction({
      isolationLevel: "serializable",
      readOnly: true
    })).sql).toBe("start transaction isolation level serializable, read only")
    expect(Postgres.Renderer.make().render(StdRoot.Query.commit()).sql).toBe("commit")
    expect(Postgres.Renderer.make().render(StdRoot.Query.rollback()).sql).toBe("rollback")
    expect(Postgres.Renderer.make().render(StdRoot.Query.savepoint("before_merge")).sql).toBe('savepoint "before_merge"')
    expect(Postgres.Renderer.make().render(StdRoot.Query.rollbackTo("before_merge")).sql).toBe('rollback to savepoint "before_merge"')
    expect(Postgres.Renderer.make().render(StdRoot.Query.releaseSavepoint("before_merge")).sql).toBe('release savepoint "before_merge"')
  })

  test("renders mysql truncate and transaction-control statements and rejects merge", () => {
    const users = StdRoot.Table.make("users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey),
      email: StdRoot.Column.text(),
      bio: StdRoot.Column.text().pipe(StdRoot.Column.nullable)
    })
    const incomingUsers = StdRoot.Table.make("incoming_users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey),
      email: StdRoot.Column.text(),
      bio: StdRoot.Column.text().pipe(StdRoot.Column.nullable)
    })

    const truncatePlan = StdRoot.Query.truncate(users)
    const unsupportedTruncatePlan = StdRoot.Query.truncate(users, {
      restartIdentity: true,
      cascade: true
    })
    const mergePlan = StdRoot.Query.merge(users, incomingUsers, StdRoot.Query.eq(users.id, incomingUsers.id), {
      whenMatched: {
        update: {
          email: incomingUsers.email
        }
      }
    })

    expect(Mysql.Renderer.make().render(truncatePlan).sql).toBe(
      "truncate table `users`"
    )
    expect(() => Mysql.Renderer.make().render(unsupportedTruncatePlan)).toThrow(
      "Unsupported mysql truncate options"
    )
    expect(Mysql.Renderer.make().render(StdRoot.Query.transaction({
      isolationLevel: "serializable",
      readOnly: true
    })).sql).toBe("start transaction isolation level serializable, read only")
    expect(Mysql.Renderer.make().render(StdRoot.Query.commit()).sql).toBe("commit")
    expect(Mysql.Renderer.make().render(StdRoot.Query.rollback()).sql).toBe("rollback")
    expect(Mysql.Renderer.make().render(StdRoot.Query.savepoint("before_merge")).sql).toBe("savepoint `before_merge`")
    expect(Mysql.Renderer.make().render(StdRoot.Query.rollbackTo("before_merge")).sql).toBe("rollback to savepoint `before_merge`")
    expect(Mysql.Renderer.make().render(StdRoot.Query.releaseSavepoint("before_merge")).sql).toBe("release savepoint `before_merge`")
    expect(() => Mysql.Renderer.make().render(mergePlan)).toThrow("Unsupported merge statement for mysql")
  })

  test("statement builders trust typed identifiers without renderer-time identifier validation", () => {
    const queryAst = Symbol.for("effect-qb/QueryAst")
    const users = StdRoot.Table.make("users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey)
    })

    const emptySavepointPlan = StdRoot.Query.savepoint("" as any)
    expect(Postgres.Renderer.make().render(emptySavepointPlan).sql).toBe('savepoint ""')

    const emptyRollbackToPlan = StdRoot.Query.rollbackTo("" as any)
    expect(Postgres.Renderer.make().render(emptyRollbackToPlan).sql).toBe('rollback to savepoint ""')

    const emptyCreateIndexPlan = StdRoot.Query.createIndex(users, "id", { name: "" } as any)
    expect(Postgres.Renderer.make().render(emptyCreateIndexPlan).sql).toBe('create index "" on "users" ("id")')

    const emptyDropIndexPlan = StdRoot.Query.dropIndex(users, "id", { name: "" } as any)
    expect(Postgres.Renderer.make().render(emptyDropIndexPlan).sql).toBe('drop index ""')

    const savepointPlan = StdRoot.Query.savepoint("before_merge")
    ;(savepointPlan as any)[queryAst].transaction.name = ""

    expect(Postgres.Renderer.make().render(savepointPlan).sql).toBe('savepoint ""')

    const createIndexPlan = StdRoot.Query.createIndex(users, "id")
    ;(createIndexPlan as any)[queryAst].ddl.name = ""

    expect(Postgres.Renderer.make().render(createIndexPlan).sql).toBe('create index "" on "users" ("id")')
  })

  test("from builders trust typed statement compatibility without runtime validation", () => {
    const users = StdRoot.Table.make("users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey)
    })

    const commitPlan = StdRoot.Query.commit().pipe(
      StdRoot.Query.from(users as any)
    )

    expect(Postgres.Renderer.make().render(commitPlan).sql).toBe("commit")
  })

  test("transaction builders trust typed clause kinds without renderer-time validation", () => {
    const queryAst = Symbol.for("effect-qb/QueryAst")

    const postgresPlan = StdRoot.Query.transaction()
    ;(postgresPlan as any)[queryAst].transaction.kind = "begin"
    expect(Postgres.Renderer.make().render(postgresPlan).sql).toBe(
      "start transaction"
    )

    const mysqlPlan = StdRoot.Query.transaction()
    ;(mysqlPlan as any)[queryAst].transaction.kind = "begin"
    expect(Mysql.Renderer.make().render(mysqlPlan).sql).toBe(
      "start transaction"
    )
  })

  test("query builders trust typed statement kinds without renderer-time validation", () => {
    const queryAst = Symbol.for("effect-qb/QueryAst")

    const postgresPlan = StdRoot.Query.transaction()
    ;(postgresPlan as any)[queryAst].kind = "vacuum"
    expect(Postgres.Renderer.make().render(postgresPlan).sql).toBe(
      "start transaction"
    )

    const mysqlPlan = StdRoot.Query.transaction()
    ;(mysqlPlan as any)[queryAst].kind = "vacuum"
    expect(Mysql.Renderer.make().render(mysqlPlan).sql).toBe(
      "start transaction"
    )
  })

  test("truncate builders trust typed clause kinds without renderer-time validation", () => {
    const queryAst = Symbol.for("effect-qb/QueryAst")

    const postgresUsers = StdRoot.Table.make("users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey)
    })
    const postgresPlan = StdRoot.Query.truncate(postgresUsers)
    ;(postgresPlan as any)[queryAst].truncate.kind = "dropTable"
    expect(Postgres.Renderer.make().render(postgresPlan).sql).toBe(
      'truncate table "users"'
    )

    const mysqlUsers = StdRoot.Table.make("users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey)
    })
    const mysqlPlan = StdRoot.Query.truncate(mysqlUsers)
    ;(mysqlPlan as any)[queryAst].truncate.kind = "dropTable"
    expect(Mysql.Renderer.make().render(mysqlPlan).sql).toBe(
      "truncate table `users`"
    )
  })

  test("postgres merge builders trust typed payload and action kinds without renderer-time validation", () => {
    const queryAst = Symbol.for("effect-qb/QueryAst")
    const users = StdRoot.Table.make("users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey),
      email: StdRoot.Column.text()
    })
    const incomingUsers = StdRoot.Table.make("incoming_users", {
      id: StdRoot.Column.uuid().pipe(StdRoot.Column.primaryKey),
      email: StdRoot.Column.text()
    })

    const mergePayloadPlan = StdRoot.Query.merge(
      users,
      incomingUsers,
      StdRoot.Query.eq(users.id, incomingUsers.id),
      {
        whenMatched: {
          update: {
            email: incomingUsers.email
          }
        }
      }
    )
    ;(mergePayloadPlan as any)[queryAst].merge.kind = "upsert"
    expect(Postgres.Renderer.make().render(mergePayloadPlan).sql).toBe(
      'merge into "users" using "incoming_users" on ("users"."id" = "incoming_users"."id") when matched then update set "email" = "incoming_users"."email"'
    )

    const matchedPlan = StdRoot.Query.merge(
      users,
      incomingUsers,
      StdRoot.Query.eq(users.id, incomingUsers.id),
      {
        whenMatched: {
          update: {
            email: incomingUsers.email
          }
        }
      }
    )
    ;(matchedPlan as any)[queryAst].merge.whenMatched.kind = "replace"
    expect(Postgres.Renderer.make().render(matchedPlan).sql).toBe(
      'merge into "users" using "incoming_users" on ("users"."id" = "incoming_users"."id") when matched then update set "email" = "incoming_users"."email"'
    )

    const notMatchedPlan = StdRoot.Query.merge(
      users,
      incomingUsers,
      StdRoot.Query.eq(users.id, incomingUsers.id),
      {
        whenNotMatched: {
          values: {
            id: incomingUsers.id,
            email: incomingUsers.email
          }
        }
      }
    )
    ;(notMatchedPlan as any)[queryAst].merge.whenNotMatched.kind = "replace"
    expect(Postgres.Renderer.make().render(notMatchedPlan).sql).toBe(
      'merge into "users" using "incoming_users" on ("users"."id" = "incoming_users"."id") when not matched then insert ("id", "email") values ("incoming_users"."id", "incoming_users"."email")'
    )
  })

})
