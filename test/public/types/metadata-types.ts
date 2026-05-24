import * as Postgres from "effect-qb/postgres";
import { toEnumModel } from "effect-qb/postgres/metadata";

const status = Postgres.Schema.make("public").enum("status", ["pending", "active"] as const);
const authStatus = Postgres.Schema.make("auth").enum("auth_status", ["pending", "active"] as const);

const enumModel = toEnumModel(status);
const authEnumModel = toEnumModel(authStatus);

void enumModel;
void authEnumModel;
