import * as Expression from "./scalar.js"
import * as ExpressionAst from "./expression-ast.js"
import { groupingKeyOfExpression } from "./grouping-key.js"

/** Recursive selection value accepted by aggregate-shape validation. */
export type SelectionValue =
  | Expression.Any
  | {
      readonly [key: string]: SelectionValue
    }

const isExpression = (value: unknown): value is Expression.Any =>
  typeof value === "object" && value !== null && Expression.TypeId in value

const expressionAst = (expression: Expression.Any): ExpressionAst.Any =>
  (expression as Expression.Any & {
    readonly [ExpressionAst.TypeId]: ExpressionAst.Any
  })[ExpressionAst.TypeId]

const optionalExpressionHasAggregate = (expression: unknown): boolean =>
  isExpression(expression) && expressionHasAggregate(expression)

const expressionHasAggregate = (expression: Expression.Any): boolean => {
  if (expression[Expression.TypeId].kind === "aggregate") {
    return true
  }
  const ast = expressionAst(expression)
  switch (ast.kind) {
    case "cast":
    case "collate":
    case "isNull":
    case "isNotNull":
    case "not":
    case "upper":
    case "lower":
    case "count":
    case "max":
    case "min":
      return optionalExpressionHasAggregate(ast.value)
    case "eq":
    case "neq":
    case "lt":
    case "lte":
    case "gt":
    case "gte":
    case "like":
    case "ilike":
    case "regexMatch":
    case "regexIMatch":
    case "regexNotMatch":
    case "regexNotIMatch":
    case "isDistinctFrom":
    case "isNotDistinctFrom":
    case "contains":
    case "containedBy":
    case "overlaps":
    case "jsonConcat":
    case "jsonMerge":
      return optionalExpressionHasAggregate(ast.left) || optionalExpressionHasAggregate(ast.right)
    case "and":
    case "or":
    case "coalesce":
    case "concat":
    case "in":
    case "notIn":
    case "between":
    case "jsonBuildArray":
      return Array.isArray(ast.values) && ast.values.some(optionalExpressionHasAggregate)
    case "function":
      return Array.isArray(ast.args) && ast.args.some(optionalExpressionHasAggregate)
    case "case":
      return Array.isArray(ast.branches) &&
        ast.branches.some((branch) =>
          typeof branch === "object" &&
          branch !== null &&
          (optionalExpressionHasAggregate((branch as ExpressionAst.CaseBranchNode).when) ||
            optionalExpressionHasAggregate((branch as ExpressionAst.CaseBranchNode).then))) ||
        optionalExpressionHasAggregate(ast.else)
    case "inSubquery":
    case "comparisonAny":
    case "comparisonAll":
      return optionalExpressionHasAggregate(ast.left)
    case "window":
      return false
    case "jsonGet":
    case "jsonPath":
    case "jsonAccess":
    case "jsonTraverse":
    case "jsonGetText":
    case "jsonPathText":
    case "jsonAccessText":
    case "jsonTraverseText":
    case "jsonHasKey":
    case "jsonKeyExists":
    case "jsonHasAnyKeys":
    case "jsonHasAllKeys":
    case "jsonDelete":
    case "jsonDeletePath":
    case "jsonRemove":
    case "jsonPathExists":
    case "jsonPathMatch":
      return optionalExpressionHasAggregate(ast.base)
    case "jsonSet":
      return optionalExpressionHasAggregate(ast.base) || optionalExpressionHasAggregate(ast.newValue)
    case "jsonInsert":
      return optionalExpressionHasAggregate(ast.base) || optionalExpressionHasAggregate(ast.insert)
    case "jsonBuildObject":
      return Array.isArray(ast.entries) &&
        ast.entries.some((entry) =>
          typeof entry === "object" &&
          entry !== null &&
          optionalExpressionHasAggregate(entry.value))
    case "jsonToJson":
    case "jsonToJsonb":
    case "jsonTypeOf":
    case "jsonLength":
    case "jsonKeys":
    case "jsonStripNulls":
      return optionalExpressionHasAggregate(ast.value)
    default:
      return false
  }
}

const selectionHasAggregate = (selection: SelectionValue): boolean => {
  if (isExpression(selection)) {
    return expressionHasAggregate(selection)
  }
  return Object.values(selection).some((value) => selectionHasAggregate(value))
}

const expressionsHaveAggregate = (expressions: readonly Expression.Any[]): boolean =>
  expressions.some(expressionHasAggregate)

const hasDependencies = (expression: Expression.Any): boolean =>
  Object.keys(expression[Expression.TypeId].dependencies).length > 0

