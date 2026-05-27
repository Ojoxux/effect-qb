import * as BaseTable from "../internal/table.js"
import type { TableOptionSpec } from "../internal/table-options.js"

export type {
  DdlExpressionLike,
  IndexKeySpec as IndexKey,
  ReferentialAction,
  TableOption
} from "../internal/table.js"

type NamedSpec = Extract<TableOptionSpec, { readonly name?: string }>
type PrimaryKeySpec = Extract<TableOptionSpec, { readonly kind: "primaryKey" }>
type UniqueSpec = Extract<TableOptionSpec, { readonly kind: "unique" }>
type IndexSpec = Extract<TableOptionSpec, { readonly kind: "index" }>
type ForeignKeySpec = Extract<TableOptionSpec, { readonly kind: "foreignKey" }>
type CheckSpec = Extract<TableOptionSpec, { readonly kind: "check" }>

type NonEmptyStringArrayInput<Values extends readonly string[]> =
  [Extract<Values[number], "">] extends [never] ? unknown : never

type IndexKeyInput =
  | {
      readonly column: string
      readonly order?: "asc" | "desc"
      readonly nulls?: "first" | "last"
      readonly operatorClass?: string
      readonly collation?: string
    }
  | {
      readonly expression: BaseTable.DdlExpressionLike
      readonly order?: "asc" | "desc"
      readonly nulls?: "first" | "last"
      readonly operatorClass?: string
      readonly collation?: string
    }

type EmptyIndexKeyColumn<Key> = Key extends { readonly column: infer Column extends string }
  ? BaseTable.NonEmptyStringInput<Column> extends never ? Key : never
  : never

type EmptyIndexKeyOperatorClass<Key> = Key extends { readonly operatorClass: infer OperatorClass extends string }
  ? BaseTable.NonEmptyStringInput<OperatorClass> extends never ? Key : never
  : never

type EmptyIndexKeyCollation<Key> = Key extends { readonly collation: infer Collation extends string }
  ? BaseTable.NonEmptyStringInput<Collation> extends never ? Key : never
  : never

type InvalidIndexKeyMetadata<Key> =
  | EmptyIndexKeyColumn<Key>
  | EmptyIndexKeyOperatorClass<Key>
  | EmptyIndexKeyCollation<Key>

type NonEmptyIndexKeyInput<Key> =
  [InvalidIndexKeyMetadata<Key>] extends [never] ? unknown : never

const mapOption = <Next extends TableOptionSpec>(
  next: Next
): BaseTable.TableOption<Next> =>
  BaseTable.option(next)

const normalizeIndexKey = (key: IndexKeyInput): BaseTable.IndexKeySpec =>
  "expression" in key
    ? {
        kind: "expression",
        expression: key.expression,
        order: key.order,
        nulls: key.nulls,
        operatorClass: key.operatorClass,
        collation: key.collation
      }
    : {
        kind: "column",
        column: key.column,
        order: key.order,
        nulls: key.nulls,
        operatorClass: key.operatorClass,
        collation: key.collation
      }

/** Adds a Postgres constraint or index name to a standard table option. */
export const named = <const Name extends string>(
  name: BaseTable.NonEmptyStringInput<Name>
) =>
  <Spec extends NamedSpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly name: Name }> =>
    mapOption({
      ...option.option,
      name
    } as Spec & { readonly name: Name })

/** Marks a standard primary key, unique, or foreign-key option as deferrable. */
export const deferrable = <
  Spec extends PrimaryKeySpec | UniqueSpec | ForeignKeySpec
>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly deferrable: true }> =>
  mapOption({
    ...option.option,
    deferrable: true
  } as Spec & { readonly deferrable: true })

/** Marks a deferrable standard primary key, unique, or foreign-key option as initially deferred. */
export const initiallyDeferred = <
  Spec extends PrimaryKeySpec | UniqueSpec | ForeignKeySpec
>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & {
  readonly deferrable: true
  readonly initiallyDeferred: true
}> =>
  mapOption({
    ...option.option,
    deferrable: true,
    initiallyDeferred: true
  } as Spec & { readonly deferrable: true; readonly initiallyDeferred: true })

