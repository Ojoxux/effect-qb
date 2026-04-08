import * as Plan from "./row-set.js";
import type { PredicateFormula } from "./predicate/formula.js";
import type { SourceLike } from "./query.js";
export interface ImplicationScope {
    readonly assumptions: PredicateFormula;
    readonly nonNullKeys: ReadonlySet<string>;
    readonly nullKeys: ReadonlySet<string>;
    readonly requiredSourceNames: ReadonlySet<string>;
    readonly absentSourceNames: ReadonlySet<string>;
    readonly sourceModes: ReadonlyMap<string, Plan.SourceMode>;
}
export declare const presentFormulaOfSource: (source: Plan.Source<string, Plan.SourceMode, PredicateFormula, never>) => PredicateFormula;
export declare const presenceWitnessesOfSource: (source: Plan.Source<string, Plan.SourceMode, PredicateFormula, never>) => ReadonlySet<string>;
export declare const presenceWitnessesOfSourceLike: (source: SourceLike) => readonly string[];
export declare const resolveImplicationScope: (available: Readonly<Record<string, Plan.Source<string, Plan.SourceMode, PredicateFormula, never>>>, initialAssumptions: PredicateFormula) => ImplicationScope;
