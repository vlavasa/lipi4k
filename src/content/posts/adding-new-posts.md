---
title: Adding New Posts
description: Everything a new Lipi4k author needs to know before writing the first word, from file location to frontmatter to the draft workflow.
published: 2026-05-20
category: Guide
tags:
  - writing
  - guide
  - content
---

Posts in Lipi4k are markdown files in the filesystem. There is no admin panel, no database, no upload form. You create a file, write in it, and the site builds from what it finds. This guide covers everything you need to go from an empty file to a published post.

## Where Posts Live

All posts belong inside `src/content/posts/`. You can place files directly in that folder, or organise them into subdirectories:

```txt
src/content/posts/
├── introducing-lipi4k.md
├── travel/
│   ├── kyoto-november.md
│   └── lisbon-in-rain.md
└── notes/
    └── on-slow-reading.md
```

Subdirectory names become part of the URL by default. `travel/kyoto-november.md` becomes `/posts/travel/kyoto-november`. If you want to organise files into folders for your own clarity without that folder appearing in the URL (for example, grouping posts by year), prefix the folder name with an underscore:

```txt
src/content/posts/
└── _2026/
    └── kyoto-november.md   → /posts/kyoto-november
```

Folders starting with `_` are stripped from the URL path entirely. The file's slug is derived from its filename alone.

## Frontmatter

Every post needs a frontmatter block at the top of the file, delimited by `---`. The following fields are recognised:

`title` is required. It appears in the page `<title>`, the post header, the feed listing, and the auto-generated OG image.

`description` is required. It appears as the deck beneath the title on the featured post, in the feed listing, and in search engine previews. Write it as a complete sentence. It represents the article.

`published` is required. The date the post was (or will be) published, in `YYYY-MM-DD` format. Posts are sorted by this date, newest first.

`updated` is optional. When present, Lipi4k shows an "Updated on" note in the post metadata. Use it when you revise a post substantially enough that existing readers should know the text has changed.

`category` is optional. A single string that classifies the post. The default value is `Travels`, which reflects the template's origins in travel writing. Change it to whatever suits your publication: `Essays`, `Notes`, `Code`, `Journal`.

`tags` is optional. An array of lowercase strings used to group related posts. Tags drive the "Related posts" section at the bottom of each article. They are lowercased and deduplicated automatically.

`cover` is optional. A path to a cover image, either relative to the post file (`./cover.jpg`) or a URL. When present, the image is used as the OG image for the post. When absent, Lipi4k generates an OG image from the post title automatically.

`draft` is optional and defaults to `false`. Set it to `true` to prevent the post from appearing in the feed or being built to a public URL. Draft posts are excluded from production builds. During development (`astro dev`), draft posts are built and accessible by navigating to their URL directly.

`lang` is optional and defaults to `en`. Sets the document's HTML language for this post, for example `cs` for Czech, `en` for English, or `de` for German. The same field is supported in content page frontmatter. Browsers and assistive technology use it to interpret the text, and Pagefind searches content in that language. The template's interface labels remain in English.

`annotation` is optional. A short, handwritten-style note displayed below the article content, before the tags and sharing links. It uses the `font-annotation` typeface (Caveat by default) and is rendered as plain text. Omit it or set it to an empty string to hide the note. Posts use only their own frontmatter annotation; they do not inherit the global footer annotation from `configs/user.config.ts`.

A complete frontmatter block looks like this:

```yaml
---
title: November in Kyoto
description: The maple season arrives without warning and is over before you adjust your plans to it.
published: 2026-11-12
updated: 2026-11-18
category: Travel
tags:
  - japan
  - kyoto
  - travel
cover: ./cover.jpg
draft: false
lang: en
annotation: Written between rain showers and the last train home.
---
```

## The Featured Post

The post at the top of the home page is simply the most recently published non-draft post. There is no `featured: true` flag. To change which post is featured, change its `published` date to be the most recent among all your posts.

## Writing the Post

Below the closing `---` of the frontmatter block, write the post body in standard markdown. Lipi4k supports GitHub-Flavored Markdown (tables, footnotes, strikethrough, fenced code blocks with language identifiers) and MDX if your file uses the `.mdx` extension.

The first paragraph of the post receives a drop capital in the published layout on larger screens. This is applied automatically. You do not need to mark it up differently.

### Czech and Other European Languages

Save Markdown and MDX files as UTF-8 and write accented characters directly, including in titles, descriptions, categories, and tags. The default fonts include extended Latin characters for Czech and other European languages that use the Latin alphabet.

Set `lang: cs` in the frontmatter for a Czech article (or page). This identifies the document language for browsers, assistive technology, and search; it does not translate the template's interface labels. For example, save this as `src/content/posts/cesky-clanek.md`:

```markdown
---
title: Příliš žluťoučký kůň
description: České háčky a čárky v titulku i běžném textu.
published: 2026-05-20
lang: cs
category: Zápisky
annotation: Příliš žluťoučký kůň úpěl ďábelské ódy.
tags:
  - čeština
  - příroda
---

Příliš žluťoučký kůň úpěl ďábelské ódy.
```

## Draft Workflow

The simplest draft workflow is to set `draft: true` in the frontmatter and write the post in place. When you are ready to publish, change `draft` to `false` and rebuild. Because posts are plain files in the filesystem, you can also use a separate folder (`src/content/posts/_drafts/`, for example) and move files into the main posts directory when they are ready.

Neither approach requires any additional configuration. Use whichever maps better to how you write.
