import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Image, Paragraph } from 'mdast';

/**
 * Markdown image presentation for Lipi4k
 *
 * Handles:
 * - Image captions from title attribute
 * - Image grid class assignment for consecutive images
 * - loading="lazy" and decoding="async" on all images
 */

// ── Image Attributes ─────────────────────────────────────────────────────────

function addImageAttributes(tree: Root) {
  visit(tree, 'image', (node: Image) => {
    if (!node.data) node.data = {};
    if (!node.data.hProperties) node.data.hProperties = {};

    const props = node.data.hProperties as Record<string, any>;
    // lazy for all images — browser handles priority naturally;
    // avoids forcing high-res decode on images that may be off-screen
    props.loading = props.loading || 'lazy';
    props.decoding = props.decoding || 'async';
  });
}

// ── Image Captions ───────────────────────────────────────────────────────────

function processImageCaptions(tree: Root) {
  visit(tree, 'image', (node: Image) => {
    if (!node.title) return;

    if (!node.data) node.data = {};
    if (!node.data.hProperties) node.data.hProperties = {};

    const props = node.data.hProperties as Record<string, any>;
    props['data-caption'] = node.title;
    props.title = node.title;
  });
}

// ── Image Grids ───────────────────────────────────────────────────────────────

function mergeConsecutiveImageParagraphs(tree: Root) {
  if (!tree.children?.length) return;

  let i = 0;
  while (i < tree.children.length) {
    const node = tree.children[i];

    // Must be a paragraph containing only images
    if (!isImageOnlyParagraph(node)) {
      i++;
      continue;
    }

    // Collect consecutive image-only paragraphs
    const group: Paragraph[] = [node as Paragraph];
    let j = i + 1;

    while (j < tree.children.length) {
      const next = tree.children[j];
      if (!isImageOnlyParagraph(next)) break;
      group.push(next as Paragraph);
      j++;
    }

    if (group.length > 1) {
      // Merge all images into the first paragraph
      const merged = group[0];
      merged.children = group.flatMap((p) =>
        p.children.filter((child) => child.type === 'image')
      );

      // Remove the consumed paragraphs
      tree.children.splice(i + 1, group.length - 1);
    }

    i++;
  }
}

function isImageOnlyParagraph(node: any): boolean {
  if (node.type !== 'paragraph') return false;
  if (!node.children?.length) return false;

  return node.children.every(
    (child: any) =>
      child.type === 'image' ||
      (child.type === 'text' && child.value.trim() === '')
  );
}

function processImageGrids(tree: Root) {
  visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
    if (!node.children?.length) return;

    const existingClass = (node.data?.hProperties as any)?.class || '';
    if (
      existingClass === 'gallery-grid' ||
      existingClass === 'gallery-single'
    ) return;

    const images = node.children.filter(
      (child) => child.type === 'image'
    ) as Image[];

    const otherContent = node.children.filter(
      (child) =>
        child.type !== 'image' &&
        !(child.type === 'text' && (child as any).value.trim() === '')
    );

    if (images.length === 0 || otherContent.length > 0) return;

    if (!node.data) node.data = {};
    if (!node.data.hProperties) node.data.hProperties = {};

    // Convert paragraph element to div
    node.data.hName = 'div';
    const props = node.data.hProperties as Record<string, any>;
    props.class = images.length === 1 ? 'gallery-single' : 'gallery-grid';

    node.children = images.map((img) => {
      if (!img.data) img.data = {};
      if (!img.data.hProperties) img.data.hProperties = {};
      (img.data.hProperties as any).class = 'gallery-item__image';

      return {
        type: 'div',
        data: {
          hName:       'div',
          hProperties: { class: 'gallery-item' },
        },
        children: [img],
      } as any;
    });
  });
}

// ── Main Plugin ───────────────────────────────────────────────────────────────

export const remarkImageProcessing: Plugin<[], Root> = () => {
  return (tree) => {
    addImageAttributes(tree);
    processImageCaptions(tree);
    mergeConsecutiveImageParagraphs(tree);
    processImageGrids(tree);
  };
};

export default remarkImageProcessing;