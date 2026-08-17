# Bangumi Score

A userscript for Bangumi. It is built with Vite and [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey).

## Usage

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/).
2. Download the latest `bangumi-score.user.js` asset from the project's GitHub Releases page and install it in the manager.
3. Open [Bangumi](https://bgm.tv/).

## Development

Use Node.js 26 to match CI.

```bash
npm install
npm run dev
```

The first `npm run dev` prompts the browser to install the development userscript. Later changes use local hot reload.

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The production build is written to `dist/bangumi-score.user.js`. Configure userscript metadata, including `@match` and `@grant`, in `vite.config.ts`.

## Releases

Release Please creates releases from Conventional Commits. Do not run `npm version` manually.
