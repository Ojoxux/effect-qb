import * as StdRoot from "effect-qb"
import * as Std from "effect-qb"
import * as Mysql from "effect-qb/mysql"
import * as Postgres from "effect-qb/postgres"
import { Query as Q } from "effect-qb"
import type { BrandedErrorOf, BrandedHintOf } from "../../helpers/branded-error.ts"

type IsExact<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2)
    ? (<T>() => T extends B ? 1 : 2) extends
        (<T>() => T extends A ? 1 : 2)
      ? true
      : false
    : false

type Assert<T extends true> = T

const users = Std.Table.make("users", {
  id: Std.Column.uuid().pipe(Std.Column.primaryKey),
  email: Std.Column.text()
})

const posts = Std.Table.make("posts", {
  id: Std.Column.uuid().pipe(Std.Column.primaryKey),
  userId: Std.Column.uuid()
})

const active = Q.select({
  email: users.email
}).pipe(
  Q.from(users)
)

const archived = Q.select({
  email: users.email
}).pipe(
  Q.from(users)
)

const unionAllPlan = Q.unionAll(active, archived)
const intersectAllPlan = Q.intersectAll(active, archived)
const exceptAllPlan = Q.exceptAll(active, archived)

type UnionAllRow = Q.ResultRow<typeof unionAllPlan>
type IntersectAllRow = Q.ResultRow<typeof intersectAllPlan>
type ExceptAllRow = Q.ResultRow<typeof exceptAllPlan>

const unionAllEmail: UnionAllRow["email"] = "alice@example.com"
const intersectAllEmail: IntersectAllRow["email"] = "alice@example.com"
const exceptAllEmail: ExceptAllRow["email"] = "alice@example.com"
void unionAllEmail
void intersectAllEmail
void exceptAllEmail

const replacedFromSource = Q.select({
  id: users.id
}).pipe(
  Q.from(users),
  // @ts-expect-error select plans accept only one from(...) source; use joins for additional sources
  Q.from(posts)
)
void replacedFromSource

const valuesSource = StdRoot.Query.values([
  { id: StdRoot.Query.literal(1), email: StdRoot.Query.literal("alice@example.com") },
  { id: StdRoot.Query.literal(2), email: StdRoot.Query.literal("bob@example.com") }
] as const).pipe(StdRoot.Query.as("seed"))
declare const dynamicValuesAlias: string
StdRoot.Query.values([
  { id: StdRoot.Query.literal(1), email: StdRoot.Query.literal("alice@example.com") }
] as const).pipe(
  // @ts-expect-error values aliases must be literal strings
  StdRoot.Query.as(dynamicValuesAlias)
)
StdRoot.Query.values([
  { id: StdRoot.Query.literal(1), email: StdRoot.Query.literal("alice@example.com") }
] as const).pipe(
  // @ts-expect-error values aliases must be non-empty
  StdRoot.Query.as("")
)

const valuesPlan = StdRoot.Query.select({
  id: valuesSource.id,
  email: valuesSource.email
})

type ValuesRow = Q.ResultRow<typeof valuesPlan>
type ValuesStatement = Q.StatementOfPlan<typeof valuesPlan>
const valuesId: ValuesRow["id"] = 1
const valuesIdSecondRow: ValuesRow["id"] = 2
const valuesEmail: ValuesRow["email"] = "alice@example.com"
type _AssertValuesStatement = Assert<IsExact<ValuesStatement, "select">>
// @ts-expect-error values row ids stay numeric literals
const badValuesId: ValuesRow["id"] = "wrong"
void badValuesId
void valuesId
void valuesIdSecondRow
void valuesEmail

const nullableValuesSource = StdRoot.Query.values([
  { id: StdRoot.Query.literal(1), bio: StdRoot.Query.literal("writer") },
  { id: StdRoot.Query.literal(2), bio: StdRoot.Query.literal(null) }
] as const).pipe(StdRoot.Query.as("nullable_seed"))

const filteredValuesPlan = StdRoot.Query.select({
  id: nullableValuesSource.id,
  bio: nullableValuesSource.bio
}).pipe(
  StdRoot.Query.where(StdRoot.Query.isNotNull(nullableValuesSource.bio))
)

type FilteredValuesRow = Q.ResultRow<typeof filteredValuesPlan>
const filteredValuesBio: FilteredValuesRow["bio"] = "writer"
// @ts-expect-error structured from(...) should preserve non-null facts from earlier filters
const filteredValuesNullBio: FilteredValuesRow["bio"] = null
void filteredValuesBio
void filteredValuesNullBio

