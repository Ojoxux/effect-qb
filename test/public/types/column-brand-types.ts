import * as StdRoot from "effect-qb"
import * as Std from "effect-qb"
import type * as Brand from "effect/Brand";
import * as Schema from "effect/Schema";

import * as Mysql from "effect-qb/mysql";
import * as Postgres from "effect-qb/postgres";

type Assert<T extends true> = T;

const postgresAccounts = Std.Table.make("accounts", {
  id: Std.Column.uuid().pipe(Std.Column.primaryKey),
  nickname: Std.Column.text().pipe(Std.Column.nullable),
  age: Std.Column.int(),
});

const inlineBrandedPostgresAccounts = Std.Table.make("inline_accounts", {
  id: Std.Column.uuid().pipe(
    Std.Column.primaryKey,
    Std.Column.brand,
  ),
  nickname: Std.Column.text().pipe(
    Std.Column.nullable,
    Std.Column.brand,
  ),
  age: Std.Column.int().pipe(Std.Column.brand),
});

const brandedPostgresId = postgresAccounts.id.pipe(Std.Column.brand);
const brandedPostgresNickname = postgresAccounts.nickname.pipe(
  Std.Column.brand,
);
const brandedPostgresAge = postgresAccounts.age.pipe(Std.Column.brand);

type PostgresIdRuntime =
  (typeof brandedPostgresId)[StdRoot.Scalar.TypeId]["runtime"];
type PostgresNicknameRuntime =
  (typeof brandedPostgresNickname)[StdRoot.Scalar.TypeId]["runtime"];
type PostgresAgeSchema = Schema.Schema.Type<typeof brandedPostgresAge.schema>;
type InlineBrandedPostgresSelect = Std.Table.SelectOf<typeof inlineBrandedPostgresAccounts>;

type _AssertPostgresIdRuntime = Assert<
  PostgresIdRuntime extends string & Brand.Brand<"accounts.id"> ? true : false
>;
type _AssertPostgresNicknameRuntime = Assert<
  PostgresNicknameRuntime extends
    | (string & Brand.Brand<"accounts.nickname">)
    | null
    ? true
    : false
>;
type _AssertPostgresAgeSchema = Assert<
  PostgresAgeSchema extends number & Brand.Brand<"accounts.age"> ? true : false
>;
type _AssertInlineBrandedPostgresId = Assert<
  InlineBrandedPostgresSelect["id"] extends string &
    Brand.Brand<"inline_accounts.id">
    ? true
    : false
>;
type _AssertInlineBrandedPostgresNickname = Assert<
  InlineBrandedPostgresSelect["nickname"] extends
    | (string & Brand.Brand<"inline_accounts.nickname">)
    | null
    ? true
    : false
>;
type _AssertInlineBrandedPostgresAge = Assert<
  InlineBrandedPostgresSelect["age"] extends number &
    Brand.Brand<"inline_accounts.age">
    ? true
    : false
>;

const postgresPlan = StdRoot.Query.select({
  id: brandedPostgresId,
  nickname: brandedPostgresNickname,
  age: brandedPostgresAge,
}).pipe(StdRoot.Query.from(postgresAccounts));

const inlineBrandedPostgresPlan = StdRoot.Query.select({
  id: inlineBrandedPostgresAccounts.id,
  nickname: inlineBrandedPostgresAccounts.nickname,
  age: inlineBrandedPostgresAccounts.age,
}).pipe(StdRoot.Query.from(inlineBrandedPostgresAccounts));

type PostgresRow = StdRoot.Query.ResultRow<typeof postgresPlan>;
type InlineBrandedPostgresRow = StdRoot.Query.ResultRow<
  typeof inlineBrandedPostgresPlan
>;

type _AssertPostgresRowId = Assert<
  PostgresRow["id"] extends string & Brand.Brand<"accounts.id"> ? true : false
>;
type _AssertPostgresRowNickname = Assert<
  PostgresRow["nickname"] extends
    | (string & Brand.Brand<"accounts.nickname">)
    | null
    ? true
    : false
>;
type _AssertPostgresRowAge = Assert<
  PostgresRow["age"] extends number & Brand.Brand<"accounts.age"> ? true : false
>;
type _AssertInlineBrandedPostgresRowId = Assert<
  InlineBrandedPostgresRow["id"] extends string &
    Brand.Brand<"inline_accounts.id">
    ? true
    : false
