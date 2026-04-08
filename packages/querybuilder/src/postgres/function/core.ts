import type { ExpressionInput } from "../query.js"
import {
  call,
  cast,
  coalesce,
  literal,
  nextVal as nextValInternal,
  type as postgresType,
  uuidGenerateV4
} from "../internal/dsl.js"
import { isSequenceDefinition, type SequenceDefinition } from "../schema-management.js"

/** Postgres scalar core functions. */
export { coalesce, call, uuidGenerateV4 }
export const nextVal = (
  value: ExpressionInput | SequenceDefinition<string, string | undefined>
) =>
  nextValInternal(
    isSequenceDefinition(value)
      ? cast(literal(value.qualifiedName()), postgresType.regclass())
      : value
  )
