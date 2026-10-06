import { describe, expect, it } from "vitest";
import { buildCanonicalUrl, buildPageTitle } from "./seo";

const site = new URL("https://example.test");

describe("buildPageTitle", () => {
	it("appends the site name to a page title", () => {
		expect(buildPageTitle("Blog", "Elia Giolli")).toBe("Blog | Elia Giolli");
	});

	it("does not repeat the site name when the title already contains it", () => {
		expect(buildPageTitle("Elia Giolli · Technical SEO", "Elia Giolli")).toBe("Elia Giolli · Technical SEO");
	});
});

describe("buildCanonicalUrl", () => {
	it("keeps the homepage as the bare origin with one slash", () => {
		expect(buildCanonicalUrl("/", site).href).toBe("https://example.test/");
		expect(buildCanonicalUrl("", site).href).toBe("https://example.test/");
	});

	it("always ends a page path with a single trailing slash, like the sitemap", () => {
		expect(buildCanonicalUrl("/blog", site).href).toBe("https://example.test/blog/");
		expect(buildCanonicalUrl("/blog/", site).href).toBe("https://example.test/blog/");
		expect(buildCanonicalUrl("/blog///", site).href).toBe("https://example.test/blog/");
	});

	it("keeps nested routes intact", () => {
		expect(buildCanonicalUrl("/case-studies/audit", site).href).toBe("https://example.test/case-studies/audit/");
	});

	it("uses the configured site origin, not the request origin", () => {
		const production = new URL("https://elia-giolli-portfolio-astro.vercel.app");

		expect(buildCanonicalUrl("/cv", production).href).toBe("https://elia-giolli-portfolio-astro.vercel.app/cv/");
	});
});
