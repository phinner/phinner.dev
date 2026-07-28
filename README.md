## Configuration

Before the first run, copy the env template and fill it in:

```bash
$ cp .env.example .env
```

`VITE_NAME`, `VITE_LINKEDIN_URL` and `VITE_EMAIL` are read in `src/env.ts`, which
throws on startup if any are missing — better a loud failure than a page that
renders "undefined" where a name should be. `VITE_NAME` is also substituted into
the `<title>` in `index.html`.

These are inlined into the client bundle at build time, so everything in `.env`
is public. Nothing secret belongs there.

## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
