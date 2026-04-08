import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const cwd = process.cwd()
const packageDir = join(cwd, "packages", "querybuilder")
const tarballPath = async () => {
  const proc = Bun.spawn([
    "bunx",
    "npm",
    "pack",
    "--json",
    packageDir
  ], {
    cwd,
    stdout: "pipe",
    stderr: "inherit"
  })
  const stdout = await new Response(proc.stdout).text()
  const exitCode = await proc.exited
  if (exitCode !== 0) {
    process.exit(exitCode)
  }
  const start = stdout.indexOf("[")
  if (start === -1) {
    throw new Error(`Failed to parse npm pack output:\n${stdout}`)
  }
  const parsed = JSON.parse(stdout.slice(start)) as ReadonlyArray<{ readonly filename: string }>
  const filename = parsed[0]?.filename
  if (filename === undefined) {
    throw new Error(`npm pack did not return a filename:\n${stdout}`)
  }
  return resolve(cwd, filename)
}

const run = async (
  command: readonly string[],
  workdir: string
) => {
  const proc = Bun.spawn(command, {
    cwd: workdir,
    stdout: "inherit",
    stderr: "inherit"
  })
  const exitCode = await proc.exited
  if (exitCode !== 0) {
    process.exit(exitCode)
  }
}

const main = async () => {
  const packedTarball = await tarballPath()
  const consumerDir = await mkdtemp(join(tmpdir(), "effect-qb-pack-smoke-"))

  try {
    await Bun.write(join(consumerDir, "package.json"), `${JSON.stringify({
      name: "effect-qb-pack-smoke",
      private: true,
      type: "module",
      dependencies: {
        "effect-qb": `file:${packedTarball}`
      }
    }, null, 2)}\n`)

    await Bun.write(join(consumerDir, "tsconfig.json"), `${JSON.stringify({
      compilerOptions: {
        target: "ESNext",
        module: "Preserve",
        moduleResolution: "bundler",
        moduleDetection: "force",
        allowImportingTsExtensions: true,
        verbatimModuleSyntax: true,
        strict: true,
        noEmit: true,
        skipLibCheck: true
      },
      include: ["index.ts"]
    }, null, 2)}\n`)

    await Bun.write(join(consumerDir, "index.ts"), [
      'import { Column, Query, Table } from "effect-qb/postgres"',
      'import { tableKey } from "effect-qb/postgres/metadata"',
      "",
      'const users = Table.make("users", {',
      "  id: Column.uuid().pipe(Column.primaryKey),",
      "  email: Column.text()",
      "})",
      "",
      "const plan = Query.select({ id: users.id }).pipe(Query.from(users))",
      'const key = tableKey("public", "users")',
      "",
      "void plan",
      "void key",
      ""
    ].join("\n"))

    await run(["bun", "install", "--no-save"], consumerDir)
    await run([join(cwd, "node_modules", ".bin", "tsgo"), "-p", "tsconfig.json"], consumerDir)
  } finally {
    await rm(consumerDir, { recursive: true, force: true })
    await rm(packedTarball, { force: true })
  }
}

await main()
