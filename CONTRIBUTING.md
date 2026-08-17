# Contributing

This project is a TypeScript userscript bundled with Vite and vite-plugin-monkey. Use Node.js 26 to match CI.

## Local Development

```bash
npm install
npm run dev
```

Install the development userscript from the browser prompt. Verify DOM changes manually on Bangumi.

## Building and Checks

```bash
npm run typecheck
npm run lint
npm run lint:fix
npm test
npm run format
npm run format:check
npm run build
```

The production build is `dist/bangumi-score.user.js`. Configure userscript metadata in `vite.config.ts`.

Add Vitest tests next to testable source modules as `*.test.ts`. Test pure logic automatically and verify browser APIs and DOM interactions manually.

## Commits and Releases

Use [Conventional Commits](https://www.conventionalcommits.org/). Release Please updates the version and changelog, creates the GitHub Release, and CI uploads the built userscript asset. Do not run `npm version` manually.
