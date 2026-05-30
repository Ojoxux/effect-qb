import * as Std from "effect-qb"
import * as Schema from "effect/Schema";

import { Function as F, Json, Query as Q } from "effect-qb"

const docs = Std.Table.make("docs", {
  id: Std.Column.uuid().pipe(Std.Column.primaryKey),
  payload: Std.Column.json(
    Schema.Struct({
      profile: Schema.Struct({
        address: Schema.Struct({
          city: Schema.String,
          postcode: Schema.NullOr(Schema.String),
        }),
        tags: Schema.Array(Schema.String),
      }),
      note: Schema.NullOr(Schema.String),
    }),
  ),
});

const compatibleObject = Json.buildObject({
  profile: {
    address: {
      city: "Macon",
      postcode: "1000",
    },
    tags: ["travel"],
  },
  note: null,
});

const incompatibleObject = compatibleObject.pipe(
  Json.key("profile"),
  Json.key("address"),
  Json.key("city"),
  Json.delete,
);

Q.insert(docs, {
  id: "doc-1",
  // @ts-expect-error nested json output must still satisfy the column schema
  payload: incompatibleObject,
});
