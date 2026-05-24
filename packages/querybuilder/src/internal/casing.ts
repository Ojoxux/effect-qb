export const TypeId: unique symbol = Symbol.for("effect-qb/Casing")

export type Style =
  | "preserve"
  | "snake_case"
  | "camelCase"
  | "PascalCase"
  | "kebab-case"
  | "SCREAMING_SNAKE_CASE"
  | ((name: string) => string)

export interface Options {
  readonly tables?: Style
  readonly columns?: Style
  readonly schemas?: Style
  readonly indexes?: Style
  readonly constraints?: Style
  readonly types?: Style
  readonly sequences?: Style
}

export type Category = keyof Options

export interface State {
  readonly casing?: Options
}

export const merge = (
  base: Options | undefined,
  override: Options | undefined
): Options | undefined => {
  if (base === undefined) {
    return override
  }
  if (override === undefined) {
    return base
  }
  return { ...base, ...override }
}

const words = (name: string): readonly string[] =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter((part) => part.length > 0)

const capitalize = (value: string): string =>
  value.length === 0 ? value : `${value[0]!.toUpperCase()}${value.slice(1)}`

const lowerWords = (name: string): readonly string[] =>
  words(name).map((part) => part.toLowerCase())

const applyNamedStyle = (style: Exclude<Style, (name: string) => string>, name: string): string => {
  switch (style) {
    case "preserve":
      return name
    case "snake_case":
      return lowerWords(name).join("_")
    case "camelCase": {
      const parts = lowerWords(name)
      const [head, ...tail] = parts
      return head === undefined ? "" : `${head}${tail.map(capitalize).join("")}`
    }
    case "PascalCase":
      return lowerWords(name).map(capitalize).join("")
    case "kebab-case":
      return lowerWords(name).join("-")
    case "SCREAMING_SNAKE_CASE":
      return lowerWords(name).join("_").toUpperCase()
  }
}

export const apply = (
  style: Style | undefined,
  name: string
): string => {
  if (style === undefined) {
    return name
  }
  return typeof style === "function" ? style(name) : applyNamedStyle(style, name)
}

export const applyCategory = (
  options: Options | undefined,
  category: Category,
  name: string
): string => apply(options?.[category], name)

