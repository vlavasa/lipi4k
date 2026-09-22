import type { MarkdownHeading } from "astro";

export type ContentsLabels = {
	title: string;
	button: string;
	navigation: string;
	close: string;
};

export type ContentsItem = MarkdownHeading & { children: MarkdownHeading[] };

export type ArticleContents = {
	items: ContentsItem[];
	labels: ContentsLabels;
	labelLang: string;
};

const defaultLabels: Record<string, ContentsLabels> = {
	en: {
		title: "In this article",
		button: "Contents",
		navigation: "Article contents",
		close: "Close contents",
	},
	cs: {
		title: "V tomto článku",
		button: "Obsah",
		navigation: "Obsah článku",
		close: "Zavřít obsah",
	},
};

export function getArticleContents(
	headings: MarkdownHeading[],
	lang = "en",
	customLabels: Record<string, ContentsLabels> = {},
): ArticleContents | undefined {
	const sections = headings.filter(({ depth }) => depth === 2 || depth === 3);
	if (sections.length < 2) return;

	const translations = new Map(Object.entries(defaultLabels));
	for (const [locale, labels] of Object.entries(customLabels)) {
		translations.set(locale.toLowerCase(), labels);
	}
	const locale = lang.trim().toLowerCase();
	const labelLang =
		[locale, locale.split("-")[0], "en"].find((key) => translations.has(key)) ?? "en";
	const labels = translations.get(labelLang) ?? defaultLabels.en;
	const items: ContentsItem[] = [];
	let parent: ContentsItem | undefined;
	for (const heading of sections) {
		if (heading.depth === 3 && parent) {
			parent.children.push(heading);
		} else {
			const item = { ...heading, children: [] };
			items.push(item);
			if (heading.depth === 2) parent = item;
		}
	}
	return { items, labels, labelLang };
}
