import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type ForeignKeySpec = Extract<TableOptionSpec, { readonly kind: "foreignKey" }>

export const deferrable = <Spec extends ForeignKeySpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
  option: BaseTable.TableOption<Spec, TableContext>
): BaseTable.TableOption<Spec & { readonly deferrable: true }, TableContext> =>
  BaseTable.mapOption(option, (spec) => ({
    ...spec,
    deferrable: true
  } as Spec & { readonly deferrable: true }))

export const initiallyDeferred = <Spec extends ForeignKeySpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
  option: BaseTable.TableOption<Spec, TableContext>
): BaseTable.TableOption<Spec & {
  readonly deferrable: true
  readonly initiallyDeferred: true
}, TableContext> =>
  BaseTable.mapOption(option, (spec) => ({
    ...spec,
    deferrable: true,
    initiallyDeferred: true
  } as Spec & { readonly deferrable: true; readonly initiallyDeferred: true }))
