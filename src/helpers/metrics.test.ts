import { describe, expect, it } from "vitest";
import { METRIC_PLACEHOLDER, formatMetricValue } from "./metrics";

describe("formatMetricValue", () => {
	it("shows the placeholder while the value is missing", () => {
		expect(formatMetricValue(undefined)).toEqual({ text: METRIC_PLACEHOLDER, filled: false });
		expect(formatMetricValue(null)).toEqual({ text: METRIC_PLACEHOLDER, filled: false });
	});

	it("treats blank strings as missing", () => {
		expect(formatMetricValue("")).toEqual({ text: METRIC_PLACEHOLDER, filled: false });
		expect(formatMetricValue("   ")).toEqual({ text: METRIC_PLACEHOLDER, filled: false });
	});

	it("does not mark the placeholder itself as a filled value", () => {
		expect(formatMetricValue("[in arrivo]").filled).toBe(false);
	});

	it("keeps 0 as a real measurement", () => {
		expect(formatMetricValue(0)).toEqual({ text: "0", filled: true });
		expect(formatMetricValue("0")).toEqual({ text: "0", filled: true });
	});

	it("rejects numbers that are not measurements", () => {
		expect(formatMetricValue(Number.NaN).filled).toBe(false);
		expect(formatMetricValue(Number.POSITIVE_INFINITY).filled).toBe(false);
	});

	it("reports real values as they are, trimmed", () => {
		expect(formatMetricValue(" 1,8 s ")).toEqual({ text: "1,8 s", filled: true });
		expect(formatMetricValue(1240)).toEqual({ text: "1240", filled: true });
	});
});
