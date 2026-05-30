import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type ForeignKeySpec = Extract<TableOptionSpec, { readonly kind: "foreignKey" }>

const mapOption = <Next extends TableOptionSpec>(
  next: Next
): BaseTable.TableOption<Next> =>
  BaseTable.option(next)

export type ReferentialAction = BaseTable.ReferentialAction

export const make = BaseTable.foreignKey

export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends ForeignKeySpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly name: Name }> =>
    mapOption({
      ...option.option,
      name
    } as Spec & { readonly name: Name })

export const onDelete = (action: BaseTable.ReferentialAction) =>
  <Spec extends ForeignKeySpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly onDelete: BaseTable.ReferentialAction }> =>
    mapOption({
      ...option.option,
      onDelete: action
    } as Spec & { readonly onDelete: BaseTable.ReferentialAction })

export const onUpdate = (action: BaseTable.ReferentialAction) =>
  <Spec extends ForeignKeySpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly onUpdate: BaseTable.ReferentialAction }> =>
    mapOption({
      ...option.option,
      onUpdate: action
    } as Spec & { readonly onUpdate: BaseTable.ReferentialAction })

