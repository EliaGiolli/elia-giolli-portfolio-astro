// Content dates come from frontmatter as UTC midnight: formatting them in UTC keeps the same day
// whatever the time zone of the machine that builds the site.
const longDate = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function parseDate(date: Date | string): Date {
	const parsedDate = date instanceof Date ? date : new Date(date);

	if (Number.isNaN(parsedDate.getTime())) {
		throw new RangeError("Invalid date");
	}

	return parsedDate;
}

/** "6 ottobre 2026": article headers and long-form pages. */
export function formatDate(date: Date | string): string {
	return longDate.format(parseDate(date));
}

/** "6 ott 2026": the date column of a ListCard. */
export function formatShortDate(date: Date | string): string {
	return shortDate.format(parseDate(date));
}
