import type { AnalyzeFormula, AssumeFactsFalse, AssumeFactsTrue, PredicateContext } from "./context.js"
import type { FormulaOfPredicate } from "./normalize.js"
import type { And, Not, PredicateFormula, TrueFormula } from "./formula.js"

type ContextOf<Formula extends PredicateFormula> = AnalyzeFormula<Formula>

export type EmptyFacts = AnalyzeFormula<TrueFormula>

export type FactsOfFormula<
  Formula extends PredicateFormula
> = AnalyzeFormula<Formula>

export interface PredicateState<
  Formula extends PredicateFormula = PredicateFormula,
  Facts extends PredicateContext = PredicateContext
> {
  readonly formula: Formula
  readonly facts: Facts
}

export type EmptyPredicateState = PredicateState<TrueFormula, EmptyFacts>

export type PredicateStateFormula<
  State extends PredicateState
> = State["formula"]

export type PredicateStateFacts<
  State extends PredicateState
> = State["facts"]

export type GuaranteedNonNullKeysInFacts<
  Facts extends PredicateContext
> = Facts["nonNullKeys"]

export type GuaranteedNullKeysInFacts<
  Facts extends PredicateContext
> = Facts["nullKeys"]

export type GuaranteedSourceNamesInFacts<
  Facts extends PredicateContext
> = Facts["sourceNames"]

export type GuaranteedLiteralSetInFacts<
  Facts extends PredicateContext,
  Key extends string
> = [Facts["literalSets"]] extends [{ readonly [K in Key]: infer Values }]
  ? Values
  : never

export type GuaranteedEqLiteralInFacts<
  Facts extends PredicateContext,
  Key extends string
> = [Facts["eqLiterals"]] extends [{ readonly [K in Key]: infer Values }]
  ? Values
  : never

export type GuaranteedNeqLiteralInFacts<
  Facts extends PredicateContext,
  Key extends string
> = [Facts["neqLiterals"]] extends [{ readonly [K in Key]: infer Values }]
  ? Values
  : never

export type GuaranteedJsonLiteralSetInFacts<
  Facts extends PredicateContext,
  ColumnKey extends string,
  Path extends string
> = [Facts["jsonLiteralSets"]] extends [{ readonly [C in ColumnKey]: { readonly [P in Path]: infer Values } }]
  ? Values
  : never

export type GuaranteedNonNullKeys<
  Assumptions extends PredicateFormula
> = ContextOf<Assumptions>["nonNullKeys"]

export type GuaranteedNullKeys<
  Assumptions extends PredicateFormula
> = ContextOf<Assumptions>["nullKeys"]

export type GuaranteedSourceNames<
  Assumptions extends PredicateFormula
> = ContextOf<Assumptions>["sourceNames"]

export type GuaranteedEqLiteral<
  Assumptions extends PredicateFormula,
  Key extends string
> = Key extends keyof ContextOf<Assumptions>["eqLiterals"]
  ? ContextOf<Assumptions>["eqLiterals"][Key]
  : never

export type GuaranteedLiteralSets<
  Assumptions extends PredicateFormula
> = ContextOf<Assumptions>["literalSets"]

export type GuaranteedLiteralSet<
  Assumptions extends PredicateFormula,
  Key extends string
> = Key extends keyof ContextOf<Assumptions>["literalSets"]
  ? ContextOf<Assumptions>["literalSets"][Key]
  : never

type IsContradiction<Formula extends PredicateFormula> =
  ContextOf<Formula>["contradiction"] extends true ? true : false

type ContradictoryAssumption<
  Assumptions extends PredicateFormula,
  Formula extends PredicateFormula
> = IsContradiction<And<Assumptions, Formula>>

type ContradictionFromNegation<
  Assumptions extends PredicateFormula,
  Formula extends PredicateFormula
> = IsContradiction<And<Assumptions, Not<Formula>>>

export type ContradictsFormula<
  Assumptions extends PredicateFormula,
  Formula extends PredicateFormula
> = ContradictoryAssumption<Assumptions, Formula>

export type ImpliesFormula<
  Assumptions extends PredicateFormula,
  Formula extends PredicateFormula
> = ContradictionFromNegation<Assumptions, Formula>

export type AssumeFormulaTrue<
  Assumptions extends PredicateFormula,
  Formula extends PredicateFormula
> = Assumptions extends TrueFormula
  ? Formula
  : And<Assumptions, Formula>

export type AssumeFormulaFalse<
  Assumptions extends PredicateFormula,
  Formula extends PredicateFormula
> = Assumptions extends TrueFormula
  ? Not<Formula>
  : And<Assumptions, Not<Formula>>

export type AssumeTrue<
  Assumptions extends PredicateFormula,
  Predicate
> = AssumeFormulaTrue<Assumptions, FormulaOfPredicate<Predicate>>

export type AssumeFalse<
  Assumptions extends PredicateFormula,
  Predicate
> = AssumeFormulaFalse<Assumptions, FormulaOfPredicate<Predicate>>

export type AssumePredicateStateFormulaTrue<
  State extends PredicateState,
  Formula extends PredicateFormula
> = PredicateState<
  AssumeFormulaTrue<PredicateStateFormula<State>, Formula>,
  AssumeFactsTrue<PredicateStateFacts<State>, Formula>
>

export type AssumePredicateStateFormulaFalse<
  State extends PredicateState,
  Formula extends PredicateFormula
> = PredicateState<
  AssumeFormulaFalse<PredicateStateFormula<State>, Formula>,
  AssumeFactsFalse<PredicateStateFacts<State>, Formula>
>

export type AssumePredicateStateTrue<
  State extends PredicateState,
  Predicate
> = AssumePredicateStateFormulaTrue<State, FormulaOfPredicate<Predicate>>

export type AssumePredicateStateFalse<
  State extends PredicateState,
  Predicate
> = AssumePredicateStateFormulaFalse<State, FormulaOfPredicate<Predicate>>

export type Contradicts<
  Assumptions extends PredicateFormula,
  Predicate
> = ContradictoryAssumption<Assumptions, FormulaOfPredicate<Predicate>>

export type Implies<
  Assumptions extends PredicateFormula,
  Predicate
> = ContradictionFromNegation<Assumptions, FormulaOfPredicate<Predicate>>
