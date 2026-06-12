import type * as Expression from "../internal/scalar.js"
import type { NonEmptyStringInput } from "../internal/table-options.js"
import { sqliteDatatypes } from "./datatypes/index.js"

type SqliteSpecificDatatypes = Pick<typeof sqliteDatatypes,
  | "clob"
  | "double"
>

type SqliteTypeNamespace = SqliteSpecificDatatypes & {
  readonly custom: <Kind extends string>(kind: NonEmptyStringInput<Kind>) => Expression.DbType.Base<"sqlite", Kind>
  readonly driverValueMapping: <Db extends Expression.DbType.Any>(
    dbType: Db,
    mapping: Expression.DriverValueMapping
  ) => Db
}

const custom = <Kind extends string>(
  kind: NonEmptyStringInput<Kind>
): Expression.DbType.Base<"sqlite", Kind> => ({
  dialect: "sqlite",
  kind: kind as Kind
})

const driverValueMapping = <Db extends Expression.DbType.Any>(
  dbType: Db,
  mapping: Expression.DriverValueMapping
): Db => ({
  ...dbType,
  driverValueMapping: mapping
})

/** SQLite-only database-type constructors for casts and typed column references. */
export const type: SqliteTypeNamespace = {
  clob: sqliteDatatypes.clob,
  double: sqliteDatatypes.double,
  custom,
  driverValueMapping
}
