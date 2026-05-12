import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"

import * as Mysql from "effect-qb/mysql"
import * as Pg from "effect-qb/postgres"

type Assert<T extends true> = T
type IsEqual<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends
    (<Value>() => Value extends Right ? 1 : 2)
    ? true
    : false

const pgMapping: Pg.Scalar.DriverValueMapping = {
  fromDriver: (value) => value,
  toDriver: (value) => value,
  selectSql: (sql) => sql,
  jsonSelectSql: (sql) => sql
}

const invalidPgMapping: Pg.Scalar.DriverValueMapping = {
  // @ts-expect-error driver value mappings should expose only driver-boundary hooks
  encode: (value: unknown) => value
}

void invalidPgMapping

const mappedTextType = Pg.Type.driverValueMapping(Pg.Type.text(), pgMapping)
type _AssertMappedTextKind = Assert<IsEqual<typeof mappedTextType.kind, "text">>
type _AssertMappedTextDialect = Assert<IsEqual<typeof mappedTextType.dialect, "postgres">>

const mappedTextColumn = Pg.Column.custom(Schema.String, mappedTextType)
const mappedTextCast = Pg.Cast.to("mapped", mappedTextType)
const mappedTextRuntime: Pg.Scalar.RuntimeOf<typeof mappedTextCast> = "mapped"

void mappedTextColumn
void mappedTextRuntime

const pgEvents = Pg.Table.make("driver_value_mapping_type_events", {
  id: Pg.Column.text().pipe(
    Pg.Column.primaryKey,
    Pg.Column.driverValueMapping(pgMapping)
  ),
  happenedOn: Pg.Column.date().pipe(
    Pg.Column.schema(Schema.DateFromString),
    Pg.Column.nullable,
    Pg.Column.driverValueMapping(pgMapping)
  ),
  note: Pg.Column.text().pipe(Pg.Column.driverValueMapping(pgMapping))
})

const pgPlan = Pg.Query.select({
  id: pgEvents.id,
  happenedOn: pgEvents.happenedOn,
  note: pgEvents.note
}).pipe(Pg.Query.from(pgEvents))

type PgRow = Pg.Query.ResultRow<typeof pgPlan>
const pgId: PgRow["id"] = "event-id"
const pgHappenedOn: PgRow["happenedOn"] = new Date()
const pgHappenedOnNull: PgRow["happenedOn"] = null
const pgNote: PgRow["note"] = "note"

// @ts-expect-error driver mapping must not erase the DateFromString column schema
const pgHappenedOnEncoded: PgRow["happenedOn"] = "2026-03-18"

Pg.Query.insert(pgEvents, {
  id: "event-id",
  happenedOn: new Date(),
  note: "note"
})

Pg.Query.insert(pgEvents, {
  id: "event-id",
  // @ts-expect-error insert input must stay the schema type, not the encoded driver type
  happenedOn: "2026-03-18",
  note: "note"
})

Pg.Renderer.make({
  valueMappings: {
    text: pgMapping,
    string: pgMapping
  }
})

Pg.Executor.make({
  valueMappings: {
    text: pgMapping
  },
  driver: Pg.Executor.driver(() => Effect.succeed([]))
})

void pgId
void pgHappenedOn
void pgHappenedOnNull
void pgHappenedOnEncoded
void pgNote

const mysqlMapping: Mysql.Scalar.DriverValueMapping = {
  fromDriver: (value) => value,
  toDriver: (value) => value
}

const mysqlEvents = Mysql.Table.make("driver_value_mapping_type_events", {
  id: Mysql.Column.text().pipe(
    Mysql.Column.primaryKey,
    Mysql.Column.driverValueMapping(mysqlMapping)
  ),
  happenedOn: Mysql.Column.date().pipe(
    Mysql.Column.schema(Schema.DateFromString),
    Mysql.Column.nullable,
    Mysql.Column.driverValueMapping(mysqlMapping)
  )
})

const mysqlPlan = Mysql.Query.select({
  id: mysqlEvents.id,
  happenedOn: mysqlEvents.happenedOn
}).pipe(Mysql.Query.from(mysqlEvents))

type MysqlRow = Mysql.Query.ResultRow<typeof mysqlPlan>
const mysqlId: MysqlRow["id"] = "event-id"
const mysqlHappenedOn: MysqlRow["happenedOn"] = new Date()
const mysqlHappenedOnNull: MysqlRow["happenedOn"] = null

// @ts-expect-error MySQL driver mapping must not erase the DateFromString column schema
const mysqlHappenedOnEncoded: MysqlRow["happenedOn"] = "2026-03-18"

Mysql.Query.insert(mysqlEvents, {
  id: "event-id",
  happenedOn: new Date()
})

Mysql.Query.insert(mysqlEvents, {
  id: "event-id",
  // @ts-expect-error MySQL insert input must stay the schema type, not the encoded driver type
  happenedOn: "2026-03-18"
})

Mysql.Renderer.make({
  valueMappings: {
    text: mysqlMapping,
    string: mysqlMapping
  }
})

Mysql.Executor.make({
  valueMappings: {
    text: mysqlMapping
  },
  driver: Mysql.Executor.driver(() => Effect.succeed([]))
})

void mysqlId
void mysqlHappenedOn
void mysqlHappenedOnNull
void mysqlHappenedOnEncoded
