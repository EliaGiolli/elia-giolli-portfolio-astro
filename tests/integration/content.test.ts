import { describe, expect, it } from "vitest";
import { loadPage, pages } from "./utils/dist";

const text = (element: Element | null | undefined) => element?.textContent?.replace(/\s+/g, " ").trim() ?? "";

describe("homepage", () => {
	const { document } = loadPage("/");

	it("leads with the Italian positioning", () => {
		expect(text(document.querySelector("h1"))).toBe("Da front-end developer a Technical SEO & Analytics specialist");
	});

	it("renders the sections in order", () => {
		const ids = [...document.querySelectorAll("main > section")].map((section) => section.id);

		expect(ids).toEqual(["hero", "about", "case-studies", "certificates", "blog", "contact"]);
	});

	it("links the case study and the latest posts", () => {
		const hrefs = [...document.querySelectorAll("a")].map((link) => link.getAttribute("href"));

		expect(hrefs).toContain("/case-studies/audit-seo-tecnico-portfolio/");
		expect(hrefs).toContain("/blog/seo-tecnica-portfolio-astro/");
		expect(hrefs).toContain("/blog/da-developer-a-seo-specialist/");
	});

	it("shows the HubSpot certificate first", () => {
		expect(text(document.querySelector("#certificate-tab-0"))).toBe("Digital Marketing");
		expect(document.querySelectorAll('#certificates [role="tab"]')).toHaveLength(4);
	});
});

describe("analytics and GDPR", () => {
	it("renders the consent banner with the GA4 measurement ID in production", () => {
		const banner = loadPage("/").document.querySelector('[role="dialog"][aria-labelledby="cookie-consent-title"]');

		expect(banner?.getAttribute("x-data")).toBe('cookieConsent("G-P6B0WQEQ3H")');
	});

	it("never ships gtag.js in the static HTML: Google loads only after consent", () => {
		for (const page of pages) {
			expect(page.html, page.route).not.toContain("googletagmanager.com");
		}
	});

	it("offers a way to change the choice and a privacy page", () => {
		const { document } = loadPage("/");
		const footer = document.querySelector("footer");

		expect(text(footer?.querySelector("button"))).toBe("Preferenze cookie");
		expect(footer?.querySelector('a[href="/privacy"]')).not.toBeNull();
	});
});

describe("blog", () => {
	it("lists every published post, newest first", () => {
		const titles = [...loadPage("/blog/").document.querySelectorAll("main article h2")].map(text);

		expect(titles).toHaveLength(2);
		expect(titles).toContain("SEO tecnica in pratica: come ho preparato il mio sito per Google");
		expect(titles).toContain("Da front-end developer a SEO specialist: perché il codice è un vantaggio");
	});

	it("shows author, date and reading time on an article", () => {
		const { document } = loadPage("/blog/seo-tecnica-portfolio-astro/");
		const header = text(document.querySelector("main header"));

		expect(header).toContain("di Elia Giolli");
		expect(document.querySelector('main header time[datetime="2026-10-06"]')).not.toBeNull();
		expect(header).toMatch(/\d+ min di lettura/);
	});

	it("serves the article screenshots as optimized WebP with captions", () => {
		const { document } = loadPage("/blog/seo-tecnica-portfolio-astro/");
		const images = [...document.querySelectorAll(".prose-document img")];

		expect(images).toHaveLength(4);
		for (const image of images) {
			expect(image.getAttribute("src")).toMatch(/^\/_astro\/.+\.webp$/);
			expect(image.getAttribute("loading")).toBe("lazy");
			expect(image.getAttribute("alt")?.length).toBeGreaterThan(20);
		}
	});

	it("ends every article with the LinkedIn call to action", () => {
		const { document } = loadPage("/blog/da-developer-a-seo-specialist/");

		expect(text(document.querySelector("#linkedin-callout-title"))).toBe("Continuiamo la conversazione su LinkedIn");
	});
});

describe("case study", () => {
	const { document } = loadPage("/case-studies/audit-seo-tecnico-portfolio/");

	it("shows the challenge, approach and result steps", () => {
		const steps = [...document.querySelectorAll("main ol > li h2")].map(text);

		expect(steps).toEqual(["01 / Sfida", "02 / Approccio", "03 / Risultato"]);
	});

	it("renders the full Markdown write-up", () => {
		expect(text(document.querySelector(".prose-document"))).toContain("Perché partire dal mio sito");
	});
});

describe("CV", () => {
	it("uses the shared tagline and lists the HubSpot certification", () => {
		const page = text(loadPage("/cv/").document.body);

		expect(page).toContain("Da front-end developer a Technical SEO & Analytics specialist");
		expect(page).toContain("Digital Marketing Certified");
	});
});
