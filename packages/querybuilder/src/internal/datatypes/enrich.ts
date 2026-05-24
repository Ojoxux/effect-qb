import type * as Expression from "../scalar.js"

type DatatypeLookup = Readonly<Record<string, (() => Expression.DbType.Any) | undefined>>

export const enrichDbType = <
  Module extends object,
  Db extends Expression.DbType.Any
>(
  datatypes: Module,
  dbType: Db
): Db => {
  if (dbType.kind === "custom") {
    return dbType
  }
  const lookup = datatypes as DatatypeLookup
  if (!(dbType.kind in lookup)) {
    return dbType
  }
  const candidate = lookup[dbType.kind]
  return typeof candidate === "function"
    ? { ...candidate(), ...dbType } as Db
    : dbType
}
