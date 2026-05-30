// Generated from README.md.
// Do not edit directly; update README.md and rerun `bun run generate:readme-types`.
// Code fences: 196-226

// README.md:196-226
import { Check, Column, ForeignKey, Index, PrimaryKey, Query, Table, Unique } from "effect-qb"

const organizations = Table.make("organizations", {
  id: Column.uuid().pipe(Column.primaryKey),
  name: Column.text(),
  archivedAt: Column.datetime().pipe(Column.nullable)
})

const membershipsBase = Table.make("memberships", {
  orgId: Column.uuid(),
  userId: Column.uuid(),
  role: Column.text()
})

const memberships = membershipsBase.pipe(
  ForeignKey.make("orgId", () => organizations, "id"),
  PrimaryKey.make(["orgId", "userId"] as const),
  Unique.make(["orgId", "role"] as const),
  Check.make(
    "memberships_role_check",
    Query.neq(membershipsBase.role, "")
  ),
  Index.make("userId")
)

type Organization = Table.SelectOf<typeof organizations>
type NewOrganization = Table.InsertOf<typeof organizations>
type OrganizationPatch = Table.UpdateOf<typeof organizations>


export {};
