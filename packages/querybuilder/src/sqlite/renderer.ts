import { pipeArguments, type Pipeable } from "effect/Pipeable"

import * as CoreRenderer from "../internal/renderer.js"
import * as Casing from "../internal/casing.js"
import type * as Expression from "../internal/scalar.js"
import type { SqliteDatatypeFamily, SqliteDatatypeKind } from "./datatypes/spec.js"
import { renderSqlitePlan } from "./internal/renderer.js"

/** SQLite-specialized rendered query shape. */
export type RenderedQuery<Row> = CoreRenderer.RenderedQuery<Row, "sqlite">
/** Extracts the row type carried by a SQLite rendered query. */
export type RowOf<Value extends RenderedQuery<any>> = CoreRenderer.RowOf<Value>
/** SQLite-specialized renderer contract. */
export type Renderer = CoreRenderer.Renderer<"sqlite"> & Pipeable & {
  readonly [Casing.TypeId]: Casing.State
  readonly withCasing: (options: Casing.Options) => Renderer
}

export type ValueMappings = Expression.DriverValueMappingsFor<SqliteDatatypeKind | "uuid", SqliteDatatypeFamily | "uuid">

export interface MakeOptions {
  readonly valueMappings?: ValueMappings
}

interface RendererState extends MakeOptions {
  readonly casing?: Casing.Options
}

export { TypeId } from "../internal/renderer.js"
export type { Projection } from "../internal/renderer.js"

const RendererProto = {
  pipe(this: Pipeable) {
    return pipeArguments(this, arguments)
  }
}

/** Creates the built-in SQLite renderer. */
const makeWithState = (state: RendererState = {}): Renderer => {
  const renderer = CoreRenderer.makeTrusted("sqlite", (plan) => renderSqlitePlan(plan, state))
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

/** Creates the built-in SQLite renderer. */
export const make = (options: MakeOptions = {}): Renderer =>
  makeWithState({ valueMappings: options.valueMappings })

/** Shared built-in SQLite renderer instance. */
export const sqlite = make()