const isGroupedAggregateExpressionValid = (
  expression: Expression.Any,
  groupedExpressions: ReadonlySet<string>
): boolean => {
  const aggregation = expression[Expression.TypeId].kind
  if (aggregation === "aggregate") {
    return true
  }
  if (aggregation === "window") {
    return false
  }
  if (!hasDependencies(expression)) {
    return true
  }
  if (groupedExpressions.has(groupingKeyOfExpression(expression))) {
    return true
  }
  const ast = expressionAst(expression)
  switch (ast.kind) {
    case "cast":
    case "collate":
    case "upper":
    case "lower":
      return isGroupedAggregateExpressionValid(ast.value, groupedExpressions)
    case "eq":
    case "neq":
    case "lt":
    case "lte":
    case "gt":
    case "gte":
    case "like":
    case "ilike":
    case "regexMatch":
    case "regexIMatch":
    case "regexNotMatch":
    case "regexNotIMatch":
    case "isDistinctFrom":
    case "isNotDistinctFrom":
    case "contains":
    case "containedBy":
    case "overlaps":
    case "jsonConcat":
    case "jsonMerge":
      return ast.left !== undefined &&
        ast.right !== undefined &&
        isGroupedAggregateExpressionValid(ast.left, groupedExpressions) &&
        isGroupedAggregateExpressionValid(ast.right, groupedExpressions)
    case "and":
    case "or":
    case "coalesce":
    case "concat":
    case "in":
    case "notIn":
    case "between":
    case "jsonBuildArray":
      return Array.isArray(ast.values) &&
        ast.values.every((value) => isGroupedAggregateExpressionValid(value, groupedExpressions))
    case "function":
      return Array.isArray(ast.args) &&
        ast.args.every((value) => isGroupedAggregateExpressionValid(value, groupedExpressions))
    case "case":
      return Array.isArray(ast.branches) &&
        ast.branches.every((branch) =>
          typeof branch === "object" &&
          branch !== null &&
          isExpression((branch as ExpressionAst.CaseBranchNode).when) &&
          isExpression((branch as ExpressionAst.CaseBranchNode).then) &&
          isGroupedAggregateExpressionValid(branch.when, groupedExpressions) &&
          isGroupedAggregateExpressionValid(branch.then, groupedExpressions)) &&
        isExpression(ast.else) &&
        isGroupedAggregateExpressionValid(ast.else, groupedExpressions)
    case "jsonBuildObject":
      return Array.isArray(ast.entries) &&
        ast.entries.every((entry) =>
          typeof entry === "object" &&
          entry !== null &&
          isExpression(entry.value) &&
          isGroupedAggregateExpressionValid(entry.value, groupedExpressions))
    default:
      return false
  }
}

const isGroupedSelectionValid = (
  selection: SelectionValue,
  groupedExpressions: ReadonlySet<string>
): boolean => {
  if (isExpression(selection)) {
    const aggregation = selection[Expression.TypeId].kind
    if (aggregation === "aggregate") {
      return true
    }
    if (aggregation === "window") {
      return false
    }
    if (Object.keys(selection[Expression.TypeId].dependencies).length === 0) {
      return true
    }
    if (groupedExpressions.has(groupingKeyOfExpression(selection))) {
      return true
    }
    return expressionHasAggregate(selection)
      ? isGroupedAggregateExpressionValid(selection, groupedExpressions)
      : false
  }
  return Object.values(selection).every((value) => isGroupedSelectionValid(value, groupedExpressions))
}

const isGroupedHavingPredicateValid = (
  expression: Expression.Any,
  groupedExpressions: ReadonlySet<string>
): boolean => {
  const aggregation = expression[Expression.TypeId].kind
  if (aggregation === "aggregate") {
    return true
  }
  if (aggregation === "window") {
    return false
  }
  if (!hasDependencies(expression)) {
    return true
  }
  if (groupedExpressions.has(groupingKeyOfExpression(expression))) {
    return true
  }
  const ast = expressionAst(expression)
  switch (ast.kind) {
    case "eq":
    case "neq":
    case "lt":
    case "lte":
    case "gt":
    case "gte":
    case "like":
    case "ilike":
    case "regexMatch":
    case "regexIMatch":
    case "regexNotMatch":
    case "regexNotIMatch":
    case "isDistinctFrom":
    case "isNotDistinctFrom":
    case "contains":
    case "containedBy":
    case "overlaps":
      return isGroupedHavingPredicateValid(ast.left, groupedExpressions) &&
        isGroupedHavingPredicateValid(ast.right, groupedExpressions)
    case "and":
    case "or":
    case "in":
    case "notIn":
    case "between":
      return ast.values.every((value) => isGroupedHavingPredicateValid(value, groupedExpressions))
    case "isNull":
    case "isNotNull":
    case "not":
      return isGroupedHavingPredicateValid(ast.value, groupedExpressions)
    default:
      return false
  }
}

/**
 * Validates that grouped/scalar selection mixing is legal for the provided
 * `groupBy(...)` expressions.
 */
export const validateAggregationSelection = (
  selection: SelectionValue,
  grouped: readonly Expression.Any[],
  having: readonly Expression.Any[] = [],
  orderBy: readonly Expression.Any[] = []
): void => {
  const groupedExpressions = new Set(grouped.map(groupingKeyOfExpression))
  const hasAggregate = selectionHasAggregate(selection)
  const hasHavingAggregate = expressionsHaveAggregate(having)
  const hasOrderByAggregate = expressionsHaveAggregate(orderBy)
  const requiresGroupedValidation = hasAggregate || hasHavingAggregate || hasOrderByAggregate || grouped.length > 0
  const isValid = requiresGroupedValidation
    ? isGroupedSelectionValid(selection, groupedExpressions)
    : true
  if (!isValid) {
    throw new Error("Invalid grouped selection: scalar expressions must be covered by groupBy(...) when aggregates are present")
  }
  if (requiresGroupedValidation &&
    !having.every((predicate) => isGroupedHavingPredicateValid(predicate, groupedExpressions))) {
    throw new Error("Invalid grouped selection: scalar expressions must be covered by groupBy(...) when aggregates are present")
  }
  if (requiresGroupedValidation &&
    !orderBy.every((term) => isGroupedAggregateExpressionValid(term, groupedExpressions))) {
    throw new Error("Invalid grouped selection: scalar expressions must be covered by groupBy(...) when aggregates are present")
  }
}
