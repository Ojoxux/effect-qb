import type * as Expression from "../internal/scalar.js"
import type { NonEmptyStringInput } from "../internal/table-options.js"
import { postgresDatatypes } from "./datatypes/index.js"

type PostgresSpecificDatatypes = Pick<typeof postgresDatatypes,
  | "int2"
  | "int4"
  | "int8"
  | "float4"
  | "float8"
  | "money"
  | "bool"
  | "timetz"
  | "timestamptz"
  | "interval"
  | "bytea"
  | "citext"
  | "name"
  | "jsonb"
  | "xml"
  | "bit"
  | "varbit"
  | "oid"
  | "xid"
  | "xid8"
  | "cid"
  | "tid"
  | "regclass"
  | "regtype"
  | "regproc"
  | "regprocedure"
  | "regoper"
  | "regoperator"
  | "regconfig"
  | "regdictionary"
  | "pg_lsn"
  | "txid_snapshot"
  | "inet"
  | "cidr"
  | "macaddr"
  | "macaddr8"
  | "point"
  | "line"
  | "lseg"
  | "box"
  | "path"
  | "polygon"
  | "circle"
  | "tsvector"
  | "tsquery"
  | "int4range"
  | "int8range"
  | "numrange"
  | "tsrange"
  | "tstzrange"
  | "daterange"
  | "int4multirange"
  | "int8multirange"
  | "nummultirange"
  | "tsmultirange"
  | "tstzmultirange"
  | "datemultirange"
>

type PostgresTypeNamespace = PostgresSpecificDatatypes & {
  readonly array: <Element extends Expression.DbType.Any>(
    element: Element
  ) => Expression.DbType.Array<"postgres", Element, `${Element["kind"]}[]`>
  readonly range: <Kind extends string, Subtype extends Expression.DbType.Any>(
    kind: NonEmptyStringInput<Kind>,
    subtype: Subtype
  ) => Expression.DbType.Range<"postgres", Subtype, Kind>
  readonly multirange: <Kind extends string, Subtype extends Expression.DbType.Any>(
    kind: NonEmptyStringInput<Kind>,
    subtype: Subtype
  ) => Expression.DbType.Multirange<"postgres", Subtype, Kind>
  readonly record: <Kind extends string, Fields extends Record<string, Expression.DbType.Any>>(
    kind: NonEmptyStringInput<Kind>,
    fields: Fields
  ) => Expression.DbType.Composite<"postgres", Fields, Kind>
  readonly domain: <Kind extends string, Base extends Expression.DbType.Any>(
    kind: NonEmptyStringInput<Kind>,
    base: Base
  ) => Expression.DbType.Domain<"postgres", Base, Kind>
  readonly enum: <Kind extends string>(kind: NonEmptyStringInput<Kind>) => Expression.DbType.Enum<"postgres", Kind>
  readonly custom: <Kind extends string>(kind: NonEmptyStringInput<Kind>) => Expression.DbType.Base<"postgres", Kind>
  readonly driverValueMapping: <Db extends Expression.DbType.Any>(
    dbType: Db,
    mapping: Expression.DriverValueMapping
  ) => Db
}

const array = <Element extends Expression.DbType.Any>(
  element: Element
): Expression.DbType.Array<"postgres", Element, `${Element["kind"]}[]`> => ({
  dialect: "postgres",
  kind: `${element.kind}[]`,
  element
})

const range = <Kind extends string, Subtype extends Expression.DbType.Any>(
  kind: NonEmptyStringInput<Kind>,
  subtype: Subtype
): Expression.DbType.Range<"postgres", Subtype, Kind> => ({
  dialect: "postgres",
  kind: kind as Kind,
  subtype
})

const multirange = <Kind extends string, Subtype extends Expression.DbType.Any>(
  kind: NonEmptyStringInput<Kind>,
  subtype: Subtype
): Expression.DbType.Multirange<"postgres", Subtype, Kind> => ({
  dialect: "postgres",
  kind: kind as Kind,
  subtype
})

