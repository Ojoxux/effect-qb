import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type UniqueSpec = Extract<TableOptionSpec, { readonly kind: "unique" }>

export const make = BaseTable.unique

export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends UniqueSpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
    option: BaseTable.TableOption<Spec, TableContext>
  ): BaseTable.TableOption<Spec & { readonly name: Name }, TableContext> =>
    BaseTable.mapOption(option, (spec) => ({
      ...spec,
      name
    } as Spec & { readonly name: Name }))
