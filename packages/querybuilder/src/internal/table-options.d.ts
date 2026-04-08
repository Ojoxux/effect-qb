import { type AnyColumnDefinition, type IsNullable } from "./column-state.js";
import type { Any as AnyExpression } from "./scalar.js";
import type { Any as AnySchemaExpression } from "./schema-expression.js";
import type { TableFieldMap } from "./schema-derivation.js";
/** Non-empty list of column names. */
export type ColumnList = readonly [string, ...string[]];
export type DdlExpressionLike = AnyExpression | AnySchemaExpression;
export type ReferentialAction = "noAction" | "restrict" | "cascade" | "setNull" | "setDefault";
export type IndexKeySpec = {
    readonly kind: "column";
    readonly column: string;
    readonly order?: "asc" | "desc";
    readonly nulls?: "first" | "last";
    readonly operatorClass?: string;
    readonly collation?: string;
} | {
    readonly kind: "expression";
    readonly expression: DdlExpressionLike;
    readonly order?: "asc" | "desc";
    readonly nulls?: "first" | "last";
    readonly operatorClass?: string;
    readonly collation?: string;
};
/** Normalized table-level option record. */
export type TableOptionSpec = {
    readonly kind: "index";
    readonly columns?: ColumnList;
    readonly name?: string;
    readonly unique?: boolean;
    readonly method?: string;
    readonly include?: readonly string[];
    readonly predicate?: DdlExpressionLike;
    readonly keys?: readonly [IndexKeySpec, ...IndexKeySpec[]];
} | {
    readonly kind: "unique";
    readonly columns: ColumnList;
    readonly name?: string;
    readonly nullsNotDistinct?: boolean;
    readonly deferrable?: boolean;
    readonly initiallyDeferred?: boolean;
} | {
    readonly kind: "primaryKey";
    readonly columns: ColumnList;
    readonly name?: string;
    readonly deferrable?: boolean;
    readonly initiallyDeferred?: boolean;
} | {
    readonly kind: "foreignKey";
    readonly columns: ColumnList;
    readonly name?: string;
    readonly references: () => {
        readonly tableName: string;
        readonly schemaName?: string;
        readonly columns: ColumnList;
        readonly knownColumns?: readonly string[];
    };
    readonly onUpdate?: ReferentialAction;
    readonly onDelete?: ReferentialAction;
    readonly deferrable?: boolean;
    readonly initiallyDeferred?: boolean;
} | {
    readonly kind: "check";
    readonly name: string;
    readonly predicate: DdlExpressionLike;
    readonly noInherit?: boolean;
};
/** Thin wrapper used by the public `Table.*` option builders. */
export interface TableOptionBuilder<Spec extends TableOptionSpec = TableOptionSpec> {
    readonly option: Spec;
}
/** Collection of declared table options. */
export type DeclaredTableOptions = readonly TableOptionBuilder[];
type ColumnNameUnion<Fields extends TableFieldMap> = Extract<keyof Fields, string>;
type NullableColumnNames<Fields extends TableFieldMap> = {
    [K in keyof Fields]: Fields[K] extends AnyColumnDefinition ? IsNullable<Fields[K]> extends true ? K : never : never;
}[keyof Fields];
type TupleFromColumns<Columns> = Columns extends readonly [infer Head extends string, ...infer Tail extends string[]] ? readonly [Head, ...Tail] : Columns extends readonly string[] ? Columns extends readonly [string, ...string[]] ? Columns : never : Columns extends string ? readonly [Columns] : never;
type AssertKnownColumns<Fields extends TableFieldMap, Columns extends readonly string[]> = Exclude<Columns[number], ColumnNameUnion<Fields>> extends never ? Columns : never;
type AssertPrimaryKeyColumns<Fields extends TableFieldMap, Columns extends readonly string[]> = Extract<Columns[number], NullableColumnNames<Fields>> extends never ? Columns : never;
/** Normalizes a string or tuple input into a non-empty column list. */
export declare const normalizeColumnList: (columns: string | readonly string[]) => ColumnList;
/** Converts inline column flags into normalized table option records. */
export declare const collectInlineOptions: <Fields extends TableFieldMap>(fields: Fields) => readonly TableOptionSpec[];
/** Resolves the effective primary-key columns for a table. */
export declare const resolvePrimaryKeyColumns: <Fields extends TableFieldMap>(fields: Fields, declaredOptions: readonly TableOptionSpec[]) => readonly (keyof Fields & string)[];
/** Validates that options reference known, legal columns for the table. */
export declare const validateOptions: <Fields extends TableFieldMap>(tableName: string, fields: Fields, options: readonly TableOptionSpec[]) => void;
/** Compile-time validation that option columns exist on the table. */
export type ValidateKnownColumns<Fields extends TableFieldMap, Columns extends readonly string[]> = AssertKnownColumns<Fields, Columns>;
/** Compile-time validation that primary-key columns are known and non-nullable. */
export type ValidatePrimaryKeyColumns<Fields extends TableFieldMap, Columns extends readonly string[]> = AssertPrimaryKeyColumns<Fields, AssertKnownColumns<Fields, Columns>>;
/** Normalizes a public column input into the internal tuple form. */
export type NormalizeColumns<Columns extends string | readonly string[]> = TupleFromColumns<Columns>;
export {};