>;
type _AssertInlineBrandedPostgresRowNickname = Assert<
  InlineBrandedPostgresRow["nickname"] extends
    | (string & Brand.Brand<"inline_accounts.nickname">)
    | null
    ? true
    : false
>;
type _AssertInlineBrandedPostgresRowAge = Assert<
  InlineBrandedPostgresRow["age"] extends number &
    Brand.Brand<"inline_accounts.age">
    ? true
    : false
>;

const aliasedPostgresAccounts = Std.Table.alias(postgresAccounts, "u");

const aliasedPostgresPlan = StdRoot.Query.select({
  id: postgresAccounts.id.pipe(Std.Column.brand),
  aliasedId: aliasedPostgresAccounts.id.pipe(Std.Column.brand),
}).pipe(
  StdRoot.Query.from(postgresAccounts),
  StdRoot.Query.innerJoin(
    aliasedPostgresAccounts,
    StdRoot.Query.eq(postgresAccounts.id, aliasedPostgresAccounts.id),
  ),
);

type AliasedPostgresRow = StdRoot.Query.ResultRow<typeof aliasedPostgresPlan>;

type _AssertAliasedPostgresRowId = Assert<
  AliasedPostgresRow["id"] extends string & Brand.Brand<"accounts.id">
    ? true
    : false
>;
type _AssertAliasedPostgresRowAliasedId = Assert<
  AliasedPostgresRow["aliasedId"] extends string & Brand.Brand<"u.id">
    ? true
    : false
>;

const loadAccount = (id: AliasedPostgresRow["id"]) => id;
declare const aliasedPostgresRow: AliasedPostgresRow;

// @ts-expect-error aliases derive a distinct provenance brand
loadAccount(aliasedPostgresRow.aliasedId);

const mysqlAccounts = Std.Table.make("mysql_accounts", {
  id: Std.Column.uuid().pipe(Std.Column.primaryKey),
  email: Std.Column.text(),
  quota: Std.Column.int(),
});

const brandedMysqlEmail = mysqlAccounts.email.pipe(Std.Column.brand);
const brandedMysqlQuota = mysqlAccounts.quota.pipe(Std.Column.brand);

type MysqlEmailRuntime =
  (typeof brandedMysqlEmail)[StdRoot.Scalar.TypeId]["runtime"];
type MysqlQuotaSchema = Schema.Schema.Type<typeof brandedMysqlQuota.schema>;

type _AssertMysqlEmailRuntime = Assert<
  MysqlEmailRuntime extends string & Brand.Brand<"mysql_accounts.email">
    ? true
    : false
>;
type _AssertMysqlQuotaSchema = Assert<
  MysqlQuotaSchema extends number & Brand.Brand<"mysql_accounts.quota">
    ? true
    : false
>;

const mysqlPlan = StdRoot.Query.select({
  email: brandedMysqlEmail,
  quota: brandedMysqlQuota,
}).pipe(StdRoot.Query.from(mysqlAccounts));

type MysqlRow = StdRoot.Query.ResultRow<typeof mysqlPlan>;

type _AssertMysqlRowEmail = Assert<
  MysqlRow["email"] extends string & Brand.Brand<"mysql_accounts.email">
    ? true
    : false
>;
type _AssertMysqlRowQuota = Assert<
  MysqlRow["quota"] extends number & Brand.Brand<"mysql_accounts.quota">
    ? true
    : false
>;

const brandedReferenceUsers = Std.Table.make("branded_reference_users", {
  id: Std.Column.uuid().pipe(Std.Column.primaryKey, Std.Column.brand),
  email: Std.Column.text(),
});

const brandedReferenceSessions = Std.Table.make("branded_reference_sessions", {
  userId: Std.Column.uuid().pipe(
    Std.Column.references(() => brandedReferenceUsers.id),
  ),
});

void brandedPostgresId;
void brandedPostgresNickname;
void brandedPostgresAge;
void postgresPlan;
void aliasedPostgresAccounts;
void aliasedPostgresPlan;
void inlineBrandedPostgresAccounts;
void inlineBrandedPostgresPlan;
void brandedMysqlEmail;
void brandedMysqlQuota;
void mysqlPlan;
void brandedReferenceSessions;
