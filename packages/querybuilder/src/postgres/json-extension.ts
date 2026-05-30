import { json } from "./json.js"

/** Removes null object fields using Postgres json/jsonb strip-null functions. */
export const stripNulls = json.stripNulls

/** Evaluates a Postgres SQL/JSON path predicate with the @@ operator. */
export const pathMatch = json.pathMatch