// @ts-expect-error values rows must project the same columns
const invalidValuesRows = StdRoot.Query.values([
  { id: StdRoot.Query.literal(1), email: StdRoot.Query.literal("alice@example.com") },
  { id: StdRoot.Query.literal(2), name: StdRoot.Query.literal("Bob") }
] as const)
void invalidValuesRows

// @ts-expect-error values rows must project at least one column
const emptyValuesRows = StdRoot.Query.values([
  {}
] as const)
void emptyValuesRows

const unnestSource = StdRoot.Query.unnest({
  id: [StdRoot.Query.literal(1), StdRoot.Query.literal(2)] as const,
  email: [StdRoot.Query.literal("alice@example.com"), StdRoot.Query.literal("bob@example.com")] as const
}, "seed_rows")
StdRoot.Query.unnest(
  {
    id: [StdRoot.Query.literal(1)] as const
  },
  // @ts-expect-error unnest aliases must be literal strings
  dynamicValuesAlias
)
StdRoot.Query.unnest(
  {
    id: [StdRoot.Query.literal(1)] as const
  },
  // @ts-expect-error unnest aliases must be non-empty
  ""
)

// @ts-expect-error unnest column arrays must have the same length
const invalidUnnestLengths = StdRoot.Query.unnest({
  id: [StdRoot.Query.literal(1), StdRoot.Query.literal(2)] as const,
  email: [StdRoot.Query.literal("alice@example.com")] as const
}, "invalid_seed_rows")
void invalidUnnestLengths

const emptyUnnestRows = StdRoot.Query.unnest({
  // @ts-expect-error unnest column arrays must contain at least one value
  id: [] as const
}, "empty_seed_rows")
void emptyUnnestRows

const unnestPlan = StdRoot.Query.select({
  id: unnestSource.id,
  email: unnestSource.email
})

type UnnestRow = Q.ResultRow<typeof unnestPlan>
type UnnestStatement = Q.StatementOfPlan<typeof unnestPlan>
const unnestId: UnnestRow["id"] = 1
const unnestEmail: UnnestRow["email"] = "bob@example.com"
type _AssertUnnestStatement = Assert<IsExact<UnnestStatement, "select">>
// @ts-expect-error unnest row ids stay numeric literals
const badUnnestId: UnnestRow["id"] = "wrong"
void badUnnestId
void unnestId
void unnestEmail

const seriesSource = Postgres.Query.generateSeries(1, 3, 1, "series")
// @ts-expect-error generateSeries aliases must be literal strings
Postgres.Query.generateSeries(1, 3, 1, dynamicValuesAlias)
// @ts-expect-error generateSeries aliases must be non-empty
Postgres.Query.generateSeries(1, 3, 1, "")
const seriesPlan = StdRoot.Query.select({
  value: seriesSource.value
}).pipe(
  StdRoot.Query.from(seriesSource)
)

type SeriesRow = Q.ResultRow<typeof seriesPlan>
type SeriesStatement = Q.StatementOfPlan<typeof seriesPlan>
const seriesValue: SeriesRow["value"] = 1
type _AssertSeriesStatement = Assert<IsExact<SeriesStatement, "select">>
// @ts-expect-error generateSeries rows stay numeric literals
const badSeriesValue: SeriesRow["value"] = "wrong"
void badSeriesValue
void seriesValue

const scalarPlan = StdRoot.Query.select({
  value: StdRoot.Query.scalar(
    StdRoot.Query.select({
      value: users.id
    }).pipe(
      StdRoot.Query.from(users)
    )
  ),
  inSubqueryValue: StdRoot.Query.inSubquery(
    users.id,
    StdRoot.Query.select({
      value: users.id
    }).pipe(
      StdRoot.Query.from(users)
    )
  )
}).pipe(
  StdRoot.Query.from(users)
)

type ScalarRow = Q.ResultRow<typeof scalarPlan>
const scalarValue: ScalarRow["value"] = "user-id"
const scalarNull: ScalarRow["value"] = null
const scalarInValue: ScalarRow["inSubqueryValue"] = true
void scalarValue
void scalarNull
void scalarInValue

// @ts-expect-error selections require unique aliases after path flattening
const derivedAliasCollisionSubquery = StdRoot.Query.select({
  "user__id": users.id,
  user: {
    id: users.email
  }
}).pipe(
  StdRoot.Query.from(users)
)

void derivedAliasCollisionSubquery

const derivedAliasedProjectionSubquery = StdRoot.Query.select({
  value: StdRoot.Query.as(users.id, "renamed_value")
}).pipe(
  StdRoot.Query.from(users)
)

// @ts-expect-error derived subqueries require path-based projection aliases
const derivedAliasedProjectionSource = StdRoot.Query.as(derivedAliasedProjectionSubquery, "derived_alias")
void derivedAliasedProjectionSource