/** Adds Postgres NULLS NOT DISTINCT to a standard unique option. */
export const nullsNotDistinct = <Spec extends UniqueSpec>(
  option: BaseTable.TableOption<Spec>
): BaseTable.TableOption<Spec & { readonly nullsNotDistinct: true }> =>
  mapOption({
    ...option.option,
    nullsNotDistinct: true
  } as Spec & { readonly nullsNotDistinct: true })

/** Marks a standard index option as a Postgres unique index. */
export const uniqueIndex = <Spec extends IndexSpec>(
  option: BaseTable.TableOption<Spec>
): BaseTable.TableOption<Spec & { readonly unique: true }> =>
  mapOption({
    ...option.option,
    unique: true
  } as Spec & { readonly unique: true })

/** Adds a Postgres index method to a standard index option. */
export const using = <const Method extends string>(
  method: BaseTable.NonEmptyStringInput<Method>
) =>
  <Spec extends IndexSpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly method: Method }> =>
    mapOption({
      ...option.option,
      method
    } as Spec & { readonly method: Method })

/** Adds Postgres INCLUDE columns to a standard index option. */
export const include = <const Include extends readonly string[]>(
  include: Include & NonEmptyStringArrayInput<Include>
) =>
  <Spec extends IndexSpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly include: Include }> =>
    mapOption({
      ...option.option,
      include
    } as Spec & { readonly include: Include })

/** Adds a Postgres partial-index predicate to a standard index option. */
export const where = <Predicate extends BaseTable.DdlExpressionLike>(
  predicate: Predicate
) =>
  <Spec extends IndexSpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly predicate: Predicate }> =>
    mapOption({
      ...option.option,
      predicate
    } as Spec & { readonly predicate: Predicate })

/** Replaces standard index columns with a single Postgres index key. */
export const key = <const Key extends IndexKeyInput>(
  key: Key & NonEmptyIndexKeyInput<Key>
) =>
  <Spec extends IndexSpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & {
    readonly keys: readonly [BaseTable.IndexKeySpec]
  }> =>
    mapOption({
      ...option.option,
      columns: undefined,
      keys: [normalizeIndexKey(key)]
    } as Spec & { readonly keys: readonly [BaseTable.IndexKeySpec] })

/** Replaces standard index columns with Postgres index keys. */
export const keys = <const Keys extends readonly [IndexKeyInput, ...IndexKeyInput[]]>(
  keys: Keys & {
    readonly [Index in keyof Keys]: Keys[Index] & NonEmptyIndexKeyInput<Keys[Index]>
  }
) =>
  <Spec extends IndexSpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & {
    readonly keys: readonly [BaseTable.IndexKeySpec, ...BaseTable.IndexKeySpec[]]
  }> =>
    mapOption({
      ...option.option,
      columns: undefined,
      keys: [normalizeIndexKey(keys[0]), ...keys.slice(1).map(normalizeIndexKey)]
    } as Spec & { readonly keys: readonly [BaseTable.IndexKeySpec, ...BaseTable.IndexKeySpec[]] })

/** Adds an ON DELETE action to a standard foreign-key option. */
export const onDelete = (action: BaseTable.ReferentialAction) =>
  <Spec extends ForeignKeySpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly onDelete: BaseTable.ReferentialAction }> =>
    mapOption({
      ...option.option,
      onDelete: action
    } as Spec & { readonly onDelete: BaseTable.ReferentialAction })

/** Adds an ON UPDATE action to a standard foreign-key option. */
export const onUpdate = (action: BaseTable.ReferentialAction) =>
  <Spec extends ForeignKeySpec>(option: BaseTable.TableOption<Spec>): BaseTable.TableOption<Spec & { readonly onUpdate: BaseTable.ReferentialAction }> =>
    mapOption({
      ...option.option,
      onUpdate: action
    } as Spec & { readonly onUpdate: BaseTable.ReferentialAction })

/** Adds Postgres NO INHERIT to a standard check option. */
export const noInherit = <Spec extends CheckSpec>(
  option: BaseTable.TableOption<Spec>
): BaseTable.TableOption<Spec & { readonly noInherit: true }> =>
  mapOption({
    ...option.option,
    noInherit: true
  } as Spec & { readonly noInherit: true })
