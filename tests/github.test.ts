import assert from "node:assert/strict";
import { test } from "node:test";
import { getGitHubActivity } from "../src/server/github.ts";
import { githubPayload } from "./fixtures/github.ts";

test("GitHub failures return a fallback and a later request can recover", {
  timeout: 10000,
}, async (t) => {
  const previousToken = process.env.GITHUB_TOKEN;
  t.after(() => {
    if (previousToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previousToken;
  });
  const fetchMock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("No request should be sent without a token");
  });
  delete process.env.GITHUB_TOKEN;
  assert.equal(await getGitHubActivity(), null);
  assert.equal(fetchMock.mock.callCount(), 0);
  process.env.GITHUB_TOKEN = "test-token";

  for (const response of [
    () => new Response(null, { status: 401 }),
    () => new Response("not JSON"),
    () => Response.json({ errors: [{ message: "Rate limited" }] }),
    () => Response.json({ data: { user: null } }),
  ]) {
    fetchMock.mock.mockImplementation(async () => response());
    const before = fetchMock.mock.callCount();
    assert.equal(await getGitHubActivity(), null);
    assert.equal(fetchMock.mock.callCount(), before + 1);
  }

  let aborted = false;
  fetchMock.mock.mockImplementation(
    (...[, options]: Parameters<typeof fetch>) =>
      new Promise<Response>((_, reject) => {
        options?.signal?.addEventListener(
          "abort",
          () => {
            aborted = true;
            reject(new Error("Request aborted"));
          },
          { once: true },
        );
      }),
  );
  assert.equal(await getGitHubActivity(), null);
  assert.equal(aborted, true);

  fetchMock.mock.mockImplementation(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return Response.json(githubPayload);
  });
  const before = fetchMock.mock.callCount();
  const activities = await Promise.all(Array.from({ length: 8 }, () => getGitHubActivity()));
  assert.equal(fetchMock.mock.callCount(), before + 8);
  const activity = activities[0];
  for (const result of activities) assert.deepEqual(result, activity);
  assert.ok(activity);
  assert.equal(activity.pullRequests[0]?.title, githubPayload.data.pullRequests.nodes[0].title);
  const requests = fetchMock.mock.callCount();
  assert.deepEqual(await getGitHubActivity(), activity);
  assert.equal(fetchMock.mock.callCount(), requests);
});
