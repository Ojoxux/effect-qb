import type { AnyColumnDefinition } from "../internal/column-state.js"
import * as BaseTable from "../internal/table.js"

type Dialect = string

type DialectColumn = AnyColumnDefinition

type DialectFieldMap = Record<string, DialectColumn>

type InlinePrimaryKeyKeys<Fields extends DialectFieldMap> = Extract<{
  [K in keyof Fields]: Fields[K]["metadata"]["primaryKey"] extends true ? K : never
}[keyof Fields], string>

export type TableDefinition<
  Name extends string,
  Fields extends DialectFieldMap,
  PrimaryKeyColumns extends keyof Fields & string = InlinePrimaryKeyKeys<Fields>,
  Kind extends "schema" | "alias" = "schema",
  SchemaName extends string = "public",
  ConflictArbiters extends BaseTable.ConflictArbiter = BaseTable.TableDefinition<
    Name,
    Fields,
    PrimaryKeyColumns,
    Kind,
    SchemaName
  >[typeof BaseTable.TypeId]["conflictArbiters"][number]
> = BaseTable.TableDefinition<Name, Fields, PrimaryKeyColumns, Kind, SchemaName, ConflictArbiters>

export type TableClassStatic<
  Name extends string,
  Fields extends DialectFieldMap,
  PrimaryKeyColumns extends keyof Fields & string = InlinePrimaryKeyKeys<Fields>,
  SchemaName extends string = "public",
  ConflictArbiters extends BaseTable.ConflictArbiter = BaseTable.TableClassStatic<
    Name,
    Fields,
    PrimaryKeyColumns,
    SchemaName
  >[typeof BaseTable.TypeId]["conflictArbiters"][number]
> = BaseTable.TableClassStatic<Name, Fields, PrimaryKeyColumns, SchemaName, ConflictArbiters>

export type AnyTable = BaseTable.AnyTable<Dialect>

type FieldsOfTable<Table extends BaseTable.AnyTable> = Table[typeof BaseTable.TypeId]["fields"] extends infer Fields extends DialectFieldMap
  ? Fields
  : never

type PrimaryKeyOfTable<Table extends BaseTable.AnyTable> = Table[typeof BaseTable.TypeId]["primaryKey"][number]

type SchemaNameOfTable<Table extends BaseTable.AnyTable> =
  Table[typeof BaseTable.TypeId]["schemaName"] extends infer SchemaName extends string ? SchemaName : "public"

type ConflictArbiterOfTable<Table extends BaseTable.AnyTable> = Table[typeof BaseTable.TypeId]["conflictArbiters"][number]

export type TableOption = BaseTable.TableOption

export const TypeId = BaseTable.TypeId
export const OptionsSymbol = BaseTable.OptionsSymbol
export const options = BaseTable.options
export const option = BaseTable.option

export function make<
  Name extends string,
  Fields extends DialectFieldMap
>(
  name: BaseTable.NonEmptyStringInput<Name>,
  fields: Fields & BaseTable.NonEmptyFieldMap<Fields>
): TableDefinition<Name, Fields, InlinePrimaryKeyKeys<Fields>, "schema", "public">
export function make<
  Name extends string,
  Fields extends DialectFieldMap,
  const SchemaName extends string
>(
  name: BaseTable.NonEmptyStringInput<Name>,
  fields: Fields & BaseTable.NonEmptyFieldMap<Fields>,
  schemaName: BaseTable.NonEmptySchemaNameInput<SchemaName>
): TableDefinition<Name, Fields, InlinePrimaryKeyKeys<Fields>, "schema", SchemaName>
export function make(
  name: string,
  fields: DialectFieldMap,
  schemaName?: string
): any {
  return arguments.length >= 3
    ? BaseTable.make(name, fields, schemaName as string) as TableDefinition<string, DialectFieldMap, string, "schema", string>
    : BaseTable.make(name, fields) as TableDefinition<string, DialectFieldMap, string, "schema", string>
}

export const alias = <
  Table extends AnyTable,
  AliasName extends string
>(
  table: Table,
  aliasName: BaseTable.LiteralStringInput<AliasName>
): TableDefinition<
  AliasName,
  FieldsOfTable<Table>,
  PrimaryKeyOfTable<Table>,
  "alias",
  SchemaNameOfTable<Table>,
  ConflictArbiterOfTable<Table>
> =>
  BaseTable.alias(table as any, aliasName) as TableDefinition<
    AliasName,
    FieldsOfTable<Table>,
    PrimaryKeyOfTable<Table>,
    "alias",
    SchemaNameOfTable<Table>,
    ConflictArbiterOfTable<Table>
  >

type ClassApi = {
  <Self = never>(
    name: "",
    schemaName?: string | undefined
  ): never
  <Self = never>(
    name: string,
    schemaName: ""
  ): never
  <Self = never, const SchemaName extends string = "public", const Name extends string = string>(
    name: BaseTable.NonEmptyStringInput<Name>,
    schemaName?: BaseTable.NonEmptySchemaNameInput<SchemaName>
  ): <
    Fields extends DialectFieldMap
  >(fields: Fields & BaseTable.NonEmptyFieldMap<Fields>) => [Self] extends [never]
    ? BaseTable.MissingSelfGeneric
    : TableClassStatic<Name, Fields, InlinePrimaryKeyKeys<Fields>, SchemaName>
}

export const Class: ClassApi = ((
  name: string,
  schemaName: string | undefined = undefined
) => {
  const base = BaseTable.Class(name as never, schemaName)
  return base
}) as ClassApi

export const primaryKey = BaseTable.primaryKey
export const unique = BaseTable.unique
export const index = BaseTable.index
export const foreignKey = BaseTable.foreignKey

export const check = BaseTable.check

export const selectSchema = BaseTable.selectSchema
export const insertSchema = BaseTable.insertSchema
export const updateSchema = BaseTable.updateSchema

export type SelectOf<Table extends AnyTable> = BaseTable.SelectOf<Table>
export type InsertOf<Table extends AnyTable> = BaseTable.InsertOf<Table>
export type UpdateOf<Table extends AnyTable> = BaseTable.UpdateOf<Table>
