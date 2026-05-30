import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type PrimaryKeySpec = Extract<TableOptionSpec, { readonly kind: "primaryKey" }>

const mapOption = <Next extends TableOptionSpec>(
  next: Next
): BaseTable.TableOption<Next> =>
  BaseTable.option(next)

export const deferrable = <Spec extends PrimaryKeySpec>(
  option: BaseTable.TableOption<Spec>
): BaseTable.TableOption<Spec & { readonly deferrable: true }> =>
  mapOption({
    ...option.option,
    deferrable: true
  } as Spec & { readonly deferrable: true })

export const initiallyDeferred = <Spec extends PrimaryKeySpec>(
  option: BaseTable.TableOption<Spec>
): BaseTable.TableOption<Spec & {
  readonly deferrable: true
  readonly initiallyDeferred: true
}> =>
  mapOption({
    ...option.option,
    deferrable: true,
    initiallyDeferred: true
  } as Spec & { readonly deferrable: true; readonly initiallyDeferred: true })
