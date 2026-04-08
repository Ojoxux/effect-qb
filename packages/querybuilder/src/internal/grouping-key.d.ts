import * as Expression from "./scalar.js";
export declare const groupingKeyOfExpression: (expression: Expression.Any) => string;
export declare const dedupeGroupedExpressions: <Values extends readonly Expression.Any[]>(values: Values) => Values;
