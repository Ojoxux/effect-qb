import * as VariantSchema from "@effect/experimental/VariantSchema";
import type * as Brand from "effect/Brand";
import * as Schema from "effect/Schema";
import { type AnyColumnDefinition, type HasDefault, type InsertType, type IsGenerated, type IsNullable, type SelectType, type UpdateType } from "./column-state.js";
/** Variant-schema helper used to derive select / insert / update schemas. */
export declare const TableSchema: {
    readonly Struct: <const A extends VariantSchema.Struct.Fields>(fields: A & VariantSchema.Struct.Validate<A, "insert" | "select" | "update">) => VariantSchema.Struct<A>;
    readonly Field: <const A extends VariantSchema.Field.ConfigWithKeys<"insert" | "select" | "update">>(config: A & { readonly [K in Exclude<keyof A, "insert" | "select" | "update">]: never; }) => VariantSchema.Field<A>;
    readonly FieldOnly: <const Keys extends readonly ("insert" | "select" | "update")[]>(...keys: Keys) => <S extends Schema.Schema.All | Schema.PropertySignature.All<PropertyKey>>(schema: S) => VariantSchema.Field<{ readonly [K in Keys[number]]: S; }>;
    readonly FieldExcept: <const Keys extends readonly ("insert" | "select" | "update")[]>(...keys: Keys) => <S extends Schema.Schema.All | Schema.PropertySignature.All<PropertyKey>>(schema: S) => VariantSchema.Field<{ readonly [K in Exclude<"insert", Keys[number]> | Exclude<"select", Keys[number]> | Exclude<"update", Keys[number]>]: S; }>;
    readonly fieldEvolve: {
        <Self extends VariantSchema.Field<any> | VariantSchema.Field.ValueAny, const Mapping extends Self extends VariantSchema.Field<infer S extends VariantSchema.Field.Config> ? { readonly [K in keyof S]?: ((variant: S[K]) => VariantSchema.Field.ValueAny) | undefined; } : {
            readonly insert?: ((variant: Self) => VariantSchema.Field.ValueAny) | undefined;
            readonly select?: ((variant: Self) => VariantSchema.Field.ValueAny) | undefined;
            readonly update?: ((variant: Self) => VariantSchema.Field.ValueAny) | undefined;
        }>(f: Mapping): (self: Self) => VariantSchema.Field<Self extends VariantSchema.Field<infer S_1 extends VariantSchema.Field.Config> ? { readonly [K in keyof S_1]: K extends keyof Mapping ? Mapping[K] extends (arg: any) => any ? ReturnType<Mapping[K]> : S_1[K] : S_1[K]; } : {
            readonly insert: "insert" extends infer T ? T extends "insert" ? T extends keyof Mapping ? Mapping[T] extends (arg: any) => any ? ReturnType<Mapping[T]> : Self : Self : never : never;
            readonly select: "select" extends infer T_1 ? T_1 extends "select" ? T_1 extends keyof Mapping ? Mapping[T_1] extends (arg: any) => any ? ReturnType<Mapping[T_1]> : Self : Self : never : never;
            readonly update: "update" extends infer T_2 ? T_2 extends "update" ? T_2 extends keyof Mapping ? Mapping[T_2] extends (arg: any) => any ? ReturnType<Mapping[T_2]> : Self : Self : never : never;
        }>;
        <Self extends VariantSchema.Field<any> | VariantSchema.Field.ValueAny, const Mapping_1 extends Self extends VariantSchema.Field<infer S extends VariantSchema.Field.Config> ? { readonly [K in keyof S]?: ((variant: S[K]) => VariantSchema.Field.ValueAny) | undefined; } : {
            readonly insert?: ((variant: Self) => VariantSchema.Field.ValueAny) | undefined;
            readonly select?: ((variant: Self) => VariantSchema.Field.ValueAny) | undefined;
            readonly update?: ((variant: Self) => VariantSchema.Field.ValueAny) | undefined;
        }>(self: Self, f: Mapping_1): VariantSchema.Field<Self extends VariantSchema.Field<infer S_1 extends VariantSchema.Field.Config> ? { readonly [K in keyof S_1]: K extends keyof Mapping_1 ? Mapping_1[K] extends (arg: any) => any ? ReturnType<Mapping_1[K]> : S_1[K] : S_1[K]; } : {
            readonly insert: "insert" extends infer T ? T extends "insert" ? T extends keyof Mapping_1 ? Mapping_1[T] extends (arg: any) => any ? ReturnType<Mapping_1[T]> : Self : Self : never : never;
            readonly select: "select" extends infer T_1 ? T_1 extends "select" ? T_1 extends keyof Mapping_1 ? Mapping_1[T_1] extends (arg: any) => any ? ReturnType<Mapping_1[T_1]> : Self : Self : never : never;
            readonly update: "update" extends infer T_2 ? T_2 extends "update" ? T_2 extends keyof Mapping_1 ? Mapping_1[T_2] extends (arg: any) => any ? ReturnType<Mapping_1[T_2]> : Self : Self : never : never;
        }>;
    };
    readonly fieldFromKey: {
        <Self extends VariantSchema.Field<any> | VariantSchema.Field.ValueAny, const Mapping_2 extends Self extends VariantSchema.Field<infer S extends VariantSchema.Field.Config> ? { readonly [K in keyof S]?: string | undefined; } : {
            readonly insert?: string | undefined;
            readonly select?: string | undefined;
            readonly update?: string | undefined;
        }>(mapping: Mapping_2): (self: Self) => VariantSchema.Field<Self extends VariantSchema.Field<infer S_1 extends VariantSchema.Field.Config> ? { readonly [K in keyof S_1]: K extends keyof Mapping_2 ? Mapping_2[K] extends string ? VariantSchema.fromKey.Rename<S_1[K], Mapping_2[K]> : S_1[K] : S_1[K]; } : {
            readonly insert: "insert" extends infer T ? T extends "insert" ? T extends keyof Mapping_2 ? Mapping_2[T] extends string ? VariantSchema.fromKey.Rename<Self, Mapping_2[T]> : Self : Self : never : never;
            readonly select: "select" extends infer T_1 ? T_1 extends "select" ? T_1 extends keyof Mapping_2 ? Mapping_2[T_1] extends string ? VariantSchema.fromKey.Rename<Self, Mapping_2[T_1]> : Self : Self : never : never;
            readonly update: "update" extends infer T_2 ? T_2 extends "update" ? T_2 extends keyof Mapping_2 ? Mapping_2[T_2] extends string ? VariantSchema.fromKey.Rename<Self, Mapping_2[T_2]> : Self : Self : never : never;
        }>;
        <Self extends VariantSchema.Field<any> | VariantSchema.Field.ValueAny, const Mapping_3 extends Self extends VariantSchema.Field<infer S extends VariantSchema.Field.Config> ? { readonly [K in keyof S]?: string | undefined; } : {
            readonly insert?: string | undefined;
            readonly select?: string | undefined;
            readonly update?: string | undefined;
        }>(self: Self, mapping: Mapping_3): VariantSchema.Field<Self extends VariantSchema.Field<infer S_1 extends VariantSchema.Field.Config> ? { readonly [K in keyof S_1]: K extends keyof Mapping_3 ? Mapping_3[K] extends string ? VariantSchema.fromKey.Rename<S_1[K], Mapping_3[K]> : S_1[K] : S_1[K]; } : {
            readonly insert: "insert" extends infer T ? T extends "insert" ? T extends keyof Mapping_3 ? Mapping_3[T] extends string ? VariantSchema.fromKey.Rename<Self, Mapping_3[T]> : Self : Self : never : never;
            readonly select: "select" extends infer T_1 ? T_1 extends "select" ? T_1 extends keyof Mapping_3 ? Mapping_3[T_1] extends string ? VariantSchema.fromKey.Rename<Self, Mapping_3[T_1]> : Self : Self : never : never;
            readonly update: "update" extends infer T_2 ? T_2 extends "update" ? T_2 extends keyof Mapping_3 ? Mapping_3[T_2] extends string ? VariantSchema.fromKey.Rename<Self, Mapping_3[T_2]> : Self : Self : never : never;
        }>;
    };
    readonly Class: <Self = never>(identifier: string) => <const Fields extends VariantSchema.Struct.Fields>(fields: Fields & VariantSchema.Struct.Validate<Fields, "insert" | "select" | "update">, annotations?: Schema.Annotations.Schema<Self, readonly []> | undefined) => [Self] extends [never] ? "Missing `Self` generic - use `class Self extends Class<Self>()({ ... })`" : VariantSchema.Class<Self, Fields, VariantSchema.ExtractFields<"select", Fields, true>, Schema.Struct.Type<VariantSchema.ExtractFields<"select", Fields, true>>, Schema.Struct.Encoded<VariantSchema.ExtractFields<"select", Fields, true>>, Schema.Schema.Context<VariantSchema.ExtractFields<"select", Fields, true>[keyof VariantSchema.ExtractFields<"select", Fields, true>]>, Schema.Struct.Constructor<VariantSchema.ExtractFields<"select", Fields, true>>> & {
        readonly insert: Schema.Struct<VariantSchema.ExtractFields<"insert", Fields, false> extends infer T ? { [K in keyof T]: T[K]; } : never>;
        readonly select: Schema.Struct<VariantSchema.ExtractFields<"select", Fields, false> extends infer T_1 ? { [K in keyof T_1]: T_1[K]; } : never>;
        readonly update: Schema.Struct<VariantSchema.ExtractFields<"update", Fields, false> extends infer T_2 ? { [K in keyof T_2]: T_2[K]; } : never>;
    };
    readonly Union: <const Members extends readonly VariantSchema.Struct<any>[]>(...members: Members) => VariantSchema.Union<Members> & VariantSchema.Union.Variants<Members, "insert" | "select" | "update">;
    readonly extract: {
        <V extends "insert" | "select" | "update">(variant: V): <A extends VariantSchema.Struct<any>>(self: A) => VariantSchema.Extract<V, A, V extends "select" ? true : false>;
        <V extends "insert" | "select" | "update", A extends VariantSchema.Struct<any>>(self: A, variant: V): VariantSchema.Extract<V, A, V extends "select" ? true : false>;
    };
};
/** Normalized field map used by table definitions. */
export type TableFieldMap = Record<string, AnyColumnDefinition>;
type GeneratedKeys<Fields extends TableFieldMap> = {
    [K in keyof Fields]: IsGenerated<Fields[K]> extends true ? K : never;
}[keyof Fields];
type OptionalInsertKeys<Fields extends TableFieldMap> = {
    [K in keyof Fields]: IsGenerated<Fields[K]> extends true ? never : IsNullable<Fields[K]> extends true ? K : HasDefault<Fields[K]> extends true ? K : never;
}[keyof Fields];
type RequiredInsertKeys<Fields extends TableFieldMap> = Exclude<keyof Fields, GeneratedKeys<Fields> | OptionalInsertKeys<Fields>>;
type UpdateKeys<Fields extends TableFieldMap, PrimaryKey extends keyof Fields> = Exclude<keyof Fields, GeneratedKeys<Fields> | PrimaryKey>;
type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
type BrandedValue<Value, BrandName extends string> = [Extract<Value, null | undefined>] extends [never] ? Value & Brand.Brand<BrandName> : (Exclude<Value, null | undefined> & Brand.Brand<BrandName>) | Extract<Value, null | undefined>;
type BrandNameOf<TableName extends string, ColumnName extends string> = `${TableName}.${ColumnName}`;
type BrandedSelectType<Column extends AnyColumnDefinition, TableName extends string, ColumnName extends string> = Column["metadata"]["brand"] extends true ? BrandedValue<SelectType<Column>, BrandNameOf<TableName, ColumnName>> : SelectType<Column>;
type BrandedInsertType<Column extends AnyColumnDefinition, TableName extends string, ColumnName extends string> = Column["metadata"]["brand"] extends true ? BrandedValue<InsertType<Column>, BrandNameOf<TableName, ColumnName>> : InsertType<Column>;
type BrandedUpdateType<Column extends AnyColumnDefinition, TableName extends string, ColumnName extends string> = Column["metadata"]["brand"] extends true ? BrandedValue<UpdateType<Column>, BrandNameOf<TableName, ColumnName>> : UpdateType<Column>;
/** Row shape returned by selecting from a table. */
export type SelectRow<TableName extends string, Fields extends TableFieldMap> = Simplify<{
    [K in keyof Fields]: BrandedSelectType<Fields[K], TableName, Extract<K, string>>;
}>;
/** Insert payload derived from a table field map. */
export type InsertRow<TableName extends string, Fields extends TableFieldMap> = Simplify<{
    [K in RequiredInsertKeys<Fields>]: BrandedInsertType<Fields[K], TableName, Extract<K, string>>;
} & {
    [K in OptionalInsertKeys<Fields>]?: BrandedInsertType<Fields[K], TableName, Extract<K, string>>;
}>;
/** Update payload derived from a table field map and primary key. */
export type UpdateRow<TableName extends string, Fields extends TableFieldMap, PrimaryKey extends keyof Fields> = Simplify<Partial<{
    [K in UpdateKeys<Fields, PrimaryKey>]: BrandedUpdateType<Fields[K], TableName, Extract<K, string>>;
}>>;
/**
 * Derives the `select`, `insert`, and `update` schemas for a table.
 *
 * This is the central place where the column capability flags are turned into
 * real runtime schemas.
 */
