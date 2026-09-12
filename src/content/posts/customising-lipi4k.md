---
title: Customising Lipi4k
description: How to change Lipi4k's colours, typefaces, and visual character without touching a single component file.
published: 2026-05-22
category: Guide
tags:
  - customisation
  - design
  - css
---

Lipi4k is designed to be a frame, not a fixed canvas. The visual system is built on CSS custom properties, which means you can change the palette, the typefaces, and the tone of the site by editing a single file and a configuration object. You do not need to touch any Astro or Tailwind component files to make Lipi4k your own.

## The Colour System

All colours in Lipi4k derive from two layers of CSS variables defined in `src/styles/theme.css`.

The first layer is the base token scale: eleven neutral tones from `--base-50` (the lightest, near-white parchment) to `--base-950` (the darkest, near-black), plus a single brand colour called `--brand`.

```css
/* src/styles/theme.css */
:root {
  --base-50:  #F5F4ED;
  --base-100: #ECEAE2;
  --base-200: #DDDAD1;
  --base-300: #C7C3B9;
  --base-400: #A9A499;
  --base-500: #8A867C;
  --base-600: #6E6A62;
  --base-700: #56534D;
  --base-800: #3F3D39;
  --base-900: #252523;
  --base-950: #141413;
  --brand:    #E85D2A;
}
```

The second layer is the semantic token set: named variables like `--background`, `--foreground`, and `--primary` that the components actually use. These reference the base tokens, so changing the base scale ripples through the whole interface automatically.

To change the look of the entire site, change the base scale. To change just one semantic role (say, the background without touching the text colour), change the semantic token directly.

Rich text uses the same semantic tokens. In `src/styles/typography.css`, `.app-prose` maps the Tailwind Typography colour variables to the theme, so Markdown and raw HTML elements such as definition lists follow the active palette automatically. When customising colours, edit the tokens in `theme.css`; individual articles do not need colour classes or separate dark-mode styles.

## Changing the Accent Colour

The brand colour (`--brand`) drives the primary accent: the link hover colour, the reading progress bar, the featured post CTA, and the initial drop capital on each post. To change the accent, update `--brand` in the `:root` block:

```css
:root {
  /* Swap the terracotta for a slate blue */
  --brand: #4A6FA5;
}
```

Keep the value perceptually saturated enough to stand apart from the neutral scale, but dark enough to pass contrast against `--base-50` in light mode and `--base-950` in dark mode.

## Adapting Dark Mode

Dark mode colours are defined in the `[data-theme="dark"]` block in `theme.css`. By default, the dark theme inverts the scale: where light mode uses `--base-50` for the background, dark mode uses `--base-950`, and the text steps invert accordingly. If you want a dark mode with a completely different character (a true black background, a warmer dark, a tinted ground), override the semantic tokens there:

```css
[data-theme="dark"] {
  --background: #0D0C0B;   /* darker than the default base-950 */
  --foreground: var(--base-100);
}
```

## Typefaces

Lipi4k uses four font slots, each mapped to a CSS variable:

| Variable | Role | Default font |
| --- | --- | --- |
| `--font-lipi4k-serif` | Body text, headings | Literata |
| `--font-lipi4k-sans` | Navigation, metadata, archive years, article and photo counts | Manrope |
| `--font-lipi4k-mono` | Code, small section headings, action labels, footer description | Fira Code |
| `--font-lipi4k-hand` | Handwritten annotations | Caveat |

Post metadata and page update dates share the `metadata` utility in `src/styles/global.css`. It uses `font-ui` (Manrope by default), regular weight, and the same small text size throughout the site. `PostMeta` applies it directly, while `PageHeader` applies it to page metadata, so individual layouts do not need their own font settings.

Archive year labels and article counts on `/posts` and `/tags/*`, article counts in the `/tags` index, and gallery photo counts also use `font-ui`. These use `text-sm` and `tabular-nums`, giving the year and counts the same size and aligning their digits. Article counts are displayed in uppercase (`1 POST`, `7 POSTS`); photo counts use lowercase (`1 photo`, `3 photos`).

The `font-code` utility applies Fira Code to inline code and code blocks, small section headings such as `FEATURED` and `GALLERY`, action labels such as `Continue reading` and `Copy Link`, and the footer description. The shared `inline-cta` utility uses `font-code` for these actions. Use `font-code` for monospaced text that should follow the configured typeface; Tailwind's default `font-mono` uses a separate system font stack.

These font variables are loaded via Astro's font API in `astro.config.mjs`. To change a typeface, update the corresponding entry in the `fonts` array:

```js
// astro.config.mjs
fonts: [
  {
    name: "Lora",                       // replace Literata with Lora
    cssVariable: "--font-lipi4k-serif",
    provider: fontProviders.fontsource(),
    weights: [400, 500, 700],
    fallbacks: ["serif"],
  },
  // ...
],
```

Any font available on Fontsource can be swapped in this way. The rest of the typography system (measure, scale, spacing) stays unchanged.

## Creating a Named Colour Scheme

To add a named scheme that users (or you) can activate via `data-theme`, add a new block to `theme.css` alongside the dark theme:

```css
[data-theme="forest"] {
  color-scheme: light;

  --base-50:  #F0F3EC;
  --base-100: #E4E9DF;
  --base-900: #1D241B;
  --base-950: #121710;
  --brand:    #5A7A57;
}
```

You only need to override the tokens that differ from the defaults. The semantic layer inherits the rest automatically.

To activate it, set the `data-theme` attribute on the `<html>` element in `src/layouts/BaseLayout.astro`, or wire it to a theme selector if you want to offer the choice to readers.

## The Paper Texture

The subtle grain applied to every page is a CSS-only noise pattern, defined in `src/styles/global.css` as a pseudo-element on `body`. Its opacity is set to `0.03` in light mode and `0.02` in dark mode. If the texture feels too visible or too faint, adjust the `opacity` value. To remove it entirely, delete or comment out the `body::before` block.
