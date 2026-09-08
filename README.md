# phinner.dev

My portfolio, built with Solid 2 and Effect. Available in English and French.

Use Node 24.

```sh
pnpm install
pnpm dev              # localhost:4321
pnpm dev:worker       # Cloudflare preview on localhost:8787
```

For GitHub activity, add `GITHUB_TOKEN` to `.env`.

```sh
pnpm lint
pnpm check
pnpm test
pnpm test:http
pnpm test:worker
```

Deploy to Cloudflare:

```sh
pnpm exec wrangler login
pnpm exec wrangler secret put GITHUB_TOKEN # Optional
pnpm run deploy
```

Or run locally with `pnpm build && pnpm start` on localhost:3000.
