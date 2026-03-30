export {
  TypeId,
  fromAst,
  fromSql,
  isSchemaExpression,
  normalize,
  parseExpression,
  render,
  toAst,
  type Any,
  type SchemaExpression
} from "../internal/schema-expression.js"

export {
  normalizeDdlExpressionSql,
  renderDdlExpressionSql
} from "./internal/schema-ddl.js"
