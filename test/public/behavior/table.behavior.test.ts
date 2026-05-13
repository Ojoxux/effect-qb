import { describe, expect, test } from "bun:test"
import * as Schema from "effect/Schema"

import * as Mysql from "#mysql"
import * as Sqlite from "#sqlite"
import { Column as C, Scalar as Expression, Function as F, Query as Q, Table } from "#postgres"
import { unsafeAny, unsafeNever } from "../../helpers/unsafe.ts"

describe("table behavior", () => {
  test("rejects conflicting inline and table-level primary keys", () => {
    expect(() => Table.make("memberships", {
      orgId: C.uuid().pipe(C.primaryKey),
      userId: C.uuid(),
      role: C.text()
    }).pipe(
      Table.primaryKey(["orgId", "userId"] as const)
    )).toThrow("Inline primary keys conflict with table-level primary key declaration")
  })

  test("rejects multiple table-level primary key declarations", () => {
    expect(() => Table.make("memberships", {
      orgId: C.uuid(),
      userId: C.uuid()
    }).pipe(
      Table.primaryKey("orgId"),
      Table.primaryKey("userId")
    )).toThrow("Only one primary key declaration is allowed")
  })

  test("supports composite primary keys and preserves declared column order", () => {
    const memberships = Table.make("memberships", {
      orgId: C.uuid(),
      userId: C.uuid(),
      role: C.text()
    }).pipe(
      Table.primaryKey(["orgId", "userId"] as const),
      Table.index(["role", "orgId"] as const)
    )

    expect(unsafeAny(memberships)[Table.TypeId].primaryKey).toEqual(["orgId", "userId"])
    expect(unsafeAny(memberships)[Table.OptionsSymbol]).toEqual([
      { kind: "primaryKey", columns: ["orgId", "userId"] },
      { kind: "index", columns: ["role", "orgId"] }
    ])
    expect(Schema.decodeUnknownSync(Table.updateSchema(memberships))({
      role: "admin",
      orgId: "ignored"
    })).toEqual({
      role: "admin"
    })
  })

  test("rejects nullable columns in composite primary keys", () => {
    expect(() => Table.primaryKey(["orgId", "slug"] as const)(
      unsafeNever(Table.make("memberships", {
        orgId: C.uuid(),
        slug: C.text().pipe(C.nullable)
      }))
    )).toThrow("Primary key column 'slug' cannot be nullable")
  })

  test("aliasing an alias preserves the physical base table and normalized options", () => {
    const users = Table.make("users", {
      id: C.uuid().pipe(C.primaryKey),
      slug: C.text().pipe(C.unique),
      email: C.text()
    }).pipe(
      Table.index(["email", "slug"] as const)
    )

    const onceAliased = Table.alias(users, "u1")
    const twiceAliased = unsafeAny(Table.alias(unsafeNever(onceAliased), "u2"))

    expect(twiceAliased[Table.TypeId]).toMatchObject({
      name: "u2",
      baseName: "users",
      kind: "alias",
      primaryKey: ["id"]
    })
    expect(unsafeAny(twiceAliased)[Table.OptionsSymbol]).toEqual(unsafeAny(users)[Table.OptionsSymbol])
  })

  test("schema helpers and legacy schema facade work for aliases", () => {
    const users = Table.make("users", {
      id: C.uuid().pipe(C.primaryKey),
      email: C.text(),
      bio: C.text().pipe(C.nullable)
    })
    const aliasedUsers = Table.alias(users, "u")
    const id = "550e8400-e29b-41d4-a716-446655440000"

    const select = Table.selectSchema(aliasedUsers)
    expect(aliasedUsers.schemas.select).toBe(select)
    expect(Table.insertSchema(aliasedUsers)).toBe(aliasedUsers.schemas.insert)
    expect(Table.updateSchema(aliasedUsers)).toBe(aliasedUsers.schemas.update)
    expect(Schema.decodeUnknownSync(select)({
      id,
      email: "alice@example.com",
      bio: null
    })).toEqual({
      id,
      email: "alice@example.com",
      bio: null
    })
  })

  test("factory and class tables derive the same runtime schemas for equivalent definitions", () => {
    const factoryUsers = Table.make("users", {
      id: C.uuid().pipe(C.primaryKey, C.generated(Q.literal("generated-user-id"))),
      email: C.text().pipe(C.unique),
      bio: C.text().pipe(C.nullable),
      createdAt: C.timestamp().pipe(C.default(F.localTimestamp()))
    }).pipe(
      Table.index("email")
    )

    class ClassUsers extends Table.Class<ClassUsers>("users")({
      id: C.uuid().pipe(C.primaryKey, C.generated(Q.literal("generated-user-id"))),
      email: C.text().pipe(C.unique),
      bio: C.text().pipe(C.nullable),
      createdAt: C.timestamp().pipe(C.default(F.localTimestamp()))
    }) {
      static readonly [Table.options] = [Table.index("email")]
    }

    const input = {
      email: "alice@example.com",
      bio: null
    }

    expect(Schema.decodeUnknownSync(Table.insertSchema(factoryUsers))(input)).toEqual(
      Schema.decodeUnknownSync(Table.insertSchema(ClassUsers))(input)
    )
    expect(Schema.decodeUnknownSync(Table.updateSchema(factoryUsers))({
      bio: null
    })).toEqual(
      Schema.decodeUnknownSync(Table.updateSchema(ClassUsers))({
        bio: null
      })
    )
    expect(unsafeAny(factoryUsers)[Table.OptionsSymbol]).toEqual(unsafeAny(ClassUsers)[Table.OptionsSymbol])
  })

  test("mysql and sqlite table modules expose schema helpers", () => {
    const mysqlUsers = Mysql.Table.make("mysql_users", {
      id: Mysql.Column.uuid().pipe(Mysql.Column.primaryKey),
      email: Mysql.Column.text(),
      bio: Mysql.Column.text().pipe(Mysql.Column.nullable)
    })
    const sqliteUsers = Sqlite.Table.make("sqlite_users", {
      id: Sqlite.Column.text().pipe(Sqlite.Column.primaryKey),
      email: Sqlite.Column.text(),
      bio: Sqlite.Column.text().pipe(Sqlite.Column.nullable)
    })
    const id = "550e8400-e29b-41d4-a716-446655440000"

    expect(Schema.decodeUnknownSync(Mysql.Table.selectSchema(mysqlUsers))({
      id,
      email: "mysql@example.com",
      bio: null
    })).toEqual({
      id,
      email: "mysql@example.com",
      bio: null
    })
    expect(Schema.decodeUnknownSync(Mysql.Table.insertSchema(mysqlUsers))({
      id,
      email: "mysql@example.com"
    })).toEqual({
      id,
      email: "mysql@example.com"
    })
    expect(Schema.decodeUnknownSync(Mysql.Table.updateSchema(mysqlUsers))({
      id,
      bio: null
    })).toEqual({
      bio: null
    })

    expect(Schema.decodeUnknownSync(Sqlite.Table.selectSchema(sqliteUsers))({
      id: "sqlite-user-id",
      email: "sqlite@example.com",
      bio: null
    })).toEqual({
      id: "sqlite-user-id",
      email: "sqlite@example.com",
      bio: null
    })
    expect(Schema.decodeUnknownSync(Sqlite.Table.insertSchema(sqliteUsers))({
      id: "sqlite-user-id",
      email: "sqlite@example.com"
    })).toEqual({
      id: "sqlite-user-id",
      email: "sqlite@example.com"
    })
    expect(Schema.decodeUnknownSync(Sqlite.Table.updateSchema(sqliteUsers))({
      id: "ignored",
      bio: null
    })).toEqual({
      bio: null
    })
  })

  test("column schema pipes feed derived table schemas", () => {
    const events = Table.make("events", {
      happenedOn: C.date().pipe(C.schema(Schema.DateFromString))
    })

    const decoded = Schema.decodeUnknownSync(Table.selectSchema(events))({
      happenedOn: "2026-03-20"
    })

    expect(decoded.happenedOn).toBeInstanceOf(Date)
    expect(decoded.happenedOn.toISOString()).toBe("2026-03-20T00:00:00.000Z")
  })

  test("column brand can be applied inline before table binding", () => {
    const accounts = Table.make("inline_accounts", {
      id: C.uuid().pipe(C.primaryKey, C.brand),
      nickname: C.text().pipe(C.nullable, C.brand)
    })

    expect(Schema.decodeUnknownSync(Table.selectSchema(accounts))({
      id: "550e8400-e29b-41d4-a716-446655440000",
      nickname: null
    })).toEqual(unsafeAny({
      id: "550e8400-e29b-41d4-a716-446655440000",
      nickname: null
    }))
  })

  test("brands derived from aliases stay plain strings at runtime", () => {
    const users = Table.make("users", {
      id: C.uuid().pipe(C.primaryKey),
      email: C.text()
    })
    const aliasedUsers = Table.alias(users, "u")
    const id = "550e8400-e29b-41d4-a716-446655440000"

    expect(Schema.decodeUnknownSync(unsafeAny(users.id.pipe(C.brand).schema))(id)).toBe(id)
    expect(Schema.decodeUnknownSync(unsafeAny(aliasedUsers.id.pipe(C.brand).schema))(id)).toBe(id)
  })

  test("array columns can opt into nullable elements", () => {
    const strict = Table.make("strict_events", {
      tags: C.text().pipe(C.array())
    })
    const relaxed = Table.make("relaxed_events", {
      tags: C.text().pipe(C.array({ nullableElements: true }))
    })

    expect(() => Schema.decodeUnknownSync(Table.selectSchema(strict))({
      tags: ["alpha", null]
    })).toThrow()

    expect(Schema.decodeUnknownSync(Table.selectSchema(relaxed))({
      tags: ["alpha", null]
    })).toEqual({
      tags: ["alpha", null]
    })
  })
})
