import { describe, expect, it } from "vitest";
import { formatDate, formatShortDate } from "./formatDate";

describe("formatDate", () => {
	it("formats a date in Italian, day month year", () => {
		expect(formatDate(new Date("2026-10-06T12:00:00.000Z"))).toBe("6 ottobre 2026");
	});

	it("accepts an ISO string", () => {
		expect(formatDate("2026-01-15T12:00:00.000Z")).toBe("15 gennaio 2026");
	});

	it("keeps the frontmatter day at UTC midnight, whatever the build time zone", () => {
		expect(formatDate(new Date("2026-10-06T00:00:00.000Z"))).toBe("6 ottobre 2026");
		expect(formatDate(new Date("2026-10-06T23:59:59.000Z"))).toBe("6 ottobre 2026");
	});

	it("rejects an invalid date", () => {
		expect(() => formatDate("non è una data")).toThrowError(RangeError);
	});
});

describe("formatShortDate", () => {
	it("abbreviates the month for the card date column", () => {
		expect(formatShortDate(new Date("2026-10-06T00:00:00.000Z"))).toBe("6 ott 2026");
		expect(formatShortDate("2026-01-15")).toBe("15 gen 2026");
	});

	it("does not slip to the previous day at UTC midnight", () => {
		expect(formatShortDate(new Date("2026-01-01T00:00:00.000Z"))).toBe("1 gen 2026");
	});

	it("rejects an invalid date", () => {
		expect(() => formatShortDate("domani")).toThrowError(RangeError);
		expect(() => formatShortDate(new Date(Number.NaN))).toThrowError(RangeError);
	});
});
