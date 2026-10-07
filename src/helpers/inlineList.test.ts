import { describe, expect, it } from "vitest";
import { joinInline } from "./inlineList";

describe("joinInline", () => {
	it("separates the items with a middle dot", () => {
		expect(joinInline(["Core Web Vitals", "HTML semantico", "Schema.org"])).toBe("Core Web Vitals · HTML semantico · Schema.org");
	});

	it("returns a single item unchanged and an empty list as an empty string", () => {
		expect(joinInline(["GA4"])).toBe("GA4");
		expect(joinInline([])).toBe("");
	});

	it("drops blank items instead of printing a dangling dot", () => {
		expect(joinInline(["HTML", "  ", "", " CSS "])).toBe("HTML · CSS");
	});
});
