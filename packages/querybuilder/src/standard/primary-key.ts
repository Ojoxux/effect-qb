import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type PrimaryKeySpec = Extract<TableOptionSpec, { readonly kind: "primaryKey" }>

const mapOption = <Next extends TableOptionSpec>(
  next: Next
): BaseTable.TableOption<Next> =>
  BaseTable.option(next)

export const make = BaseTable.primaryKey

export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends PrimaryKeySpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly name: Name }> =>
    mapOption({
      ...option.option,
      name
    } as Spec & { readonly name: Name })

