import { expect, test } from "bun:test"

import {
  canonicalizePostgresTypeName,
  inferPostgresTypeKind
} from "../../../packages/database/src/internal/postgres-type-utils.js"

test("canonicalizes quoted postgres builtin type names", () => {
  expect(canonicalizePostgresTypeName("\"char\"")).toBe("char")
  expect(canonicalizePostgresTypeName("\"char\"[]")).toBe("char[]")
  expect(inferPostgresTypeKind("\"char\"")).toBe("char")
  expect(inferPostgresTypeKind("\"char\"[]")).toBe("char[]")
})

test("canonicalizes quoted qualified postgres type names", () => {
  expect(canonicalizePostgresTypeName("\"public\".\"status\"[]")).toBe("public.status[]")
  expect(canonicalizePostgresTypeName("\"AuditSchema\".\"StatusType\"[]")).toBe("\"AuditSchema\".\"StatusType\"[]")
  expect(canonicalizePostgresTypeName("\"audit\"\"schema\".\"status\"\"type\"[]")).toBe("\"audit\"\"schema\".\"status\"\"type\"[]")
})
