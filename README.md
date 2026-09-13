# Lipi4k

A maintained fork of [Lipi](https://github.com/thelocalhoststudio/lipi), a typography-first Astro template for long-form writing. Built for essays, travel notes, developer journals, and personal archives — publishing environments where the words come first.

**[Demo](https://vlavasa.github.io/lipi4k/)** · **[Source](https://github.com/vlavasa/lipi4k)** · **[Original Lipi project](https://github.com/thelocalhoststudio/lipi)** · **[Original Lipi demo](https://astro-lipi.pages.dev)**

> **Lipi** (लिपि) is the Sanskrit word for script, the written form of a language. **Lipi4k** is pronounced like “Lipi fork.”

![Lipi4k preview](./public/lipi4k-preview.png)

---

## About this fork

Lipi4k was forked from [Lipi](https://github.com/thelocalhoststudio/lipi), created by [The Localhost Studio](https://github.com/thelocalhoststudio). It began as a place to prepare focused fixes for contribution back to the original project. As the original project appears to be no longer maintained, Lipi4k now continues its development independently and integrates those fixes into its own `main` branch.

Lipi4k retains the original project's design and purpose while providing ongoing maintenance, dependency updates, and fixes. The upstream repository remains an important reference and the starting point of this project.

---

## What Lipi4k is for

Lipi4k is a publishing template, not a general-purpose blog theme. It is designed for writers who publish chronologically and want their site to feel like a considered publication rather than a web application. It is not a good fit for sites that need sidebars, comment sections, newsletter embeds, or dashboards.

The visual design takes its cues from the [Kami](https://kami.tw93.fun) design language: warm parchment ground, a constrained reading measure (68 ch), generous line-height, and a single terracotta accent. The output is static HTML. The typography holds under Cmd+P.

---

## Features

- **Literata** body type, **Manrope** for UI and counts, **Fira Code** for code and small labels, **Caveat** for annotations
- Light and dark themes via CSS custom properties, no JavaScript required for switching
- Warm neutral colour scale with a single brand accent — fully customisable in one file
- Paginated posts grouped by year
- Tag pages and tag-driven related posts
- Reading progress indicator via CSS scroll-driven animations
- Dynamic per-post OG images generated with Satori — no manual image creation
- Full-text search via Pagefind — a keyboard-accessible dialog, with no external API or tracking
- RSS feed and sitemap included
- Shiki syntax highlighting with light/dark token mapping
- GitHub-Flavored Markdown and MDX support
- Paper texture and print-aware styles (Cmd+P layout preserved)
- Single configuration file: `configs/user.config.ts`
- Minimal client-side JavaScript

---

## Getting Started

### Use this template

```sh
npm create astro@latest -- --template vlavasa/lipi4k
```

### Clone manually

```sh
git clone https://github.com/vlavasa/lipi4k my-site
cd my-site
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

### Deploy to GitHub Pages

The included GitHub Actions workflow deploys `main` to GitHub Pages. For this repository it sets `BASE_PATH=/lipi4k`, so the published site is available at `https://vlavasa.github.io/lipi4k/` while local development continues to use `/`.

In the repository settings, choose **GitHub Actions** as the Pages source. When reusing the template in another project repository, update `BASE_PATH` in `.github/workflows/deploy.yml` to match that repository name and set `url` in `configs/user.config.ts` to the corresponding GitHub Pages origin.

---

## Configuration

All site-level settings live in `configs/user.config.ts`. Open it, change the values, and the site reflects the changes.

```ts
// configs/user.config.ts
const userConfig: UserConfig = {
  title: "Your Publication",
  description: "What your site is about.",
  url: "https://yoursite.com",
  author: "Your Name",

  navigation: [
    { title: "Posts", url: "/posts" },
    { title: "Tags", url: "/tags" },
    { title: "About", url: "/about" },
  ],

  showSearch: true,
  showThemeToggle: true,
  showReadingTime: true,
  heroVariant: "default",   // "default" | "studio"
};
```

The full configuration reference is available as a [rendered Configuring Lipi4k guide](https://vlavasa.github.io/lipi4k/posts/configuring-lipi4k/) and in its [Markdown source](./src/content/posts/configuring-lipi4k.md).

---

## Project Structure

```txt
lipi4k/
├── configs/
│   └── user.config.ts        # All site settings live here
├── public/
│   └── favicon.svg
├── src/
│   ├── content/
│   │   ├── posts/            # Markdown and MDX posts
│   │   └── pages/            # About, home intro, colophon, etc.
│   ├── styles/
│   │   ├── theme.css         # Colour tokens and font variables
│   │   ├── typography.css    # Prose styles
│   │   └── global.css        # Base reset and utilities
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── utils/
├── astro.config.mjs
└── package.json
```

Posts go in `src/content/posts/`. Subdirectories are supported. Folders prefixed with `_` are stripped from the URL (useful for year-based organisation without year segments in slugs).

---

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/`, generate Pagefind index |
| `npm run preview` | Preview the production build locally |

### Search

The magnifying glass to the left of the theme toggle opens full-text search. You can also use **Ctrl+K** (Windows/Linux) or **Cmd+K** (macOS) when not typing in another field. Search results include titles and matching excerpts. Use the arrow keys to move between results, Enter to follow a link, and Escape to close the dialog. Clicking outside the panel or its close button also closes it.

Search covers the titles, descriptions, and bodies of published posts and public content pages, including About and Colophon. Listing pages, navigation, drafts, and scheduled posts are excluded from the production index. Results are ranked by relevance and load in groups of eight. After the last displayed result, the down arrow moves to **Load more results**. Press Enter to load the next group; focus returns to the previously selected result, including when the button is clicked with a mouse. Closing the dialog preserves the current query; navigating to another page resets it.

Set `showSearch: false` in `configs/user.config.ts` to disable search. The Pagefind engine and index are loaded only when search is opened. Search stays on your site and sends no queries to an external service.

The index is generated by `npm run build`. To test real search results locally, run that command followed by `npm run preview`. During `npm run dev`, the dialog shows a development notice instead of requesting an index that does not exist. Rebuild after editing content to update the preview's results.

Search follows the current document language (`lang` in post or page frontmatter, defaulting to `en`). On multilingual sites, results are limited to that language. Diacritics are ignored by default; word stemming depends on [Pagefind's language support](https://pagefind.app/docs/multilingual/). Czech words are searchable with or without diacritics, but different inflected forms are not automatically treated as the same word.

---

## Customising

### Colours

The colour system is a single warm neutral scale (`--base-50` through `--base-950`) plus one brand colour (`--brand`). Change both in `src/styles/theme.css`:

```css
:root {
  --base-50:  #F5F4ED;   /* ground */
  --base-950: #141413;   /* near-black */
  --brand:    #E85D2A;   /* accent */
}
```

To create a named colour scheme, add a `[data-theme="name"]` block and set the `data-theme` attribute on `<html>`.

### Typefaces

Fonts are configured in `astro.config.mjs` under the `fonts` array. Swap the `name` field to any typeface available on Fontsource.

All four typefaces load both `latin` and `latin-ext` subsets, including Czech diacritics and extended Latin characters used by other European languages. When replacing a font, keep both subsets and choose a typeface that supports the languages you write in.

The font utilities in `src/styles/theme.css` assign each typeface a role:

- `font-content` — **Literata** for body text and headings.
- `font-ui` — **Manrope** for navigation, metadata, archive years, article counts on `/posts`, `/tags`, and `/tags/*`, and gallery photo counts.
- `font-code` — **Fira Code** for inline code, code blocks, small section headings, action labels, and the footer description.
- `font-annotation` — **Caveat** for handwritten annotations.

Archive years and counts use tabular figures to keep digits aligned. Article counts are displayed as `1 POST` or `7 POSTS`; gallery counts use `1 photo` or `3 photos`.

---

## Content Schema

### Posts (`src/content/posts/`)

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | Yes | |
| `description` | string | Yes | Shown as deck on featured post and in feeds |
| `published` | date | Yes | `YYYY-MM-DD` |
| `updated` | date | No | Shows "Updated on" in post metadata |
| `category` | string | No | Defaults to `Travels` |
| `tags` | string[] | No | Drives related posts |
| `cover` | image / string | No | Overrides the auto-generated OG image |
| `draft` | boolean | No | Excluded from production builds |
| `lang` | string | No | Document language, e.g. `cs`; defaults to `en` |
| `annotation` | string | No | Handwritten note below the article content; no global fallback |

### Pages (`src/content/pages/`)

| Field | Type | Required |
| --- | --- | --- |
| `title` | string | Yes |
| `description` | string | No |
| `updated` | date | Yes |
| `draft` | boolean | No |
| `lang` | string | No |
| `annotation` | string | No |

For posts and content pages, `lang` sets the document's HTML language. Use a language tag such as `cs` for Czech, `en` for English, or `de` for German. When omitted, it defaults to `en`. Browsers and assistive technology use this value to interpret the text, and Pagefind searches content in the current document's language. The template's interface labels remain in English.

To mark a post or page as Czech, add this to its frontmatter:

```yaml
lang: cs
```

On content pages, `annotation` sets the handwritten note in the footer. When omitted, it uses `annotation` from `configs/user.config.ts`; an empty string hides the note on that page. The home page uses the global annotation directly. Post annotations appear below the article content and are set only through post frontmatter.

---

## Credits

- Lipi4k is based on [Lipi](https://github.com/thelocalhoststudio/lipi), created by [The Localhost Studio](https://github.com/thelocalhoststudio)
- Typography inspired by the [Kami](https://kami.tw93.fun) design language
- Body typeface: [Literata](https://fonts.google.com/specimen/Literata) by TypeTogether
- UI typeface: [Manrope](https://fonts.google.com/specimen/Manrope) by Mikhail Sharanda
- Monospace: [Fira Code](https://github.com/tonsky/FiraCode) by Nikita Prokopov
- Annotation: [Caveat](https://fonts.google.com/specimen/Caveat) by Pablo Impallari
- Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com)
- Search powered by [Pagefind](https://pagefind.app)

---

## License

Lipi4k is distributed under the MIT License, the same license used by the [original Lipi project](https://github.com/thelocalhoststudio/lipi#license). The original project was made by [The Localhost Studio](https://github.com/thelocalhoststudio).
