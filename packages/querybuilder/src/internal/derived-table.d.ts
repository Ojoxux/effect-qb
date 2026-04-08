import { type CompletePlan, type CteSource, type DerivedSource, type LateralSource, type QueryPlan } from "./query.js";
export declare const makeDerivedSource: <PlanValue extends QueryPlan<any, any, any, any, any, any, any, any, any, any>, Alias extends string>(plan: CompletePlan<PlanValue>, alias: Alias) => DerivedSource<PlanValue, Alias>;
export declare const makeCteSource: <PlanValue extends QueryPlan<any, any, any, any, any, any, any, any, any, any>, Alias extends string>(plan: CompletePlan<PlanValue>, alias: Alias, recursive?: boolean) => CteSource<PlanValue, Alias>;
export declare const makeLateralSource: <PlanValue extends QueryPlan<any, any, any, any, any, any, any, any, any, any>, Alias extends string>(plan: PlanValue, alias: Alias) => LateralSource<PlanValue, Alias>;
