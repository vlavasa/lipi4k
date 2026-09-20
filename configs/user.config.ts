import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "Lipi4k",
  description:
    "An actively maintained fork of Lipi, a typography-first Astro template.",

  url: "https://vlavasa.github.io",
  author: "John Doe",

  logo: "/logo.webp",

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

  // Optional short note below the annotation. Supports Markdown links.
  footerNote: "",

  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,

  showLogo: true,
  showSearch: true,
  showThemeToggle: true,
  showReadingTime: true,

  heroVariant: "description", // "markdown" | "description" | "none"

  annotation: "Writing between filter coffees and terminal windows.",
};

export default userConfig;
