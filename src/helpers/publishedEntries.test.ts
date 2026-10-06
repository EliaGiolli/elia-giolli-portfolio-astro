import { describe, expect, it } from "vitest";
import { publishedEntries, toIsoDate } from "./publishedEntries";

const entry = (id: string, pubDate: string, draft = false) => ({ id, data: { pubDate: new Date(pubDate), draft } });

const entries = [
	entry("old", "2026-01-10"),
	entry("draft", "2026-12-01", true),
	entry("new", "2026-10-06"),
	entry("middle", "2026-05-20"),
];

describe("publishedEntries", () => {
	it("leaves drafts out of the build", () => {
		expect(publishedEntries(entries).map((item) => item.id)).not.toContain("draft");
	});

	it("keeps drafts when previewing in development", () => {
		expect(publishedEntries(entries, true).map((item) => item.id)).toContain("draft");
	});

	it("sorts newest first", () => {
		expect(publishedEntries(entries).map((item) => item.id)).toEqual(["new", "middle", "old"]);
		expect(publishedEntries(entries, true)[0].id).toBe("draft");
	});

	it("does not mutate the original array", () => {
		const copy = [...entries];
		publishedEntries(entries);

		expect(entries).toEqual(copy);
	});

	it("returns an empty list when there is nothing to publish", () => {
		expect(publishedEntries([])).toEqual([]);
		expect(publishedEntries([entry("only-draft", "2026-01-01", true)])).toEqual([]);
	});
});

describe("toIsoDate", () => {
	it("formats a date as YYYY-MM-DD for the datetime attribute", () => {
		expect(toIsoDate(new Date("2026-10-06T00:00:00.000Z"))).toBe("2026-10-06");
	});
});
