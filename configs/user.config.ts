import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "Lipi4k",
  description:
    "An actively maintained fork of Lipi, a typography-first Astro template.",

  url: "https://vlavasa.github.io",
  author: "John Doe",

  logo: "/logo.svg",
  avatar: "/avatar.png",

  navigation: [
    { title: "Posts", url: "/posts" },
    { title: "Tags", url: "/tags" },
    { title: "About", url: "/about" },
  ],

  footerLinks: [
    { title: "RSS", url: "/rss.xml" },
    { title: "Source", url: "https://github.com/vlavasa/lipi4k" },
    
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com/vlavasa/lipi4k",
      icon: "github",
    },
    {
      title: "X",
      url: "https://x.com/",
      icon: "x",
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/",
      icon: "linkedin",
    },
    
  ],

  footerCredits: "Designed for reading. Built with Astro & Lipi4k",

  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,

  showThemeToggle: true,
  showReadingTime: true,

  heroVariant: "studio",

  annotation: "Writing between filter coffees and terminal windows.",
};

export default userConfig;
