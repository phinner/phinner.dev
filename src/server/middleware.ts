import { type FetchMiddleware, parseCookieHeader, serializeCookie } from "@solidjs/web";
import { SitemapStream, streamToPromise } from "sitemap";
import { resolveLanguage } from "../lib/language";
import { PROJECT_NAMES } from "../projects/types";
import { getGitHubActivity } from "./github";

const middleware: FetchMiddleware = async (request, next) => {
  const pathname = new URL(request.url).pathname;

  if (pathname === "/sitemap.xml") {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }
    const sitemap = new SitemapStream({ hostname: "https://phinner.dev" });
    const xml = streamToPromise(sitemap);
    for (const url of ["/", "/projects", ...PROJECT_NAMES.map((name) => `/projects/${name}`)]) {
      sitemap.write({ url });
    }
    sitemap.end();
    const body = (await xml).toString();
    return new Response(request.method === "HEAD" ? null : body, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  if (pathname === "/api/github") {
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }
    const activity = await getGitHubActivity();
    return Response.json(activity, {
      headers: { "Cache-Control": activity ? "public, max-age=300" : "no-store" },
    });
  }

  const response = await next();
  if (!response.headers.get("content-type")?.includes("text/html")) return response;

  const headers = new Headers(response.headers);
  headers.set(
    "Content-Language",
    resolveLanguage(
      parseCookieHeader(request.headers.get("cookie")).lang,
      request.headers.get("accept-language"),
    ),
  );

  const saved = parseCookieHeader(request.headers.get("cookie")).lang;
  if (saved === "en" || saved === "fr") {
    headers.append(
      "Set-Cookie",
      serializeCookie("lang", saved, {
        path: "/",
        sameSite: "lax",
        secure: new URL(request.url).protocol === "https:",
        maxAge: 60 * 60 * 24 * 365,
      }),
    );
  }

  headers.set("Cache-Control", "no-store");
  headers.append("Vary", "Cookie, Accept-Language");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export default [middleware];
