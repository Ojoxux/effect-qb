import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type PrimaryKeySpec = Extract<TableOptionSpec, { readonly kind: "primaryKey" }>

export const make = BaseTable.primaryKey

export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends PrimaryKeySpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
    option: BaseTable.TableOption<Spec, TableContext>
  ): BaseTable.TableOption<Spec & { readonly name: Name }, TableContext> =>
    BaseTable.mapOption(option, (spec) => ({
      ...spec,
      name
    } as Spec & { readonly name: Name }))
