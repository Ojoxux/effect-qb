import type * as Expression from "../internal/scalar.js"
import type * as ExpressionAst from "../internal/expression-ast.js"
import type { ExpressionInput } from "../internal/query.js"
import { cast as postgresCast } from "./internal/dsl.js"

type CastInput = ExpressionInput
type CastTarget = Expression.DbType.Any
type CastNullability<Value extends CastInput> = Value extends Expression.Any
  ? Expression.NullabilityOf<Value>
  : Value extends null ? "always" : "never"
type CastKind<Value extends CastInput> = Value extends Expression.Any
  ? Expression.KindOf<Value>
  : "scalar"
type CastDependencies<Value extends CastInput> = Value extends Expression.Any
  ? Expression.DependenciesOf<Value>
  : never
type CastExpression<
  Value extends CastInput,
  Target extends CastTarget
> = Expression.Scalar<
  Expression.RuntimeOfDbType<Target>,
  Target,
  CastNullability<Value>,
  Target["dialect"],
  CastKind<Value>,
  CastDependencies<Value>
> & {
  readonly [ExpressionAst.TypeId]: ExpressionAst.CastNode<Value extends Expression.Any ? Value : Expression.Any, Target>
}

const to: {
  <Value extends CastInput, Target extends CastTarget>(
    value: Value,
    target: Target
  ): CastExpression<Value, Target>
  <Target extends CastTarget>(
    target: Target
  ): <Value extends CastInput>(value: Value) => CastExpression<Value, Target>
} = ((...args: [CastInput, CastTarget] | [CastTarget]) =>
  args.length === 1
    ? ((value: CastInput) => postgresCast(value as never, args[0] as never))
    : postgresCast(args[0] as never, args[1] as never)) as unknown as typeof to

/** Postgres cast helpers. */
export const cast = { to }
