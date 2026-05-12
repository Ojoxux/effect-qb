import { mkdtemp, rm } from "node:fs/promises"
import { join } from "node:path"

import { describe, expect, test } from "bun:test"

import { readMigrationFiles } from "effect-db/postgres/migrate"

const repoRoot = process.cwd()

describe("postgres migrations", () => {
  test("parses up and down sections and normalizes checksum line endings", async () => {
    const tempDir = await mkdtemp(join(repoRoot, "test/.tmp-postgres-migrate-"))
    try {
      const contents = [
        "-- effect-db:up",
        "create table users (id integer);",
        "-- effect-db:down",
        "drop table users;",
        ""
      ].join("\n")

      await Bun.write(join(tempDir, "0001_lf.sql"), contents)
      await Bun.write(join(tempDir, "0002_crlf.sql"), contents.replaceAll("\n", "\r\n"))

      const files = await readMigrationFiles(tempDir)

      expect(files.map((file) => file.name)).toEqual([
        "0001_lf.sql",
        "0002_crlf.sql"
      ])
      expect(files[0]?.sql).toBe("create table users (id integer);")
      expect(files[0]?.downSql).toBe("drop table users;")
      expect(files[0]?.checksum).toBe(files[1]?.checksum)
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })
})