const record = <Kind extends string, Fields extends Record<string, Expression.DbType.Any>>(
  kind: NonEmptyStringInput<Kind>,
  fields: Fields
): Expression.DbType.Composite<"postgres", Fields, Kind> => ({
  dialect: "postgres",
  kind: kind as Kind,
  fields
})

const domain = <Kind extends string, Base extends Expression.DbType.Any>(
  kind: NonEmptyStringInput<Kind>,
  base: Base
): Expression.DbType.Domain<"postgres", Base, Kind> => ({
  dialect: "postgres",
  kind: kind as Kind,
  base
})

const enum_ = <Kind extends string>(
  kind: NonEmptyStringInput<Kind>
): Expression.DbType.Enum<"postgres", Kind> => ({
  dialect: "postgres",
  kind: kind as Kind,
  variant: "enum"
})

const custom = <Kind extends string>(
  kind: NonEmptyStringInput<Kind>
): Expression.DbType.Base<"postgres", Kind> => ({
  dialect: "postgres",
  kind: kind as Kind
})

const driverValueMapping = <Db extends Expression.DbType.Any>(
  dbType: Db,
  mapping: Expression.DriverValueMapping
): Db => ({
  ...dbType,
  driverValueMapping: mapping
})

/** Postgres database-type constructors for casts and typed column references. */
export const type: PostgresTypeNamespace = {
  int2: postgresDatatypes.int2,
  int4: postgresDatatypes.int4,
  int8: postgresDatatypes.int8,
  float4: postgresDatatypes.float4,
  float8: postgresDatatypes.float8,
  money: postgresDatatypes.money,
  bool: postgresDatatypes.bool,
  timetz: postgresDatatypes.timetz,
  timestamptz: postgresDatatypes.timestamptz,
  interval: postgresDatatypes.interval,
  bytea: postgresDatatypes.bytea,
  citext: postgresDatatypes.citext,
  name: postgresDatatypes.name,
  jsonb: postgresDatatypes.jsonb,
  xml: postgresDatatypes.xml,
  bit: postgresDatatypes.bit,
  varbit: postgresDatatypes.varbit,
  oid: postgresDatatypes.oid,
  xid: postgresDatatypes.xid,
  xid8: postgresDatatypes.xid8,
  cid: postgresDatatypes.cid,
  tid: postgresDatatypes.tid,
  regclass: postgresDatatypes.regclass,
  regtype: postgresDatatypes.regtype,
  regproc: postgresDatatypes.regproc,
  regprocedure: postgresDatatypes.regprocedure,
  regoper: postgresDatatypes.regoper,
  regoperator: postgresDatatypes.regoperator,
  regconfig: postgresDatatypes.regconfig,
  regdictionary: postgresDatatypes.regdictionary,
  pg_lsn: postgresDatatypes.pg_lsn,
  txid_snapshot: postgresDatatypes.txid_snapshot,
  inet: postgresDatatypes.inet,
  cidr: postgresDatatypes.cidr,
  macaddr: postgresDatatypes.macaddr,
  macaddr8: postgresDatatypes.macaddr8,
  point: postgresDatatypes.point,
  line: postgresDatatypes.line,
  lseg: postgresDatatypes.lseg,
  box: postgresDatatypes.box,
  path: postgresDatatypes.path,
  polygon: postgresDatatypes.polygon,
  circle: postgresDatatypes.circle,
  tsvector: postgresDatatypes.tsvector,
  tsquery: postgresDatatypes.tsquery,
  int4range: postgresDatatypes.int4range,
  int8range: postgresDatatypes.int8range,
  numrange: postgresDatatypes.numrange,
  tsrange: postgresDatatypes.tsrange,
  tstzrange: postgresDatatypes.tstzrange,
  daterange: postgresDatatypes.daterange,
  int4multirange: postgresDatatypes.int4multirange,
  int8multirange: postgresDatatypes.int8multirange,
  nummultirange: postgresDatatypes.nummultirange,
  tsmultirange: postgresDatatypes.tsmultirange,
  tstzmultirange: postgresDatatypes.tstzmultirange,
  datemultirange: postgresDatatypes.datemultirange,
  array,
  range,
  multirange,
  record,
  domain,
  enum: enum_,
  custom,
  driverValueMapping
}
