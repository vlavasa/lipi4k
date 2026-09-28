---
title: An Illuminated Beginning
description: A small invitation to slow down, with an illuminated initial that changes between light and dark.
published: 2026-09-28
lang: en
tags:
  - typography
  - writing
  - guide
illumination:
  light: ./attachments/initial-b-light.png
  dark: ./attachments/initial-b-dark.png
annotation: Every story deserves a little light.
---

Before the first sentence has quite begun, a letter opens the door. Its stem holds a curl of leaves; a thread of gold follows the edge of the ink. The rest of the paragraph gathers beside it, plain and unhurried. This is a small pleasure of an illuminated beginning: a moment of attention offered to the reader before the story asks for anything in return.

An opening need not be loud to feel deliberate. A little colour, a generous margin, and a well-shaped letter can give an ordinary paragraph the sense that someone has prepared a place for it. The ornament does its work quietly, then lets the words continue.

## One Letter, Two Kinds of Light

This article uses two versions of the same illustrated **B**, inspired by the painted initials of medieval books. In the light theme, a deep burgundy letter carries warm gold edges and pale leaves. In the dark theme, the body of the letter turns to parchment gold, with terracotta foliage to keep its shape distinct against the page.

Use the theme button in the header to compare them on your phone, tablet, or desktop. The artwork changes with the page, while its size and position stay the same. Both versions have transparent backgrounds, so the page colour shows through the spaces inside the letter.

The initial occupies a square two lines high on mobile and three lines high on screens at least 768 pixels wide. Text flows beside it and then returns to the full width of the paragraph. Further paragraphs keep their ordinary rhythm; one decorated entrance is enough.

## Try It in Your Own Article

Keep the artwork in an `attachments` folder beside your post and add these paths to its frontmatter:

```yaml
illumination:
  light: ./attachments/initial-b-light.png
  dark: ./attachments/initial-b-dark.png
```

Write the first word in full. This article starts with `Before`, including the **B**. Lipi4k replaces that letter visually while keeping it in the document for search and assistive technology. Choose artwork that matches the first letter of your own opening sentence.

If one illustration suits both themes, a single path is enough:

```yaml
illumination: ./attachments/initial-b-light.png
```

In print, the illustration gives way to the original text. Without the `illumination` field, the usual typographic drop capital appears on larger screens. The [authoring guide](../adding-new-posts/#illuminated-initials) explains the supported opening paragraphs and image paths.

## Leave Room for the Words

An illuminated letter is a beginning, not a decoration to repeat at every turn. Its richest detail belongs at the edge of attention: visible when you pause, unobtrusive when you read.

The gold can catch the eye for a moment. After that, the sentence should carry you onward.
