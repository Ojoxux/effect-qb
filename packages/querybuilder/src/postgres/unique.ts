import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type UniqueSpec = Extract<TableOptionSpec, { readonly kind: "unique" }>

export const deferrable = <Spec extends UniqueSpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
  option: BaseTable.TableOption<Spec, TableContext>
): BaseTable.TableOption<Spec & { readonly deferrable: true }, TableContext> =>
  BaseTable.mapOption(option, (spec) => ({
    ...spec,
    deferrable: true
  } as Spec & { readonly deferrable: true }))

export const initiallyDeferred = <Spec extends UniqueSpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
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

export const nullsNotDistinct = <Spec extends UniqueSpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
  option: BaseTable.TableOption<Spec, TableContext>
): BaseTable.TableOption<Spec & { readonly nullsNotDistinct: true }, TableContext> =>
  BaseTable.mapOption(option, (spec) => ({
    ...spec,
    nullsNotDistinct: true
  } as Spec & { readonly nullsNotDistinct: true }))
