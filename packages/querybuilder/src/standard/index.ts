import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type IndexSpec = Extract<TableOptionSpec, { readonly kind: "index" }>

export const make = BaseTable.index

export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends IndexSpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
    option: BaseTable.TableOption<Spec, TableContext>
  ): BaseTable.TableOption<Spec & { readonly name: Name }, TableContext> =>
    BaseTable.mapOption(option, (spec) => ({
      ...spec,
      name
    } as Spec & { readonly name: Name }))
