import { type Expr } from "pgsql-ast-parser";
import { type Pipeable } from "effect/Pipeable";
export declare const TypeId: unique symbol;
export type TypeId = typeof TypeId;
export interface SchemaExpression extends Pipeable {
    readonly [TypeId]: {
        readonly ast?: Expr;
        readonly sql?: string;
    };
}
export type Any = SchemaExpression;
export declare const isSchemaExpression: (value: unknown) => value is SchemaExpression;
export declare const fromAst: (ast: Expr) => SchemaExpression;
export declare const fromSql: (sql: string) => SchemaExpression;
export declare const parseExpression: (sql: string) => SchemaExpression;
export declare const toAst: (expression: SchemaExpression) => Expr;
export declare const render: (expression: SchemaExpression) => string;
export declare const normalize: (expression: SchemaExpression) => SchemaExpression;
