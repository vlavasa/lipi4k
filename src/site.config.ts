import userConfig from "../configs/user.config";
import type { ContentsLabels } from "./utils/contents";

export interface NavItem {
  title: string;
  url: string;
}

export interface UserConfig {
  title: string;
  description: string;
  url: string;
  author: string;

  logo?: string;
  defaultOGImage?: string;

  navigation?: NavItem[];
  footerLinks?: NavItem[];

  footerNote?: string;

  postsPerPage?: number;
  recentPosts?: number;
  relatedPosts?: number;

  showLogo?: boolean;
  showSearch?: boolean;
  showThemeToggle?: boolean;
  showReadingTime?: boolean;
  tableOfContentsLabels?: Record<string, ContentsLabels>;

  heroVariant?: "markdown" | "description" | "none";

  annotation?: string;

};

const siteConfig = {
  title: userConfig.title,
  description: userConfig.description,
  url: userConfig.url,
  author: userConfig.author,

  logo: userConfig.logo,
  ogImage: userConfig.defaultOGImage ?? "/og.png",

  navigation: userConfig.navigation ?? [],
  footerLinks: userConfig.footerLinks ?? [],

  footerNote: userConfig.footerNote,

  postsPerPage: userConfig.postsPerPage ?? 8,
  recentPosts: userConfig.recentPosts ?? 6,
  relatedPosts: userConfig.relatedPosts ?? 4,

  showLogo: userConfig.showLogo ?? false,
  showSearch: userConfig.showSearch ?? true,
  showThemeToggle: userConfig.showThemeToggle ?? true,
  showReadingTime: userConfig.showReadingTime ?? true,
  tableOfContentsLabels: userConfig.tableOfContentsLabels ?? {},

  heroVariant: userConfig.heroVariant ?? "markdown",

  annotation: userConfig.annotation,
};

export default siteConfig;
