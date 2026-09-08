import * as v from "valibot";

const CountSchema = v.pipe(v.number(), v.integer(), v.minValue(0));

export const CalendarSchema = v.object({
  totalContributions: CountSchema,
  weeks: v.pipe(
    v.array(
      v.object({
        contributionDays: v.pipe(
          v.array(
            v.object({
              date: v.pipe(v.string(), v.isoDate()),
              contributionCount: CountSchema,
              contributionLevel: v.picklist([
                "NONE",
                "FIRST_QUARTILE",
                "SECOND_QUARTILE",
                "THIRD_QUARTILE",
                "FOURTH_QUARTILE",
              ]),
            }),
          ),
          v.maxLength(7),
        ),
      }),
    ),
    v.minLength(1),
    v.maxLength(54),
  ),
});

export type Calendar = v.InferOutput<typeof CalendarSchema>;

export const PullRequestSchema = v.object({
  title: v.string(),
  url: v.pipe(v.string(), v.regex(/^https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+$/)),
  number: v.pipe(v.number(), v.integer(), v.minValue(1)),
  state: v.picklist(["OPEN", "CLOSED", "MERGED"]),
  repository: v.object({ nameWithOwner: v.string() }),
});

export const GitHubActivitySchema = v.object({
  calendar: CalendarSchema,
  pullRequests: v.array(PullRequestSchema),
});
