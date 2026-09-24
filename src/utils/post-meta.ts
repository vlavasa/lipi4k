import siteConfig from "@/site.config";
import type { Post } from "./content";
import { formatDate } from "./date";
import { calculateReadingTime } from "./text";

export function getPostMetadata(post: Post) {
	const date = post.data.updated ?? post.data.published;
	const lang = post.data.lang ?? "en";

	return {
		date,
		lang,
		displayDate: formatDate(date, lang),
		readingTime: siteConfig.showReadingTime ? calculateReadingTime(post.body ?? "").text : null,
		tags: [...(post.data.tags ?? [])].sort((a, b) => a.localeCompare(b, "en")),
	};
}
