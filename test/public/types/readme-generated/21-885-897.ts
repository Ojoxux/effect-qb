// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 885-897

// README.md:885-897
import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import * as Pg from "effect-qb/postgres"

const driver = Pg.Executor.driver({
  execute: () => Effect.succeed([]),
  stream: () => Stream.empty
})

const executor = Pg.Executor.make({ driver })


export {};
