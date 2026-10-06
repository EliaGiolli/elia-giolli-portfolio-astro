import { describe, expect, it } from "vitest";
import { pages } from "./utils/dist";

describe.each(pages.map((page) => [page.route, page] as const))("semantic HTML of %s", (route, { document }) => {
	it("is declared in Italian", () => {
		expect(document.documentElement.getAttribute("lang")).toBe("it");
	});

	it("has exactly one h1 and one main landmark", () => {
		expect(document.querySelectorAll("h1")).toHaveLength(1);
		expect(document.querySelectorAll("main")).toHaveLength(1);
	});

	it("starts with a skip link that targets the main content", () => {
		const skip = document.querySelector('a[href="#main-content"]');

		expect(skip?.textContent?.trim()).toBe("Vai al contenuto principale");
		expect(document.getElementById("main-content")?.tagName).toBe("MAIN");
	});

	it("never skips a heading level going down", () => {
		const levels = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].map((heading) => Number(heading.tagName[1]));

		levels.forEach((level, index) => {
			if (index > 0) expect(level - levels[index - 1], `${route}: h${levels[index - 1]} → h${level}`).toBeLessThanOrEqual(1);
		});
	});

	it("describes every image and reserves its space (no layout shift)", () => {
		for (const image of document.querySelectorAll("img")) {
			expect(image.hasAttribute("alt"), image.outerHTML).toBe(true);
			expect(image.getAttribute("width"), image.outerHTML).toMatch(/^\d+$/);
			expect(image.getAttribute("height"), image.outerHTML).toMatch(/^\d+$/);
		}
	});

	it("opens external links in a new tab safely", () => {
		// Per the HTML spec, noreferrer implies noopener: either one protects window.opener.
		for (const link of document.querySelectorAll('a[target="_blank"]')) {
			expect(link.getAttribute("rel"), link.outerHTML).toMatch(/\bnoopener\b|\bnoreferrer\b/);
		}
	});

	it("gives every link an accessible name", () => {
		for (const link of document.querySelectorAll("a[href]")) {
			const name = (link.getAttribute("aria-label") ?? link.textContent ?? "").trim() || link.querySelector("img")?.getAttribute("alt");

			expect(name, link.outerHTML).toBeTruthy();
		}
	});

	it("uses unique ids", () => {
		const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);

		expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
	});

	it("points every aria-labelledby and aria-controls at an existing element", () => {
		for (const element of document.querySelectorAll("[aria-labelledby], [aria-controls]")) {
			const refs = `${element.getAttribute("aria-labelledby") ?? ""} ${element.getAttribute("aria-controls") ?? ""}`.trim().split(/\s+/);

			for (const ref of refs) {
				expect(document.getElementById(ref), `${route}: #${ref}`).not.toBeNull();
			}
		}
	});
});

describe("navigation", () => {
	it("marks the blog link as the current page on blog routes", () => {
		const blog = pages.find((page) => page.route === "/blog/seo-tecnica-portfolio-astro/");
		const link = blog?.document.querySelector('nav[aria-label="Navigazione principale"] a[href="/blog"]');

		expect(link?.getAttribute("aria-current")).toBe("page");
	});

	it("never marks a section anchor as current", () => {
		const home = pages.find((page) => page.route === "/");

		expect(home?.document.querySelectorAll('a[href^="/#"][aria-current]')).toHaveLength(0);
	});
});
