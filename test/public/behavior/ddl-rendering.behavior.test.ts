// @ts-nocheck
import { describe, expect, test } from "bun:test"

import * as Mysql from "#mysql"
import * as Postgres from "#postgres"

describe("ddl rendering behavior", () => {
  test("postgres check constraints render row-local column references", () => {
    const usersBase = Postgres.Table.make("users", {
      id: Postgres.Column.uuid().pipe(Postgres.Column.primaryKey),
      email: Postgres.Column.text()
    })
    const users = usersBase.pipe(
      Postgres.Table.check("email_not_empty", Postgres.Query.neq(usersBase.email, ""))
    )

    const rendered = Postgres.Renderer.make().render(Postgres.Query.createTable(users))

    expect(rendered.sql).toBe(
      'create table "public"."users" ("id" uuid not null, "email" text not null, primary key ("id"), constraint "email_not_empty" check (("email" <> $1)))'
    )
    expect(rendered.params).toEqual([""])
  })

  test("mysql check constraints render row-local column references", () => {
    const usersBase = Mysql.Table.make("users", {
      id: Mysql.Column.uuid().pipe(Mysql.Column.primaryKey),
      email: Mysql.Column.text()
    })
    const users = usersBase.pipe(
      Mysql.Table.check("email_not_empty", Mysql.Query.neq(usersBase.email, ""))
    )

    const rendered = Mysql.Renderer.make().render(Mysql.Query.createTable(users))

    expect(rendered.sql).toBe(
      "create table `users` (`id` char(36) not null, `email` text not null, primary key (`id`), constraint `email_not_empty` check ((`email` <> ?)))"
    )
    expect(rendered.params).toEqual([""])
  })
})
