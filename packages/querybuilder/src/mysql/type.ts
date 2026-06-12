import type * as Expression from "../internal/scalar.js"
import type { NonEmptyStringInput } from "../internal/table-options.js"
import { mysqlDatatypes } from "./datatypes/index.js"

type MysqlSpecificDatatypes = Pick<typeof mysqlDatatypes,
  | "tinytext"
  | "mediumtext"
  | "longtext"
  | "tinyint"
  | "smallint"
  | "mediumint"
  | "dec"
  | "fixed"
  | "float"
  | "double"
  | "bool"
  | "bit"
  | "year"
  | "binary"
  | "varbinary"
  | "tinyblob"
  | "mediumblob"
  | "longblob"
  | "geometry"
  | "point"
  | "linestring"
  | "polygon"
  | "multipoint"
  | "multilinestring"
  | "multipolygon"
  | "geometrycollection"
>

type MysqlTypeNamespace = MysqlSpecificDatatypes & {
  readonly enum: <Kind extends string>(kind: NonEmptyStringInput<Kind>) => Expression.DbType.Enum<"mysql", Kind>
  readonly set: <Kind extends string>(kind: NonEmptyStringInput<Kind>) => Expression.DbType.Set<"mysql", Kind>
  readonly custom: <Kind extends string>(kind: NonEmptyStringInput<Kind>) => Expression.DbType.Base<"mysql", Kind>
  readonly driverValueMapping: <Db extends Expression.DbType.Any>(
    dbType: Db,
    mapping: Expression.DriverValueMapping
  ) => Db
}

const enum_ = <Kind extends string>(
  kind: NonEmptyStringInput<Kind>
): Expression.DbType.Enum<"mysql", Kind> => ({
  dialect: "mysql",
  kind: kind as Kind,
  variant: "enum"
})

const set = <Kind extends string>(
  kind: NonEmptyStringInput<Kind>
): Expression.DbType.Set<"mysql", Kind> => ({
  dialect: "mysql",
  kind: kind as Kind,
  variant: "set"
})

const custom = <Kind extends string>(
  kind: NonEmptyStringInput<Kind>
): Expression.DbType.Base<"mysql", Kind> => ({
  dialect: "mysql",
  kind: kind as Kind
})

const driverValueMapping = <Db extends Expression.DbType.Any>(
  dbType: Db,
  mapping: Expression.DriverValueMapping
): Db => ({
  ...dbType,
  driverValueMapping: mapping
})

/** MySQL-only database-type constructors for casts and typed column references. */
export const type: MysqlTypeNamespace = {
  tinytext: mysqlDatatypes.tinytext,
  mediumtext: mysqlDatatypes.mediumtext,
  longtext: mysqlDatatypes.longtext,
  tinyint: mysqlDatatypes.tinyint,
  smallint: mysqlDatatypes.smallint,
  mediumint: mysqlDatatypes.mediumint,
  dec: mysqlDatatypes.dec,
  fixed: mysqlDatatypes.fixed,
  float: mysqlDatatypes.float,
  double: mysqlDatatypes.double,
  bool: mysqlDatatypes.bool,
  bit: mysqlDatatypes.bit,
  year: mysqlDatatypes.year,
  binary: mysqlDatatypes.binary,
  varbinary: mysqlDatatypes.varbinary,
  tinyblob: mysqlDatatypes.tinyblob,
  mediumblob: mysqlDatatypes.mediumblob,
  longblob: mysqlDatatypes.longblob,
  geometry: mysqlDatatypes.geometry,
  point: mysqlDatatypes.point,
  linestring: mysqlDatatypes.linestring,
  polygon: mysqlDatatypes.polygon,
  multipoint: mysqlDatatypes.multipoint,
  multilinestring: mysqlDatatypes.multilinestring,
  multipolygon: mysqlDatatypes.multipolygon,
  geometrycollection: mysqlDatatypes.geometrycollection,
  enum: enum_,
  set,
  custom,
  driverValueMapping
}