export declare const deriveSchemas: <TableName extends string, Fields extends TableFieldMap, PrimaryKeyColumns extends keyof Fields & string>(tableName: TableName, fields: Fields, primaryKeyColumns: readonly PrimaryKeyColumns[]) => {
    readonly select: Schema.Schema<{ [K in keyof { [K in keyof Fields]: BrandedSelectType<Fields[K], TableName, Extract<K, string>>; }]: { [K in keyof Fields]: BrandedSelectType<Fields[K], TableName, Extract<K, string>>; }[K]; }, { [K in keyof { [K in keyof Fields]: BrandedSelectType<Fields[K], TableName, Extract<K, string>>; }]: { [K in keyof Fields]: BrandedSelectType<Fields[K], TableName, Extract<K, string>>; }[K]; }, never>;
    readonly insert: Schema.Schema<{ [K in Exclude<keyof Fields, GeneratedKeys<Fields> | OptionalInsertKeys<Fields>>]: BrandedInsertType<Fields[K], TableName, Extract<K, string>>; } & { [K in OptionalInsertKeys<Fields>]?: BrandedInsertType<Fields[K], TableName, Extract<K, string>> | undefined; } extends infer T ? { [K in keyof T]: T[K]; } : never, { [K in Exclude<keyof Fields, GeneratedKeys<Fields> | OptionalInsertKeys<Fields>>]: BrandedInsertType<Fields[K], TableName, Extract<K, string>>; } & { [K in OptionalInsertKeys<Fields>]?: BrandedInsertType<Fields[K], TableName, Extract<K, string>> | undefined; } extends infer T ? { [K in keyof T]: T[K]; } : never, never>;
    readonly update: Schema.Schema<Partial<{ [K in Exclude<keyof Fields, PrimaryKeyColumns | GeneratedKeys<Fields>>]: BrandedUpdateType<Fields[K], TableName, Extract<K, string>>; }> extends infer T_1 ? { [K in keyof T_1]: T_1[K]; } : never, Partial<{ [K in Exclude<keyof Fields, PrimaryKeyColumns | GeneratedKeys<Fields>>]: BrandedUpdateType<Fields[K], TableName, Extract<K, string>>; }> extends infer T_1 ? { [K in keyof T_1]: T_1[K]; } : never, never>;
};
export {};
