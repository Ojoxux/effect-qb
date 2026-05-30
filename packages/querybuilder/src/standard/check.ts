import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type CheckSpec = Extract<TableOptionSpec, { readonly kind: "check" }>

const mapOption = <Next extends TableOptionSpec>(
  next: Next
): BaseTable.TableOption<Next> =>
  BaseTable.option(next)

export const make = BaseTable.check

export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends CheckSpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly name: Name }> =>
    mapOption({
      ...option.option,
      name
    } as Spec & { readonly name: Name })

