import { describe, expect, it } from "vitest";
import { externalLinkAttributes, isExternalUrl, linkArrow } from "./links";

describe("isExternalUrl", () => {
	it("treats absolute and protocol-relative URLs as external", () => {
		expect(isExternalUrl("https://www.linkedin.com/in/eliagiolli/")).toBe(true);
		expect(isExternalUrl("http://example.com")).toBe(true);
		expect(isExternalUrl("//cdn.example.com/file.js")).toBe(true);
	});

	it("treats paths, anchors and mailto links as internal", () => {
		expect(isExternalUrl("/blog/")).toBe(false);
		expect(isExternalUrl("#blog")).toBe(false);
		expect(isExternalUrl("blog/post")).toBe(false);
		expect(isExternalUrl("mailto:eliagiolli22@gmail.com")).toBe(false);
	});

	it("does not count the site's own host as external, whatever the case", () => {
		expect(isExternalUrl("https://eliagiolli.dev/blog/", "eliagiolli.dev")).toBe(false);
		expect(isExternalUrl("https://EliaGiolli.dev/", "eliagiolli.dev")).toBe(false);
		expect(isExternalUrl("https://github.com/EliaGiolli", "eliagiolli.dev")).toBe(true);
	});
});

describe("linkArrow", () => {
	it("uses → for site pages reached from a list", () => {
		expect(linkArrow("/blog/")).toBe("→");
		expect(linkArrow("/#contact")).toBe("→");
	});

	it("uses ↗ for detail pages", () => {
		expect(linkArrow("/case-studies/audit-seo-tecnico-portfolio/", { detail: true })).toBe("↗");
		expect(linkArrow("/cv/", { detail: true })).toBe("↗");
	});

	it("uses ↗ for external sites", () => {
		expect(linkArrow("https://github.com/EliaGiolli")).toBe("↗");
	});

	it("uses ↗ for downloadable files, ignoring query and hash", () => {
		expect(linkArrow("/cv.pdf")).toBe("↗");
		expect(linkArrow("/files/report.PDF?v=2#page=3")).toBe("↗");
	});

	it("adds no arrow to mailto and tel links", () => {
		expect(linkArrow("mailto:eliagiolli22@gmail.com")).toBe("");
		expect(linkArrow("MAILTO:eliagiolli22@gmail.com", { detail: true })).toBe("");
		expect(linkArrow("tel:+390000000")).toBe("");
	});

	it("ignores surrounding whitespace", () => {
		expect(linkArrow("  https://github.com/EliaGiolli ")).toBe("↗");
	});
});

describe("externalLinkAttributes", () => {
	it("opens external sites in a new tab without leaking the opener", () => {
		expect(externalLinkAttributes("https://github.com/EliaGiolli")).toEqual({ target: "_blank", rel: "noopener noreferrer" });
	});

	it("leaves internal and mailto links in the same tab", () => {
		expect(externalLinkAttributes("/blog/")).toEqual({});
		expect(externalLinkAttributes("mailto:eliagiolli22@gmail.com")).toEqual({});
	});
});
