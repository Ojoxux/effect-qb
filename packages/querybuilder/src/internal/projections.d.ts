import * as Expression from "./scalar.js";
/**
 * Flat projection metadata shared by renderers and executors.
 *
 * `path` identifies where a value should be decoded in the nested result row,
 * while `alias` is the flat SQL column alias used by the rendered query.
 */
export interface Projection {
    readonly path: readonly string[];
    readonly alias: string;
}
/** Selection leaf paired with its resolved projection alias. */
export interface FlattenedProjection {
    readonly path: readonly string[];
    readonly expression: Expression.Any;
    readonly alias: string;
}
/**
 * Flattens a nested selection object into leaf expressions with decode paths
 * and resolved SQL aliases.
 */
export declare const flattenSelection: (selection: Record<string, unknown>, path?: readonly string[]) => readonly FlattenedProjection[];
/**
 * Validates the flattened projection set shared by renderer and executor code.
 *
 * This rejects:
 * - duplicate SQL aliases
 * - duplicate decode paths
 * - conflicting prefix paths like `profile` and `profile.id`
 */
export declare const validateProjections: (projections: readonly Projection[]) => void;
