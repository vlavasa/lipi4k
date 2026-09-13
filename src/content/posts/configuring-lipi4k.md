---
title: Configuring Lipi4k
description: A field-by-field guide to user.config.ts and what each setting changes in the published site.
published: 2026-05-24
category: Guide
tags:
  - configuration
  - guide
  - setup
---

All of Lipi4k's site-level configuration lives in one file: `configs/user.config.ts`. Open it, change a value, and the dev server reflects the change immediately. There is no separate environment file, no admin panel, no database entry to update. The configuration is code, which means it is in version control, diffable, and portable.

## Identity

The four required fields establish who you are and where the site lives.

```ts
// configs/user.config.ts
const userConfig: UserConfig = {
  title: "The Long Read",
  description: "Essays and travel notes from the edge of the timetable.",
  url: "https://thelongread.com",
  author: "Your Name",
};
```

`title` appears in the browser tab, the page `<title>` element, and the default OG image. `description` is the fallback meta description for any page that does not provide its own. `url` is the public origin used to build canonical links, sitemap entries, RSS links, and OG metadata. For a subpath deployment such as GitHub Pages, keep the repository path in Astro's `BASE_PATH` setting rather than appending it to `url`. `author` appears in the JSON-LD structured data attached to each post.

## Branding

```ts
  logo: "/logo.svg",
  avatar: "/avatar.png",
  defaultOGImage: "/custom-og.jpg",
```

`logo` is the path to the site logo, served from the `public/` directory. It is only shown when `showLogo` is set to `true`. `defaultOGImage` optionally replaces the generated `/og.png` used by the home page and other pages without their own image. Place a custom file such as `custom-og.jpg` in `public/`; individual posts continue to use their automatically generated OG images.

> **TODO:** `avatar` is accepted by the configuration schema but is not currently rendered by either home-page hero variant.

## Navigation

Header and planned footer links are configured separately. Header navigation is currently rendered; footer-link rendering is not implemented yet.

```ts
  navigation: [
    { title: "Posts", url: "/posts" },
    { title: "Tags", url: "/tags" },
    { title: "About", url: "/about" },
  ],

  footerLinks: [
    { title: "RSS", url: "/rss.xml" },
    { title: "Source", url: "https://github.com/yourusername/yourrepo" },
  ],
```

Each item takes a `title` (the visible label) and a `url`. Navigation links support both internal paths and external URLs.

The default navigation links to **Posts** (`/posts`), the paginated list of all published posts; **Tags** (`/tags`), the topic index with links to posts for each tag; and **About** (`/about`). The **All posts** link on the home page also opens `/posts`.

> **TODO:** Render `footerLinks` in the site footer. The setting is currently accepted but has no visible effect.

## Social Links

```ts
  social: [
    { title: "GitHub", url: "https://github.com/yourusername", icon: "github" },
    { title: "X", url: "https://x.com/yourhandle", icon: "x" },
  ],
```

The `icon` field is intended to accept `"github"`, `"x"`, or `"linkedin"`. Remove the `social` array if you do not plan to expose social links.

> **TODO:** Render configured `social` links in the header. The setting is currently accepted but has no visible effect.

## Footer Credits

```ts
  footerCredits: "Designed for reading. Built with Astro & Lipi4k",
```

This setting is intended for a tagline, copyright notice, or brief attribution at the bottom of every page.

> **TODO:** Render `footerCredits` in the site footer. The setting is currently accepted but has no visible effect.

## Pagination and Feed Depth

```ts
  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,
```

`postsPerPage` controls how many posts appear per page in the `/posts` listing. Individual tag pages show all posts for that tag without pagination. `recentPosts` sets the total number of posts shown on the home page, including the featured post: a value of `6` shows one featured post and up to five posts in "Recent". `relatedPosts` limits the number of related posts in the "More like this" section at the bottom of each post.

## Display Toggles

```ts
  showLogo: false,
  showSearch: true,
  showThemeToggle: true,
  showReadingTime: true,
```

`showLogo` controls whether the logo image is shown in the header. When `false`, the site title text is shown instead. `showSearch` shows or hides the search button and dialog; it defaults to `true`. `showThemeToggle` shows or hides the light/dark toggle button. `showReadingTime` shows or hides the estimated reading time that appears in post metadata.

## Search

Search opens from the magnifying glass to the left of the theme toggle, or with Ctrl/Cmd+K when focus is outside an editable field. It searches published posts and public content pages by title, description, and body text. Results show matching excerpts and are ordered by relevance. Navigation, post and tag listings, drafts, and scheduled posts are excluded from the production index.

The Pagefind engine and index load on demand from your own site. No API keys, external search service, or additional configuration are needed, including for deployments under `BASE_PATH` such as GitHub Pages.

To test search locally, run `npm run build` followed by `npm run preview`. The development server does not generate a search index, so its dialog displays a notice instead. Rebuild to include content changes in the preview's results.

The `lang` field in post and page frontmatter sets the document language, defaulting to `en`. Pagefind searches only content in that language. Searching without diacritics is supported; matching different word forms depends on the language. For example, Czech stemming is not supported. The surrounding interface labels remain in English, like the rest of the template.

## Hero Variant

```ts
  heroVariant: "studio",
```

The home page hero comes in two variants: `"default"` renders the Markdown content from `src/content/pages/home-intro.md`, while `"studio"` displays the site description as a large typographic statement followed by a divider. The global annotation is rendered separately in the home-page footer.

## Handwritten Annotation

Set `annotation` in `configs/user.config.ts` to add a short handwritten note to the footer of the home page and pages using `PageLayout`:

```ts
  annotation: "Writing between filter coffees and terminal windows.",
```

The note is rendered as plain text using the `font-annotation` typeface (Caveat by default). A content page can override it with `annotation` in its frontmatter. Setting `annotation: ""` in that page hides the note; omitting the field uses the global value.

Posts have their own optional `annotation` frontmatter field, displayed below the article content before the tags and sharing links. Posts do not inherit the global annotation. For example:

```yaml
annotation: Příliš žluťoučký kůň úpěl ďábelské ódy.
```
