import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

type ForeignKeySpec = Extract<TableOptionSpec, { readonly kind: "foreignKey" }>

export type ReferentialAction = BaseTable.ReferentialAction

export const make = BaseTable.foreignKey

export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends ForeignKeySpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
    option: BaseTable.TableOption<Spec, TableContext>
  ): BaseTable.TableOption<Spec & { readonly name: Name }, TableContext> =>
    BaseTable.mapOption(option, (spec) => ({
      ...spec,
      name
    } as Spec & { readonly name: Name }))

export const onDelete = (action: BaseTable.ReferentialAction) =>
  <Spec extends ForeignKeySpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
    option: BaseTable.TableOption<Spec, TableContext>
  ): BaseTable.TableOption<Spec & { readonly onDelete: BaseTable.ReferentialAction }, TableContext> =>
    BaseTable.mapOption(option, (spec) => ({
      ...spec,
      onDelete: action
    } as Spec & { readonly onDelete: BaseTable.ReferentialAction }))

export const onUpdate = (action: BaseTable.ReferentialAction) =>
  <Spec extends ForeignKeySpec, TableContext extends BaseTable.TableDefinition<any, any, any, "schema", any>>(
    option: BaseTable.TableOption<Spec, TableContext>
  ): BaseTable.TableOption<Spec & { readonly onUpdate: BaseTable.ReferentialAction }, TableContext> =>
    BaseTable.mapOption(option, (spec) => ({
      ...spec,
      onUpdate: action
    } as Spec & { readonly onUpdate: BaseTable.ReferentialAction }))
