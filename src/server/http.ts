import { createServer } from "node:http";
import { resolve } from "node:path";
import { NodeHttpServer } from "@effect/platform-node";
import { Effect } from "effect";
import {
  HttpEffect,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
  HttpStaticServer,
} from "effect/unstable/http";

const CLIENT_ROOT = resolve(import.meta.dirname, "../client");

export function makeHttpApp(solidHandler: (request: Request) => Promise<Response>) {
  return Effect.gen(function* () {
    const staticApp = yield* HttpStaticServer.make({
      root: CLIENT_ROOT,
      index: undefined,
    });
    const solidApp = HttpEffect.fromWebHandler(solidHandler);

    return HttpServerRequest.HttpServerRequest.use((request) => {
      if (request.method !== "GET" && request.method !== "HEAD") return solidApp;

      return staticApp.pipe(
        Effect.map(
          HttpServerResponse.setHeader(
            "Cache-Control",
            request.url.startsWith("/assets/")
              ? "public, max-age=31536000, immutable"
              : "public, max-age=3600",
          ),
        ),
        Effect.catchIf(
          (error) => error.reason._tag === "RouteNotFound",
          () => solidApp,
        ),
      );
    });
  });
}

export function serveHttp(
  solidHandler: (request: Request) => Promise<Response>,
  options: { readonly host: string; readonly port: number },
) {
  return Effect.gen(function* () {
    const app = yield* makeHttpApp(solidHandler);
    yield* HttpServer.serveEffect(app);
    yield* HttpServer.logAddress;
    return yield* Effect.never;
  }).pipe(
    Effect.scoped,
    Effect.provide(
      NodeHttpServer.layer(createServer, {
        host: options.host,
        port: options.port,
        gracefulShutdownTimeout: "5 seconds",
      }),
    ),
  );
}
