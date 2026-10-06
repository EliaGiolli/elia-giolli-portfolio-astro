import { describe, expect, it } from "vitest";
import { jsonLd, loadPage, pages, SITE } from "./utils/dist";

const byType = (route: string, type: string) => jsonLd(loadPage(route).document).find((schema) => schema["@type"] === type);

describe("JSON-LD", () => {
	it("is valid JSON on every page", () => {
		for (const page of pages) {
			expect(() => jsonLd(page.document), page.route).not.toThrow();
		}
	});

	it("never breaks out of its script tag", () => {
		for (const page of pages) {
			for (const script of page.document.querySelectorAll('script[type="application/ld+json"]')) {
				expect(script.textContent, page.route).not.toContain("</");
			}
		}
	});
});

describe("homepage Person", () => {
	const person = byType("/", "Person");

	it("describes Elia with the clean job title", () => {
		expect(person?.name).toBe("Elia Giolli");
		expect(person?.jobTitle).toBe("Technical SEO & Analytics specialist");
	});

	it("points to the site and an absolute photo", () => {
		expect(person?.url).toBe(`${SITE}/`);
		expect(person?.image).toMatch(new RegExp(`^${SITE}/_astro/.+\\.jpg$`));
	});

	it("links the LinkedIn and GitHub profiles", () => {
		expect(person?.sameAs).toEqual(["https://www.linkedin.com/in/eliagiolli/", "https://github.com/EliaGiolli"]);
	});
});

describe.each([
	["/blog/da-developer-a-seo-specialist/", "Da front-end developer a SEO specialist: perché il codice è un vantaggio"],
	["/blog/seo-tecnica-portfolio-astro/", "SEO tecnica in pratica: come ho preparato il mio sito per Google"],
])("BlogPosting on %s", (route, headline) => {
	const post = byType(route, "BlogPosting");

	it("matches the article headline and its own URL", () => {
		expect(post?.headline).toBe(headline);
		expect(post?.url).toBe(`${SITE}${route}`);
		expect(post?.mainEntityOfPage).toEqual({ "@type": "WebPage", "@id": `${SITE}${route}` });
	});

	it("has publication dates and an author", () => {
		expect(post?.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
		expect(post?.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
		expect(post?.author).toMatchObject({ "@type": "Person", name: "Elia Giolli" });
	});
});

describe.each([
	["/blog/", ["Home", "Blog"]],
	["/blog/seo-tecnica-portfolio-astro/", ["Home", "Blog", "SEO tecnica in pratica: come ho preparato il mio sito per Google"]],
	["/case-studies/", ["Home", "Case studies"]],
	["/case-studies/audit-seo-tecnico-portfolio/", ["Home", "Case studies", "Audit SEO tecnico del mio portfolio"]],
	["/privacy/", ["Home", "Privacy e cookie"]],
])("BreadcrumbList on %s", (route, names) => {
	const breadcrumb = byType(route, "BreadcrumbList");
	const items = (breadcrumb?.itemListElement ?? []) as Array<Record<string, unknown>>;

	it("lists the trail in order", () => {
		expect(items.map((item) => item.name)).toEqual(names);
	});

	it("ends on the page itself, with absolute URLs", () => {
		expect(items.at(-1)?.item).toBe(`${SITE}${route}`);
		expect(items.every((item) => String(item.item).startsWith(`${SITE}/`))).toBe(true);
	});

	it("matches the visible breadcrumbs", () => {
		const visible = [...loadPage(route).document.querySelectorAll('nav[aria-label="Percorso"] li')].map((li) =>
			li.textContent?.replace("›", "").trim(),
		);

		expect(visible).toEqual(names);
	});
});
