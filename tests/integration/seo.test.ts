import { describe, expect, it } from "vitest";
import { existsInDist, indexablePages, loadPage, meta, readDist, SITE } from "./utils/dist";

const EXPECTED_ROUTES = [
	"/",
	"/blog/",
	"/blog/da-developer-a-seo-specialist/",
	"/blog/seo-tecnica-portfolio-astro/",
	"/case-studies/",
	"/case-studies/audit-seo-tecnico-portfolio/",
	"/cv/",
	"/privacy/",
];

describe("build output", () => {
	it("generates every public route", () => {
		expect(indexablePages.map((page) => page.route).sort()).toEqual([...EXPECTED_ROUTES].sort());
	});

	it("generates the 404 page", () => {
		expect(existsInDist("404.html")).toBe(true);
	});
});

describe("robots.txt", () => {
	const robots = readDist("robots.txt");

	it("allows crawling the whole site", () => {
		expect(robots).toMatch(/^User-agent: \*$/m);
		expect(robots).toMatch(/^Allow: \/$/m);
		expect(robots).not.toMatch(/^Disallow: \/$/m);
	});

	it("points to the sitemap on the production domain", () => {
		expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
	});
});

describe("sitemap", () => {
	const index = readDist("sitemap-index.xml");
	const sitemap = readDist("sitemap-0.xml");
	const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

	it("indexes the page sitemap", () => {
		expect(index).toContain(`<loc>${SITE}/sitemap-0.xml</loc>`);
	});

	it("lists exactly the public routes, with trailing slashes", () => {
		expect(urls.sort()).toEqual(EXPECTED_ROUTES.map((route) => `${SITE}${route}`).sort());
	});

	it("never lists the 404 page", () => {
		expect(urls.some((url) => url.includes("404"))).toBe(false);
	});
});

describe("RSS feed", () => {
	const rss = readDist("rss.xml");

	it("is declared in Italian", () => {
		expect(rss).toContain("<language>it-IT</language>");
	});

	it("contains every published post with an absolute link", () => {
		expect(rss).toContain(`<link>${SITE}/blog/da-developer-a-seo-specialist/</link>`);
		expect(rss).toContain(`<link>${SITE}/blog/seo-tecnica-portfolio-astro/</link>`);
	});
});

describe.each(indexablePages.map((page) => [page.route, page] as const))("SEO head of %s", (route, page) => {
	const { document } = page;
	const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");

	it("has a non-empty title and a meta description of at most 170 characters", () => {
		const description = meta(document, 'meta[name="description"]') ?? "";

		expect(document.title.trim().length).toBeGreaterThan(0);
		expect(description.length).toBeGreaterThan(50);
		expect(description.length).toBeLessThanOrEqual(170);
	});

	it("declares its own canonical on the production domain", () => {
		expect(canonical).toBe(`${SITE}${route}`);
	});

	it("is indexable", () => {
		expect(meta(document, 'meta[name="robots"]')).toMatch(/^index, follow/);
	});

	it("shares the canonical URL and an absolute image on Open Graph", () => {
		expect(meta(document, 'meta[property="og:url"]')).toBe(canonical);
		expect(meta(document, 'meta[property="og:image"]')).toMatch(new RegExp(`^${SITE}/`));
		expect(meta(document, 'meta[property="og:title"]')).toBe(document.title);
		expect(meta(document, 'meta[name="twitter:card"]')).toBe("summary_large_image");
	});

	it("carries the Search Console verification token", () => {
		expect(meta(document, 'meta[name="google-site-verification"]')).toBe("WrPrcSwf5ah2sfaoB0iRvxd8Qt-qN2BNTn0Rx32ibWM");
	});

	it("links the sitemap and the RSS feed", () => {
		expect(document.querySelector('link[rel="sitemap"]')?.getAttribute("href")).toBe("/sitemap-index.xml");
		expect(document.querySelector('link[rel="alternate"][type="application/rss+xml"]')?.getAttribute("href")).toBe("/rss.xml");
	});
});

describe("page titles", () => {
	it("are unique across the site", () => {
		const titles = indexablePages.map((page) => page.document.title);

		expect(new Set(titles).size).toBe(titles.length);
	});

	it("use the Italian headline, not the old 'turned' wording", () => {
		const home = loadPage("/");

		expect(home.document.title).toBe("Elia Giolli · Da front-end developer a Technical SEO & Analytics specialist");
		expect(indexablePages.some((page) => page.html.includes("turned"))).toBe(false);
	});
});

describe("404 page", () => {
	const { document } = loadPage("/404.html");

	it("asks search engines not to index it", () => {
		expect(meta(document, 'meta[name="robots"]')).toBe("noindex, follow");
	});

	it("has no canonical", () => {
		expect(document.querySelector('link[rel="canonical"]')).toBeNull();
	});
});

describe("social preview", () => {
	it("ships the 1200×630 Open Graph image", () => {
		const home = loadPage("/");

		expect(existsInDist("og-image.png")).toBe(true);
		expect(meta(home.document, 'meta[property="og:image:width"]')).toBe("1200");
		expect(meta(home.document, 'meta[property="og:image:height"]')).toBe("630");
	});
});
