import { query } from "@solidjs/router";
import * as v from "valibot";
import { GitHubActivitySchema } from "./github";

export const githubActivity = query(async () => {
  if (import.meta.env.SSR) {
    return (await import("../server/github")).getGitHubActivity();
  }
  try {
    const response = await fetch("/api/github");
    if (!response.ok) {
      return null;
    }
    const parsed = v.safeParse(GitHubActivitySchema, await response.json());
    if (!parsed.success) {
      return null;
    }
    return parsed.output;
  } catch {
    return null;
  }
}, "github-activity");
