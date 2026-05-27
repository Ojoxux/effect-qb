// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 818-837

// README.md:818-837
import { Scalar } from "effect-qb"
import * as Pg from "effect-qb/postgres"

const mapping: Scalar.DriverValueMapping = {
  fromDriver: (value) => value,
  toDriver: (value) => value,
  selectSql: (sql) => sql,
  jsonSelectSql: (sql) => sql
}

const renderer = Pg.Renderer.make({
  valueMappings: {
    text: mapping,
    jsonb: mapping,
    string: mapping
  }
})


export {};
