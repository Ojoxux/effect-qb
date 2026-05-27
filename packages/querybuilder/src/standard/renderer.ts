import { pipeArguments, type Pipeable } from "effect/Pipeable"

import * as CoreRenderer from "../internal/renderer.js"
import * as Casing from "../internal/casing.js"
import type * as Expression from "../internal/scalar.js"
import type { StandardDatatypeFamily, StandardDatatypeKind } from "./datatypes/spec.js"
import { renderStandardPlan } from "./internal/renderer.js"

export type RenderedQuery<Row> = CoreRenderer.RenderedQuery<Row, "standard">

export type RowOf<Value extends RenderedQuery<any>> = CoreRenderer.RowOf<Value>

export type Renderer = CoreRenderer.Renderer<"standard"> & Pipeable & {
  readonly [Casing.TypeId]: Casing.State
  readonly withCasing: (options: Casing.Options) => Renderer
}

export type ValueMappings = Expression.DriverValueMappingsFor<StandardDatatypeKind | "uuid", StandardDatatypeFamily | "uuid">

export interface MakeOptions {
  readonly valueMappings?: ValueMappings
}

interface RendererState extends MakeOptions {
  readonly casing?: Casing.Options
}

const RendererProto = {
  pipe(this: Pipeable) {
    return pipeArguments(this, arguments)
  }
}

const makeWithState = (state: RendererState = {}): Renderer => {
  const renderer = CoreRenderer.makeTrusted("standard", (plan) => renderStandardPlan(plan, state))
  return Object.assign(Object.create(RendererProto), renderer, {
    [Casing.TypeId]: {
      casing: state.casing
    },
    withCasing: (override: Casing.Options) =>
      makeWithState({
        ...state,
        casing: Casing.merge(state.casing, override)
      })
  }) as Renderer
}

export const make = (options: MakeOptions = {}): Renderer =>
  makeWithState({ valueMappings: options.valueMappings })
