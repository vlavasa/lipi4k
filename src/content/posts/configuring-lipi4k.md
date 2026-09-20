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
  logo: "/logo.webp",
  defaultOGImage: "/custom-og.jpg",
```

`logo` is the path to the site logo, served from the `public/` directory. It is only shown when `showLogo` is set to `true`. `defaultOGImage` optionally replaces the generated `/og.png` used by the home page and other pages without their own image. Place a custom file such as `custom-og.jpg` in `public/`; individual posts continue to use their automatically generated OG images.

## Navigation

Header and footer links are configured separately. The same footer appears on every page, including posts, archives, and the 404 page.

```ts
  navigation: [
    { title: "Posts", url: "/posts" },
    { title: "Tags", url: "/tags" },
    { title: "About", url: "/about" },
  ],

  footerLinks: [
    { title: "RSS", url: "/rss.xml" },
    { title: "Colophon", url: "/colophon" },
    { title: "Source", url: "https://github.com/vlavasa/lipi4k" },
  ],
```

Each item takes a `title` (the visible label) and a `url`. Navigation links support both internal paths and external URLs. Internal paths respect the configured `BASE_PATH`.

The default navigation links to **Posts** (`/posts`), the paginated list of all published posts; **Tags** (`/tags`), the topic index with links to posts for each tag; and **About** (`/about`). The **All posts** link on the home page also opens `/posts`.

The footer shows the author, a compact row of links, the optional handwritten annotation, and an optional note. Its default links lead to **RSS**, **Colophon** (the site's typefaces, tools, and credits), and the template's **Source** repository. Omit `footerLinks` or set it to `[]` to hide the link row.

There is no separate social-link setting. Add a profile to `footerLinks` if you want it in the footer, or write links and any additional content directly in `src/content/pages/about.md`.

## Footer Note

```ts
  footerNote: "Read about this site's [typefaces and tools](/colophon).",
```

`footerNote` is a short, optional note at the very bottom of every page, below the handwritten annotation. Without an annotation, it follows the links. Omit it or use an empty string to hide it without leaving a gap; the default configuration leaves it empty.

Use it for a copyright notice, a link to your content's licence, or a brief attribution. Markdown links and emphasis are supported; raw HTML is not rendered. Internal links respect `BASE_PATH`. Keep the note to a short paragraph. The licence of your published content is separate from the template's licence.

When updating an older configuration, replace the unused `footerCredits` setting with `footerNote`. Move any links from the removed `social` setting into `footerLinks` or the About page.

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
  heroVariant: "description",
```

The home page hero supports three variants:

- `"markdown"` renders the Markdown content from `src/content/pages/home-intro.md`, followed by the same divider and spacing as `"description"`. This is the default when `heroVariant` is omitted.
- `"description"` displays the site description as a large typographic statement followed by a divider.
- `"none"` omits the entire hero section, including its divider and spacing.

If you are updating an existing configuration, rename `"default"` to `"markdown"` and `"studio"` to `"description"`.

The global annotation is rendered in the shared footer and is unaffected by `heroVariant`.

## Handwritten Annotation

Set `annotation` in `configs/user.config.ts` to add a short handwritten note to the footer of every page:

```ts
  annotation: "Writing between filter coffees and terminal windows.",
```

The annotation is rendered as plain text using the `font-annotation` typeface (Caveat by default). Omit it or set it to an empty string to hide it across the site. Page frontmatter no longer overrides the footer; move any existing page-specific note into that page's Markdown content.

Posts also have their own optional `annotation` frontmatter field, displayed below the article content before the tags and sharing links. This article note is independent of the shared footer annotation: it has no global fallback and does not replace or hide the footer annotation. For example:

```yaml
annotation: Příliš žluťoučký kůň úpěl ďábelské ódy.
```
