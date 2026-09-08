export const githubPayload = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 1,
          weeks: [
            {
              contributionDays: [
                { date: "2026-09-06", contributionCount: 1, contributionLevel: "FIRST_QUARTILE" },
              ],
            },
          ],
        },
      },
    },
    pullRequests: {
      nodes: [
        {
          title: "Handle <input> & preserve its text",
          url: "https://github.com/example/project/pull/42",
          number: 42,
          state: "MERGED",
          repository: { nameWithOwner: "example/project" },
        },
      ],
    },
  },
};
