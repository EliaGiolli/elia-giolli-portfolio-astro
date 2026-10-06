import { describe, expect, it } from "vitest";
import { isCurrentPath } from "./navigation";

describe("isCurrentPath", () => {
	it("never marks a section anchor as the current page", () => {
		expect(isCurrentPath("/#about", "/")).toBe(false);
		expect(isCurrentPath("/#contact", "/")).toBe(false);
	});

	it("matches a route with or without the trailing slash", () => {
		expect(isCurrentPath("/blog", "/blog")).toBe(true);
		expect(isCurrentPath("/blog", "/blog/")).toBe(true);
		expect(isCurrentPath("/blog/", "/blog")).toBe(true);
	});

	it("keeps the section current on its child pages", () => {
		expect(isCurrentPath("/blog", "/blog/seo-tecnica-portfolio-astro/")).toBe(true);
	});

	it("does not match routes that only share a prefix", () => {
		expect(isCurrentPath("/blog", "/blogroll/")).toBe(false);
	});

	it("marks the homepage link current only on the homepage", () => {
		expect(isCurrentPath("/", "/")).toBe(true);
		expect(isCurrentPath("/", "/blog/")).toBe(false);
	});
});
