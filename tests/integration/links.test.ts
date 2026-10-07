import { describe, expect, it } from "vitest";
import { existsInDist, loadPage, pages } from "./utils/dist";

/** The dist file an internal href is served from, or null for an external/special link. */
function targetFile(href: string): string | null {
	if (!href.startsWith("/") || href.startsWith("//")) return null;

	const path = href.split("#")[0].split("?")[0];
	if (path === "/") return "index.html";
	if (/\.[a-z0-9]+$/i.test(path)) return path.slice(1);
	return `${path.replace(/^\/|\/$/g, "")}/index.html`;
}

describe("internal links", () => {
	it("all resolve to a file in the build", () => {
		const broken: string[] = [];

		for (const page of pages) {
			for (const link of page.document.querySelectorAll("a[href]")) {
				const href = link.getAttribute("href") ?? "";
				const file = targetFile(href);
				if (file && !existsInDist(file)) broken.push(`${page.route} → ${href}`);
			}
		}

		expect(broken).toEqual([]);
	});

	it("point at anchors that exist on the target page", () => {
		const missing: string[] = [];

		for (const page of pages) {
			for (const link of page.document.querySelectorAll('a[href*="#"]')) {
				const href = link.getAttribute("href") ?? "";
				const [path, hash] = href.split("#");
				if (!hash || (path && !path.startsWith("/"))) continue;

				const target = path ? loadPage(path.endsWith("/") ? path : `${path}/`) : page;
				if (!target.document.getElementById(hash)) missing.push(`${page.route} → ${href}`);
			}
		}

		expect(missing).toEqual([]);
	});
});

describe("cross-linking between posts", () => {
	it("links the first post to the technical article and the case study", () => {
		const { document } = loadPage("/blog/da-developer-a-seo-specialist/");
		const hrefs = [...document.querySelectorAll(".prose a")].map((link) => link.getAttribute("href"));

		expect(hrefs).toContain("/blog/seo-tecnica-portfolio-astro/");
		expect(hrefs).toContain("/case-studies/audit-seo-tecnico-portfolio/");
	});

	it("links the technical article back to the first post", () => {
		const { document } = loadPage("/blog/seo-tecnica-portfolio-astro/");
		const hrefs = [...document.querySelectorAll(".prose a")].map((link) => link.getAttribute("href"));

		expect(hrefs).toContain("/blog/da-developer-a-seo-specialist/");
	});
});
