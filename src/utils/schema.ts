import siteConfig from "@/site.config";
import { type Post, getPostUrl } from "./content";
import { absoluteUrl } from "./url";

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl("/", siteConfig.url),
  };
}

export function generatePostSchema(
  post: Post
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.published,
    dateModified:
      post.data.updated ??
      post.data.published,

    url: absoluteUrl(
      getPostUrl(post.id, post.filePath),
      siteConfig.url
    ),

    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
  };
}
