// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 1352-1364

// README.md:1352-1364
import { Errors as PostgresErrors } from "effect-qb/postgres"

const error = PostgresErrors.normalizePostgresDriverError({
  code: "23505",
  message: "duplicate key value violates unique constraint",
  constraint: "users_email_key"
})

if (PostgresErrors.hasSqlState(error, "23505")) {
  error.constraintName
}

export {};
