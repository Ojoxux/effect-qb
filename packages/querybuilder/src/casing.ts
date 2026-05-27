import * as InternalCasing from "./internal/casing.js"
import * as BaseTable from "./internal/table.js"
import * as Table from "./standard/table.js"

export type Style = InternalCasing.Style
export type Options = InternalCasing.Options
export type Input = Options | Style

export interface TableFactory {
  readonly table: typeof Table.make
  readonly [InternalCasing.TypeId]: InternalCasing.State
  readonly withCasing: (options: Input) => TableFactory
}

type CasingTarget =
  | BaseTable.TableDefinition<any, any, any, any, any>
  | {
      readonly [InternalCasing.TypeId]: InternalCasing.State
      readonly withCasing: (options: Options) => CasingTarget
    }

const isTable = (value: unknown): value is BaseTable.TableDefinition<any, any, any, any, any> =>
  typeof value === "object" && value !== null && BaseTable.TypeId in value

const allCategories = (style: Style): Options => ({
  tables: style,
  columns: style,
  schemas: style,
  indexes: style,
  constraints: style,
  types: style,
  sequences: style
})

const normalize = (input: Input): Options =>
  typeof input === "string" || typeof input === "function" ? allCategories(input) : input

export function withCasing(options: Style): <Value extends CasingTarget>(value: Value) => Value
export function withCasing(options: Options): <Value extends CasingTarget>(value: Value) => Value
export function withCasing(options: Input) {
  return <Value extends CasingTarget>(value: Value): Value => {
    const normalized = normalize(options)
    if (isTable(value)) {
      return BaseTable.withCasing(value, normalized) as Value
    }
    return (value as Exclude<CasingTarget, BaseTable.TableDefinition<any, any, any, any, any>>).withCasing(normalized) as Value
  }
}

export function make(options: Style): TableFactory
export function make(options: Options): TableFactory
export function make(options: Input): TableFactory {
  const normalized = normalize(options)
  const withFactoryCasing = withCasing(normalized)
  const table = ((name: string, fields: any, schemaName?: string) =>
    schemaName === undefined
      ? Table.make(name, fields).pipe(withFactoryCasing)
      : Table.make(name, fields, schemaName).pipe(withFactoryCasing)) as typeof Table.make
  const factory = {
    table,
    [InternalCasing.TypeId]: {
      casing: normalized
    },
    withCasing: (override: Input) => make(InternalCasing.merge(normalized, normalize(override)) ?? {})
  }
  return factory
}

export const apply = InternalCasing.apply
export const applyCategory = InternalCasing.applyCategory
export const merge = InternalCasing.merge
