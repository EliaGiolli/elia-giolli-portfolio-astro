interface DatedEntry {
	data: {
		pubDate: Date;
		draft: boolean;
	};
}

/**
 * Drafts are visible in `astro dev` so they can be previewed, and never reach the build.
 * Entries are returned newest first.
 */
export function publishedEntries<T extends DatedEntry>(entries: T[], includeDrafts: boolean = false): T[] {
	return entries
		.filter((entry) => includeDrafts || !entry.data.draft)
		.sort((first, second) => second.data.pubDate.getTime() - first.data.pubDate.getTime());
}

export function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}
