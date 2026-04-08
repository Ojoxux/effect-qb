import type * as Expression from "../internal/scalar.js"
import type { ExpressionInput } from "../internal/query.js"
import { cast as postgresCast } from "./internal/dsl.js"

type CastInput = ExpressionInput
type CastTarget = Expression.DbType.Any
type CastExpression<Target extends CastTarget> = Expression.Scalar<
  Expression.RuntimeOfDbType<Target>,
  Target,
  Expression.Nullability,
  Target["dialect"],
  Expression.ScalarKind,
  Expression.BindingId
>

const to: {
  <Value extends CastInput, Target extends CastTarget>(
    value: Value,
    target: Target
  ): CastExpression<Target>
  <Target extends CastTarget>(
    target: Target
  ): <Value extends CastInput>(value: Value) => CastExpression<Target>
} = ((...args: [CastInput, CastTarget] | [CastTarget]) =>
  args.length === 1
    ? ((value: CastInput) => postgresCast(value as never, args[0] as never))
    : postgresCast(args[0] as never, args[1] as never)) as unknown as typeof to

/** Postgres cast helpers. */
export const cast = { to }
