import type * as Expression from "../scalar.js";
import type { JsonPathUsageError } from "./errors.js";
import type { JsonBuildArray as JsonBuildArrayResult, JsonBuildObject as JsonBuildObjectResult, JsonConcatResult, JsonDeleteAtPath, JsonLiteralInput, JsonStripNullsResult as JsonStripNullsResultValue, JsonValueAtPath, JsonSetAtPath } from "./types.js";
import type { JsonKeysResult as JsonKeysResultValue, JsonLengthResult as JsonLengthResultValue, JsonTextResult as JsonTextResultValue, JsonTypeName as JsonTypeNameValue } from "./types.js";
export declare const SegmentTypeId: unique symbol;
export type SegmentTypeId = typeof SegmentTypeId;
export declare const TypeId: unique symbol;
export type TypeId = typeof TypeId;
type SegmentState<Kind extends string> = {
    readonly kind: Kind;
};
export interface KeySegment<Key extends string = string> {
    readonly [SegmentTypeId]: SegmentState<"key">;
    readonly kind: "key";
    readonly key: Key;
}
export interface IndexSegment<Index extends number = number> {
    readonly [SegmentTypeId]: SegmentState<"index">;
    readonly kind: "index";
    readonly index: Index;
}
export interface WildcardSegment {
    readonly [SegmentTypeId]: SegmentState<"wildcard">;
    readonly kind: "wildcard";
}
export interface SliceSegment<Start extends number | undefined = number | undefined, End extends number | undefined = number | undefined> {
    readonly [SegmentTypeId]: SegmentState<"slice">;
    readonly kind: "slice";
    readonly start: Start;
    readonly end: End;
}
export interface DescendSegment {
    readonly [SegmentTypeId]: SegmentState<"descend">;
    readonly kind: "descend";
}
export type CanonicalSegment = KeySegment | IndexSegment | WildcardSegment | SliceSegment | DescendSegment;
export type AnySegment = any;
export type ExactSegment = KeySegment | IndexSegment;
type PathState<Segments extends readonly CanonicalSegment[]> = {
    readonly segments: Segments;
};
export interface Path<Segments extends readonly CanonicalSegment[] = readonly CanonicalSegment[]> {
    readonly [TypeId]: PathState<Segments>;
    readonly segments: Segments;
}
export type JsonPath<Segments extends readonly CanonicalSegment[] = readonly CanonicalSegment[]> = Path<Segments>;
export type JsonPathSegments = readonly CanonicalSegment[];
export type JsonPrimitive = JsonLiteralInput;
export type JsonLiteral = JsonLiteralInput;
export type JsonInput = Expression.Any | JsonLiteral;
export declare const key: <Key extends string>(value: Key) => KeySegment<Key>;
export declare const index: <Index extends number>(value: Index) => IndexSegment<Index>;
export declare const wildcard: () => WildcardSegment;
export declare const slice: <Start extends number | undefined = undefined, End extends number | undefined = undefined>(start?: Start | undefined, end?: End | undefined) => SliceSegment<Start, End>;
export declare const descend: () => DescendSegment;
export declare const path: <Segments extends readonly CanonicalSegment[]>(...segments: Segments) => Path<Segments>;
export declare const makeJsonPath: <Segments extends readonly CanonicalSegment[]>(...segments: Segments) => Path<Segments>;
export type SegmentsOf<Value extends Path<any>> = Value[typeof TypeId]["segments"];
export type IsExactSegment<Segment extends CanonicalSegment> = Segment extends ExactSegment ? true : false;
export type IsExactPath<PathValue extends Path<any>> = SegmentsOf<PathValue> extends readonly [infer Head extends CanonicalSegment, ...infer Tail extends readonly CanonicalSegment[]] ? IsExactSegment<Head> extends true ? Tail extends readonly [] ? true : IsExactPath<Path<Tail>> : false : true;
export type JsonPathValue<Root, PathValue extends Path<any>, Operation extends string = "json.get"> = JsonValueAtPath<Root, PathValue, Operation>;
export type JsonPathOutput<Root, PathValue extends Path<any>, Operation extends string = "json.get"> = JsonValueAtPath<Root, PathValue, Operation>;
export type JsonPathCompatible<Root, PathValue extends Path<any>, Operation extends string = "json.get"> = JsonValueAtPath<Root, PathValue, Operation> extends JsonPathUsageError<any, any, any, any> ? JsonValueAtPath<Root, PathValue, Operation> : PathValue;
export type JsonPathUpdate<Root, PathValue extends Path<any>, Next, Operation extends string = "json.set"> = JsonSetAtPath<Root, PathValue, Next, Operation>;
export type JsonPathDelete<Root, PathValue extends Path<any>, Operation extends string = "json.delete"> = JsonDeleteAtPath<Root, PathValue, Operation>;
export type JsonConcat<Left, Right> = JsonConcatResult<Left, Right>;
export type JsonBuildObject<Shape extends Record<string, JsonInput>> = JsonBuildObjectResult<Shape>;
export type JsonBuildArray<Values extends readonly JsonInput[]> = JsonBuildArrayResult<Values>;
export type JsonTextResult<Value> = JsonTextResultValue<Value>;
export type JsonTypeName<Value> = JsonTypeNameValue<Value>;
export type JsonLengthResult<Value> = JsonLengthResultValue<Value>;
export type JsonKeysResult<Value> = JsonKeysResultValue<Value>;
export type JsonStripNullsResult<Value> = JsonStripNullsResultValue<Value>;
export type JsonValueOfInput<Input> = Input extends Expression.Any ? Expression.RuntimeOf<Input> : Input extends JsonLiteral ? Input : never;
export {};
