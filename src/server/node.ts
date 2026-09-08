import { handleRequest } from "virtual:solid-ssr-handler";
import { NodeRuntime } from "@effect/platform-node";
import { Config, Effect } from "effect";
import { serveHttp } from "./http";

Effect.gen(function* () {
  const port = yield* Config.int("PORT").pipe(Config.withDefault(3000));
  const host = yield* Config.nonEmptyString("HOST").pipe(Config.withDefault("127.0.0.1"));
  return yield* serveHttp(handleRequest, { host, port });
}).pipe(NodeRuntime.runMain);