const groupedSubqueryIds = StdRoot.Query.select({
  value: users.id
}).pipe(
  StdRoot.Query.from(users)
)
const groupedInSubqueryValue = StdRoot.Query.inSubquery(users.id, groupedSubqueryIds)
const groupedInSubqueryPlan = StdRoot.Query.select({
  matchesAny: groupedInSubqueryValue,
  rowCount: StdRoot.Function.count(users.id)
}).pipe(
  StdRoot.Query.from(users),
  StdRoot.Query.groupBy(groupedInSubqueryValue)
)

const completeGroupedInSubqueryPlan: StdRoot.Query.CompletePlan<typeof groupedInSubqueryPlan> =
  groupedInSubqueryPlan
void completeGroupedInSubqueryPlan

const mysqlValuesSource = StdRoot.Query.values([
  { id: StdRoot.Query.literal(1), email: StdRoot.Query.literal("alice@example.com") },
  { id: StdRoot.Query.literal(2), email: StdRoot.Query.literal("bob@example.com") }
] as const).pipe(StdRoot.Query.as("seed"))

const mysqlValuesPlan = StdRoot.Query.select({
  id: mysqlValuesSource.id,
  email: mysqlValuesSource.email
})

type MysqlValuesRow = StdRoot.Query.ResultRow<typeof mysqlValuesPlan>
type MysqlValuesStatement = StdRoot.Query.StatementOfPlan<typeof mysqlValuesPlan>
const mysqlValuesId: MysqlValuesRow["id"] = 1
const mysqlValuesIdSecondRow: MysqlValuesRow["id"] = 2
const mysqlValuesEmail: MysqlValuesRow["email"] = "alice@example.com"
type _AssertMysqlValuesStatement = Assert<IsExact<MysqlValuesStatement, "select">>
// @ts-expect-error mysql values row ids stay numeric literals
const badMysqlValuesId: MysqlValuesRow["id"] = "wrong"
void badMysqlValuesId
void mysqlValuesId
void mysqlValuesIdSecondRow
void mysqlValuesEmail

// @ts-expect-error mysql values rows must project the same columns
const invalidMysqlValuesRows = StdRoot.Query.values([
  { id: StdRoot.Query.literal(1), email: StdRoot.Query.literal("alice@example.com") },
  { id: StdRoot.Query.literal(2), name: StdRoot.Query.literal("Bob") }
] as const)
void invalidMysqlValuesRows

// @ts-expect-error mysql values rows must project at least one column
const emptyMysqlValuesRows = StdRoot.Query.values([
  {}
] as const)
void emptyMysqlValuesRows

const mysqlUnnestSource = StdRoot.Query.unnest({
  id: [StdRoot.Query.literal(1), StdRoot.Query.literal(2)] as const,
  email: [StdRoot.Query.literal("alice@example.com"), StdRoot.Query.literal("bob@example.com")] as const
}, "seed_rows")

// @ts-expect-error mysql unnest column arrays must have the same length
const invalidMysqlUnnestLengths = StdRoot.Query.unnest({
  id: [StdRoot.Query.literal(1), StdRoot.Query.literal(2)] as const,
  email: [StdRoot.Query.literal("alice@example.com")] as const
}, "invalid_seed_rows")
void invalidMysqlUnnestLengths

const emptyMysqlUnnestRows = StdRoot.Query.unnest({
  // @ts-expect-error mysql unnest column arrays must contain at least one value
  id: [] as const
}, "empty_seed_rows")
void emptyMysqlUnnestRows

const mysqlUnnestPlan = StdRoot.Query.select({
  id: mysqlUnnestSource.id,
  email: mysqlUnnestSource.email
})

type MysqlUnnestRow = StdRoot.Query.ResultRow<typeof mysqlUnnestPlan>
type MysqlUnnestStatement = StdRoot.Query.StatementOfPlan<typeof mysqlUnnestPlan>
const mysqlUnnestId: MysqlUnnestRow["id"] = 1
const mysqlUnnestEmail: MysqlUnnestRow["email"] = "bob@example.com"
type _AssertMysqlUnnestStatement = Assert<IsExact<MysqlUnnestStatement, "select">>
// @ts-expect-error mysql unnest row ids stay numeric literals
const badMysqlUnnestId: MysqlUnnestRow["id"] = "wrong"
void badMysqlUnnestId
void mysqlUnnestId
void mysqlUnnestEmail

void unionAllPlan
void intersectAllPlan
void exceptAllPlan
void valuesPlan
void unnestPlan
void seriesPlan
void scalarPlan
void mysqlValuesPlan
void mysqlUnnestPlan
