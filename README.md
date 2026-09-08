# phinner.dev

My portfolio, built with Solid 2 and Effect. Available in English and French.

Use Node 24.

```sh
pnpm install
pnpm dev
```

Should be open at http://localhost:4321.

To enable GitHub activity, add `GITHUB_TOKEN` to `.env`, then restart the server.

```sh
pnpm lint              # Code style
pnpm check             # Typecheck
pnpm test              # Language and GitHub behavior
pnpm test:http         # Build and check production HTTP responses
pnpm build             # Production build
pnpm start             # Serve on localhost:3000
```
