import { describe, expect, test } from "bun:test"
import * as Schema from "effect/Schema"

import { JsonPrimitiveSchema, JsonValueSchema } from "#internal/runtime/value.ts"

describe("runtime value schemas", () => {
  test("JsonValueSchema rejects non-finite numbers", () => {
    const isJsonValue = Schema.is(JsonValueSchema)

    expect(isJsonValue(Number.NaN)).toBe(false)
    expect(isJsonValue(Number.POSITIVE_INFINITY)).toBe(false)
    expect(isJsonValue(Number.NEGATIVE_INFINITY)).toBe(false)
  })

  test("JsonPrimitiveSchema rejects non-finite numbers", () => {
    const isJsonPrimitive = Schema.is(JsonPrimitiveSchema)

    expect(isJsonPrimitive(Number.NaN)).toBe(false)
    expect(isJsonPrimitive(Number.POSITIVE_INFINITY)).toBe(false)
    expect(isJsonPrimitive(Number.NEGATIVE_INFINITY)).toBe(false)
  })
})
