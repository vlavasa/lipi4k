/**
 * Image Utilities
 *
 * Gallery image resolution and cover image resolution for
 * folder-based post structure.
 *
 * Reads from:
 *   src/content/posts/{postDir}/gallery/      — dedicated gallery images
 *   src/content/posts/{postDir}/attachments/  — inline and cover images
 */

import type { ImageMetadata } from 'astro';

// ============================================================================
// TYPES
// ============================================================================

export interface GalleryImage {
  src: ImageMetadata;
  alt: string;
  filename: string;
}

// ============================================================================
// GLOBS — static, module-level, Vite requires static patterns
// ============================================================================

const allGalleryImages = import.meta.glob<{ default: ImageMetadata }>(
  '../content/**/gallery/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

const allAttachmentImages = import.meta.glob<{ default: ImageMetadata }>(
  '../content/**/attachments/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Derive post directory name from entry.filePath
 * e.g. src/content/posts/2026-03-rajgad/index.md → 2026-03-rajgad
 */
export function extractPostDir(filePath: string): string {
  const parts = filePath.split('/');
  return parts[parts.length - 2] || '';
}

/**
 * Derive alt text from image filename
 * e.g. 01-rajgad-summit-view.jpg → Rajgad Summit View
 */
export function filenameToAlt(filename: string): string {
  return (
    filename
      .replace(/\.[^.]+$/, '')                  // remove extension
      .replace(/^\d+[-_]?/, '')                 // remove leading number
      .replace(/[-_]/g, ' ')                    // separators → spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalise words
      .trim()
  );
}

// ============================================================================
// COVER IMAGE
// ============================================================================

/**
 * Resolve a plain cover path relative to src/content/ to ImageMetadata.
 * Returns undefined if the path cannot be resolved.
 */
export function getCoverImage(
  raw: string | undefined
): ImageMetadata | undefined {
  const path = raw?.trim();
  if (!path) return undefined;

  return allAttachmentImages[`../content/${path}`]?.default;
}

// ============================================================================
// GALLERY
// ============================================================================

/**
 * Get gallery images for a post, sorted by filename.
 * Reads from src/content/posts/{postDir}/gallery/
 */
export function getGalleryImages(filePath: string): GalleryImage[] {
  const postDir = extractPostDir(filePath);
  if (!postDir) return [];

  return Object.entries(allGalleryImages)
    .filter(([path]) => path.includes(`/posts/${postDir}/gallery/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod]) => {
      const filename = path.split('/').pop() ?? '';
      return {
        src: mod.default,
        alt: filenameToAlt(filename),
        filename,
      };
    });
}
