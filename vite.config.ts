import { execFileSync } from "node:child_process";
import { defineConfig, loadEnv } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig(({ command, mode }) => {
  const commit = (() => {
    const supplied = process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA;
    if (supplied && /^[a-f\d]{7,40}$/i.test(supplied)) return supplied;
    try {
      return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    } catch {
      return "";
    }
  })();

  if (command === "serve") {
    const { GITHUB_TOKEN } = loadEnv(mode, process.cwd(), "GITHUB_TOKEN");
    if (GITHUB_TOKEN) process.env.GITHUB_TOKEN = GITHUB_TOKEN;
  }

  return {
    define: { __COMMIT_SHA__: JSON.stringify(commit) },
    plugins: [
      solid({
        start: { middleware: "src/server/middleware.ts" },
        ssr: true,
        refresh: { granular: false },
      }),
      {
        name: "phinner.dev:ssr-preserve-entry-names",
        config: () => ({
          environments: {
            ssr: {
              build: {
                rollupOptions: { output: { entryFileNames: "[name].js" } },
              },
            },
          },
        }),
      },
    ],
    server: { host: "127.0.0.1", port: 4321 },
    environments: {
      ssr: {
        build: { rollupOptions: { input: { node: "src/server/node.ts" } } },
      },
    },
    build: { target: "esnext", assetsInlineLimit: 0 },
  };
});
