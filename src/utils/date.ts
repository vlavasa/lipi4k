export function formatDate(
	date: Date,
	lang = "en",
	month: "short" | "long" = "short",
): string {
	return new Intl.DateTimeFormat([lang, "en"], {
		month,
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
}
