import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  // Site metadata
  title: "Lipi4k",
  description:
    "An actively maintained fork of Lipi, a typography-first Astro template.",

  url: "https://vlavasa.github.io",
  author: "John Doe",

  // Header
  logo: "/logo.webp",
  showLogo: true,
  showSearch: true,
  showThemeToggle: true,

  navigation: [
    { title: "Posts", url: "/posts" },
    { title: "Tags", url: "/tags" },
    { title: "About", url: "/about" },
  ],

  // Homepage
  heroVariant: "description", // "markdown" | "description" | "none"
  recentPosts: 6,

  // Posts
  postsPerPage: 8,
  relatedPosts: 4,
  showReadingTime: true,

  // Footer
  footerLinks: [
    { title: "RSS", url: "/rss.xml" },
    { title: "Colophon", url: "/colophon" },
    { title: "Source", url: "https://github.com/vlavasa/lipi4k" },
  ],

  annotation: "Writing between filter coffees and terminal windows.",

  // Optional short note below the annotation. Supports Markdown links.
  footerNote: "",
};

export default userConfig;
