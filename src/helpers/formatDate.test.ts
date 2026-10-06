import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
	it("formats a date in Italian, day month year", () => {
		expect(formatDate(new Date("2026-10-06T12:00:00.000Z"))).toBe("6 ottobre 2026");
	});

	it("accepts an ISO string", () => {
		expect(formatDate("2026-01-15T12:00:00.000Z")).toBe("15 gennaio 2026");
	});

	it("rejects an invalid date", () => {
		expect(() => formatDate("non è una data")).toThrowError(RangeError);
	});
});
