import siteConfig from "@/site.config";
import type { Post } from "./content";
import { formatDate } from "./date";
import { calculateReadingTime } from "./text";

export function getPostMetadata(post: Post) {
	const date = post.data.updated ?? post.data.published;
	const lang = post.data.lang ?? "en";
	const readingTimeLang = lang.trim().toLowerCase().split("-")[0] === "cs" ? "cs" : "en";

	return {
		date,
		lang,
		displayDate: formatDate(date, lang),
		readingTimeLang,
		readingTime: siteConfig.showReadingTime
			? `${calculateReadingTime(post.body ?? "").minutes} min ${readingTimeLang === "cs" ? "čtení" : "read"}`
			: null,
		tags: [...(post.data.tags ?? [])].sort((a, b) => a.localeCompare(b, "en")),
	};
}
