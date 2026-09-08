import { Effect } from "effect";
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/unstable/http";
import * as v from "valibot";
import { CalendarSchema, PullRequestSchema } from "../lib/github.ts";

const payload = v.object({
  data: v.object({
    pullRequests: v.object({ nodes: v.array(PullRequestSchema) }),
    user: v.object({
      contributionsCollection: v.object({
        contributionCalendar: CalendarSchema,
      }),
    }),
  }),
});

const fetchActivity = Effect.gen(function* () {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient);
  const request = yield* HttpClientRequest.post("https://api.github.com/graphql", {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "phinner.dev",
    },
  }).pipe(
    HttpClientRequest.bodyJson({
      query: `{
        user(login: "phinner") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { date contributionCount contributionLevel } }
            }
          }
        }
        pullRequests: search(
          query: "is:pr is:public author:phinner archived:false sort:updated-desc"
          type: ISSUE
          first: 3
        ) {
          nodes {
            ... on PullRequest { title url number state repository { nameWithOwner } }
          }
        }
      }`,
    }),
  );
  const response = yield* client.execute(request);
  const result = v.safeParse(payload, yield* response.json);

  return result.success
    ? {
        calendar: result.output.data.user.contributionsCollection.contributionCalendar,
        pullRequests: result.output.data.pullRequests.nodes,
      }
    : null;
}).pipe(
  Effect.provide(FetchHttpClient.layer),
  Effect.timeout("3 seconds"),
  Effect.catch(() => Effect.succeed(null)),
);

const [cached, invalidate] = Effect.runSync(
  Effect.cachedInvalidateWithTTL(fetchActivity, "5 minutes"),
);

export const getGitHubActivity = () =>
  Effect.runPromise(
    cached.pipe(Effect.tap((activity) => (activity === null ? invalidate : Effect.void))),
  );
