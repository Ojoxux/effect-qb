import * as InternalCasing from "./internal/casing.js"
import * as BaseTable from "./internal/table.js"
import * as Table from "./standard/table.js"

export type Style = InternalCasing.Style
export type Options = InternalCasing.Options

export interface TableFactory {
  readonly table: typeof Table.make
  readonly schema: typeof Table.schema
}

const isTable = (value: unknown): value is BaseTable.TableDefinition<any, any, any, any, any> =>
  typeof value === "object" && value !== null && BaseTable.TypeId in value

export const withCasing = (options: Options) =>
  <Value>(value: Value): Value => {
    if (isTable(value)) {
      return BaseTable.withCasing(value, options) as Value
    }
    throw new Error("Casing.withCasing can only be applied to tables or schema factories")
  }

export const casing = (options: Options): TableFactory => {
  const withFactoryCasing = withCasing(options)
  const table = ((name: string, fields: any, schemaName?: string) =>
    schemaName === undefined
      ? Table.make(name, fields).pipe(withFactoryCasing)
      : Table.make(name, fields, schemaName).pipe(withFactoryCasing)) as typeof Table.make
  const schema = ((schemaName: string) => {
    const namespace = Table.schema(schemaName)
    const schemaTable = ((name: string, fields: any, ...declaredOptions: any[]) =>
      namespace.table(name, fields, ...declaredOptions).pipe(withFactoryCasing)) as typeof namespace.table
    return {
      ...namespace,
      table: schemaTable
    }
  }) as typeof Table.schema
  return {
    table,
    schema
  }
}

export const apply = InternalCasing.apply
export const applyCategory = InternalCasing.applyCategory
export const merge = InternalCasing.merge

