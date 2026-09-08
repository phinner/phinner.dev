import { type FetchMiddleware, parseCookieHeader, serializeCookie } from "@solidjs/web";
import { resolveLanguage } from "../lib/language";
import { getGitHubActivity } from "./github";

const middleware: FetchMiddleware = async (request, next) => {
  const pathname = new URL(request.url).pathname;

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
