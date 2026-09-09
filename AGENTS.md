# Repository context

This repository is `vlavasa/lipi4k`, a maintained fork of
[`thelocalhoststudio/lipi`](https://github.com/thelocalhoststudio/lipi). It was originally used to
prepare focused contributions for the upstream project. Because the upstream project appears to
be no longer maintained, Lipi4k is now developed independently and completed fixes are integrated
into its `main` branch. Keep work scoped to the currently checked-out branch and do not mix
unrelated changes.

Lipi4k is a typography-first Astro template for long-form publishing, based on Lipi. Its name is
pronounced like “Lipi fork.” It produces a static site and supports Markdown/MDX content, paginated
posts and tag pages, generated Open Graph images, RSS, sitemap, Pagefind search, light/dark themes, and
print-aware styling. Site configuration is assembled in `src/site.config.ts` from user-facing
settings in `configs/user.config.ts`; content lives under `src/content/`.

A live demo of this template is deployed at [https://vlavasa.github.io/lipi4k](https://vlavasa.github.io/lipi4k).

## Development

- Requires Node.js 22.12 or newer.
- Install dependencies with `npm install`.
- Run the development server with `npm run dev`.
- Validate a change with `npm run lint` and `npm run build` as appropriate.
- Follow the existing Biome and Prettier configuration and preserve the surrounding code style.
- Treat `origin` as the canonical Lipi4k repository and `upstream` as the original Lipi project,
  retained for reference and for selectively incorporating relevant changes.
- Do not commit, push, rewrite history, or modify pull requests unless explicitly requested.
