import { quoteDoubleQuotedIdentifier, type RenderState, type RenderValueContext, type SqlDialect } from "../../internal/dialect.js"
import { renderExpression, renderQueryAst } from "../../internal/dialect-renderers/sqlite.js"
import { toDriverValue } from "../../internal/runtime/driver-value-mapping.js"
import { standardDialect } from "../../standard/dialect.js"

const quoteIdentifier = quoteDoubleQuotedIdentifier

const renderLiteral = (value: unknown, state: RenderState, context: RenderValueContext = {}): string => {
  const driverValue = toDriverValue(value, {
    dialect: "sqlite",
    valueMappings: state.valueMappings,
    ...context
  })
  if (driverValue === null) {
    return "null"
  }
  state.params.push(driverValue)
  return "?"
}

/**
 * Built-in runtime dialect implementation for SQLite.
 */
export const sqliteDialect: SqlDialect<"sqlite"> = {
  ...standardDialect,
  name: "sqlite",
  quoteIdentifier,
  renderLiteral,
  renderTableReference(tableName, baseTableName, schemaName) {
    const renderedBase = schemaName
      ? `${quoteIdentifier(schemaName)}.${quoteIdentifier(baseTableName)}`
      : quoteIdentifier(baseTableName)
    return tableName === baseTableName
      ? renderedBase
      : `${renderedBase} as ${quoteIdentifier(tableName)}`
  },
  renderConcat(values) {
    return `(${values.join(" || ")})`
  },
  renderQueryAst,
  renderExpression
}
