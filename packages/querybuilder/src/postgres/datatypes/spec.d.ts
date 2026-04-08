export declare const postgresDatatypeFamilies: {
    readonly text: {
        readonly compareGroup: "text";
        readonly castTargets: readonly ["text", "numeric", "boolean", "date", "time", "timestamp", "interval", "binary", "uuid", "json", "xml", "bit", "oid", "identifier", "network", "spatial", "textsearch", "range", "multirange", "array", "money", "null"];
        readonly traits: {
            readonly textual: true;
            readonly ordered: true;
        };
    };
    readonly numeric: {
        readonly compareGroup: "numeric";
        readonly castTargets: readonly ["numeric", "text", "boolean", "date", "time", "timestamp", "interval", "uuid", "bit", "oid", "money"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly boolean: {
        readonly compareGroup: "boolean";
        readonly castTargets: readonly ["boolean", "text", "numeric"];
        readonly traits: {};
    };
    readonly date: {
        readonly compareGroup: "date";
        readonly castTargets: readonly ["date", "timestamp", "text"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly time: {
        readonly compareGroup: "time";
        readonly castTargets: readonly ["time", "timestamp", "text"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly timestamp: {
        readonly compareGroup: "timestamp";
        readonly castTargets: readonly ["timestamp", "date", "text"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly interval: {
        readonly compareGroup: "interval";
        readonly castTargets: readonly ["interval", "text"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly binary: {
        readonly compareGroup: "binary";
        readonly castTargets: readonly ["binary", "text"];
        readonly traits: {};
    };
    readonly uuid: {
        readonly compareGroup: "uuid";
        readonly castTargets: readonly ["uuid", "text"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly json: {
        readonly compareGroup: "json";
        readonly castTargets: readonly ["json", "text"];
        readonly traits: {};
    };
    readonly xml: {
        readonly compareGroup: "xml";
        readonly castTargets: readonly ["xml", "text"];
        readonly traits: {};
    };
    readonly bit: {
        readonly compareGroup: "bit";
        readonly castTargets: readonly ["bit", "text", "numeric"];
        readonly traits: {};
    };
    readonly oid: {
        readonly compareGroup: "oid";
        readonly castTargets: readonly ["oid", "text", "numeric"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly identifier: {
        readonly compareGroup: "identifier";
        readonly castTargets: readonly ["identifier", "text"];
        readonly traits: {};
    };
    readonly network: {
        readonly compareGroup: "network";
        readonly castTargets: readonly ["network", "text"];
        readonly traits: {};
    };
    readonly spatial: {
        readonly compareGroup: "spatial";
        readonly castTargets: readonly ["spatial", "text"];
        readonly traits: {};
    };
    readonly textsearch: {
        readonly compareGroup: "textsearch";
        readonly castTargets: readonly ["textsearch", "text"];
        readonly traits: {};
    };
    readonly range: {
        readonly compareGroup: "range";
        readonly castTargets: readonly ["range", "text"];
        readonly traits: {};
    };
    readonly multirange: {
        readonly compareGroup: "multirange";
        readonly castTargets: readonly ["multirange", "text"];
        readonly traits: {};
    };
    readonly enum: {
        readonly compareGroup: "enum";
        readonly castTargets: readonly ["enum", "text"];
        readonly traits: {
            readonly textual: true;
            readonly ordered: true;
        };
    };
    readonly record: {
        readonly compareGroup: "record";
        readonly castTargets: readonly ["record", "text"];
        readonly traits: {};
    };
    readonly array: {
        readonly compareGroup: "array";
        readonly castTargets: readonly ["array", "text"];
        readonly traits: {};
    };
    readonly money: {
        readonly compareGroup: "money";
        readonly castTargets: readonly ["money", "text", "numeric"];
        readonly traits: {
            readonly ordered: true;
        };
    };
    readonly null: {
        readonly compareGroup: "null";
        readonly castTargets: readonly ["text", "numeric", "boolean", "date", "time", "timestamp", "interval", "binary", "uuid", "json", "xml", "bit", "oid", "identifier", "network", "spatial", "textsearch", "range", "multirange", "array", "money", "null"];
        readonly traits: {};
    };
};
export declare const postgresDatatypeKinds: {
    readonly text: {
        readonly family: "text";
        readonly runtime: "string";
    };
    readonly varchar: {
        readonly family: "text";
        readonly runtime: "string";
    };
    readonly char: {
        readonly family: "text";
        readonly runtime: "string";
    };
    readonly citext: {
        readonly family: "text";
        readonly runtime: "string";
    };
    readonly name: {
        readonly family: "text";
        readonly runtime: "string";
    };
    readonly uuid: {
        readonly family: "uuid";
        readonly runtime: "string";
    };
    readonly int2: {
        readonly family: "numeric";
        readonly runtime: "number";
    };
    readonly int4: {
        readonly family: "numeric";
        readonly runtime: "number";
    };
    readonly int8: {
        readonly family: "numeric";
        readonly runtime: "bigintString";
    };
    readonly numeric: {
        readonly family: "numeric";
        readonly runtime: "decimalString";
    };
    readonly float4: {
        readonly family: "numeric";
        readonly runtime: "number";
    };
    readonly float8: {
        readonly family: "numeric";
        readonly runtime: "number";
    };
    readonly money: {
        readonly family: "money";
        readonly runtime: "number";
    };
    readonly bool: {
        readonly family: "boolean";
        readonly runtime: "boolean";
    };
    readonly date: {
        readonly family: "date";
        readonly runtime: "localDate";
    };
    readonly time: {
        readonly family: "time";
        readonly runtime: "localTime";
    };
    readonly timetz: {
        readonly family: "time";
        readonly runtime: "offsetTime";
    };
    readonly timestamp: {
        readonly family: "timestamp";
        readonly runtime: "localDateTime";
    };
    readonly timestamptz: {
        readonly family: "timestamp";
        readonly runtime: "instant";
    };
    readonly interval: {
        readonly family: "interval";
        readonly runtime: "string";
    };
    readonly bytea: {
        readonly family: "binary";
        readonly runtime: "bytes";
    };
    readonly json: {
        readonly family: "json";
        readonly runtime: "json";
    };
    readonly jsonb: {
        readonly family: "json";
        readonly runtime: "json";
    };
    readonly xml: {
        readonly family: "xml";
        readonly runtime: "string";
    };
    readonly bit: {
        readonly family: "bit";
        readonly runtime: "string";
    };
    readonly varbit: {
        readonly family: "bit";
        readonly runtime: "string";
    };
    readonly oid: {
        readonly family: "oid";
        readonly runtime: "number";
    };
    readonly xid: {
        readonly family: "oid";
        readonly runtime: "number";
    };
    readonly xid8: {
        readonly family: "oid";
        readonly runtime: "bigintString";
    };
    readonly cid: {
        readonly family: "oid";
        readonly runtime: "number";
    };
    readonly tid: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regclass: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regtype: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regproc: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regprocedure: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regoper: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regoperator: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regconfig: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly regdictionary: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly pg_lsn: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly txid_snapshot: {
        readonly family: "identifier";
        readonly runtime: "string";
    };
    readonly inet: {
        readonly family: "network";
        readonly runtime: "string";
    };
    readonly cidr: {
        readonly family: "network";
        readonly runtime: "string";
    };
    readonly macaddr: {
        readonly family: "network";
        readonly runtime: "string";
    };
    readonly macaddr8: {
        readonly family: "network";
        readonly runtime: "string";
    };
    readonly point: {
        readonly family: "spatial";
        readonly runtime: "unknown";
    };
    readonly line: {
        readonly family: "spatial";
        readonly runtime: "unknown";
    };
    readonly lseg: {
        readonly family: "spatial";
        readonly runtime: "unknown";
    };
    readonly box: {
        readonly family: "spatial";
        readonly runtime: "unknown";
    };
    readonly path: {
        readonly family: "spatial";
        readonly runtime: "unknown";
    };
    readonly polygon: {
        readonly family: "spatial";
        readonly runtime: "unknown";
    };
    readonly circle: {
        readonly family: "spatial";
        readonly runtime: "unknown";
    };
    readonly tsvector: {
        readonly family: "textsearch";
        readonly runtime: "string";
    };
    readonly tsquery: {
        readonly family: "textsearch";
        readonly runtime: "string";
    };
    readonly int4range: {
        readonly family: "range";
        readonly runtime: "unknown";
    };
    readonly int8range: {
        readonly family: "range";
        readonly runtime: "unknown";
    };
    readonly numrange: {
        readonly family: "range";
        readonly runtime: "unknown";
    };
    readonly tsrange: {
        readonly family: "range";
        readonly runtime: "unknown";
    };
    readonly tstzrange: {
        readonly family: "range";
        readonly runtime: "unknown";
    };
    readonly daterange: {
        readonly family: "range";
        readonly runtime: "unknown";
    };
    readonly int4multirange: {
        readonly family: "multirange";
        readonly runtime: "unknown";
    };
    readonly int8multirange: {
        readonly family: "multirange";
        readonly runtime: "unknown";
    };
    readonly nummultirange: {
        readonly family: "multirange";
        readonly runtime: "unknown";
    };
    readonly tsmultirange: {
        readonly family: "multirange";
        readonly runtime: "unknown";
    };
    readonly tstzmultirange: {
        readonly family: "multirange";
        readonly runtime: "unknown";
    };
    readonly datemultirange: {
        readonly family: "multirange";
        readonly runtime: "unknown";
    };
};
export type PostgresDatatypeFamily = keyof typeof postgresDatatypeFamilies;
export type PostgresDatatypeKind = keyof typeof postgresDatatypeKinds;
