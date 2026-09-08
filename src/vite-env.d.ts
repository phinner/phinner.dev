/// <reference types="vite/client" />
declare const __COMMIT_SHA__: string;
declare module "virtual:solid-ssr-handler" {
  export function handleRequest(request: Request): Promise<Response>;
}
