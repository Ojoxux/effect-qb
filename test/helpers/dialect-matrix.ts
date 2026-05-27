import { Function, Query } from "#standard"

export const buildGroupedConcatPlan = (_dialect: any, users: any, posts: any) => {
  const selected = Query.select({
    emailLabel: Function.concat(
      Function.lower(users.email),
      "-",
      Function.coalesce(Function.max(posts.title), "missing")
    ),
    firstTitle: Function.min(posts.title),
    postCount: Function.count(posts.id)
  })

  const fromUsers = Query.from(users)(selected)
  const joined = Query.innerJoin(posts, Query.eq(users.id, posts.userId))(fromUsers)
  const grouped = Query.groupBy(Function.lower(users.email))(joined)
  const filtered = Query.having(Query.eq(Function.count(posts.id), 2))(grouped)
  return Query.orderBy(Function.count(posts.id), "desc")(filtered)
}
