import { describe, expect, it } from "vitest";
import { loadPage, pages } from "./utils/dist";

const text = (element: Element | null | undefined) => element?.textContent?.replace(/\s+/g, " ").trim() ?? "";

// What a screen reader announces: the text without decorative, aria-hidden parts (the arrows).
const accessibleText = (element: Element | null | undefined) => {
	const clone = element?.cloneNode(true) as Element | undefined;
	clone?.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove());
	return text(clone);
};

describe("homepage", () => {
	const { document } = loadPage("/");

	it("uses the name as the only h1, followed by the role and the positioning", () => {
		expect(text(document.querySelector("h1"))).toBe("Elia Giolli");
		expect(text(document.querySelector("header"))).toContain("Technical SEO & Analytics specialist");
		expect(text(document.querySelector("header"))).toContain("Da front-end developer a SEO");
	});

	it("renders the sections in index order", () => {
		const ids = [...document.querySelectorAll("main > section")].map((section) => section.id);

		expect(ids).toEqual(["about", "case-studies", "blog", "skills", "certificates", "contact"]);
	});

	it("numbers the index 01–06 and points each entry at its section", () => {
		const entries = [...document.querySelectorAll('nav[aria-label="Indice"] a')];

		expect(entries.map((link) => link.getAttribute("href"))).toEqual(["#about", "#case-studies", "#blog", "#skills", "#certificates", "#contact"]);
		expect(entries.map((link) => text(link.querySelector("span")))).toEqual(["01", "02", "03", "04", "05", "06"]);
	});

	it("labels every section with an h2 named like its index entry", () => {
		const entries = [...document.querySelectorAll('nav[aria-label="Indice"] a')].map((link) => text(link.lastElementChild));
		const labels = [...document.querySelectorAll("main > section")].map((section) => text(document.getElementById(section.getAttribute("aria-labelledby") ?? "")));

		expect(labels).toEqual(entries);
	});

	it("links the case study and the latest posts", () => {
		const hrefs = [...document.querySelectorAll("a")].map((link) => link.getAttribute("href"));

		expect(hrefs).toContain("/case-studies/audit-seo-tecnico-portfolio/");
		expect(hrefs).toContain("/blog/seo-tecnica-portfolio-astro/");
		expect(hrefs).toContain("/blog/da-developer-a-seo-specialist/");
	});

	it("shows the case study metrics as placeholders until real data exists", () => {
		const tiles = [...document.querySelectorAll("#case-studies [data-metric-filled]")];

		expect(tiles.map((tile) => text(tile.querySelector("dt")))).toEqual(["Impressioni", "Pagine indicizzate", "LCP mobile"]);
		for (const tile of tiles) {
			expect(text(tile.querySelector("dd"))).toBe("[in arrivo]");
			expect(tile.getAttribute("data-metric-filled")).toBe("false");
		}
	});

	it("dates the cards in short Italian format with a machine-readable datetime", () => {
		const date = document.querySelector('#blog time[datetime="2026-10-06"]');

		expect(text(date)).toBe("6 ott 2026");
	});

	it("lists the HubSpot certificate first, each one linking to its proof", () => {
		const titles = [...document.querySelectorAll("#certificates h3")].map(text);

		expect(titles).toHaveLength(4);
		expect(titles[0]).toMatch(/^Digital Marketing/);
		for (const link of document.querySelectorAll("#certificates h3 a")) {
			expect(link.getAttribute("href")).toMatch(/^(https:\/\/|\/_astro\/.+\.webp$)/);
		}
	});

	it("keeps the contact form with its required fields", () => {
		for (const name of ["from_name", "reply_to", "subject", "message"]) {
			expect(document.querySelector(`#contact-form [name="${name}"]`)?.hasAttribute("required"), name).toBe(true);
		}
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
		const titles = [...loadPage("/blog/").document.querySelectorAll('main [aria-label="Elenco degli articoli"] h2')].map(accessibleText);

		expect(titles).toHaveLength(2);
		expect(titles).toContain("SEO tecnica in pratica: come ho preparato il mio sito per Google");
		expect(titles).toContain("Da front-end developer a SEO specialist: perché il codice è un vantaggio");
		// The arrow that closes the link is decorative: hidden from assistive technologies.
		for (const arrow of loadPage("/blog/").document.querySelectorAll('main [aria-label="Elenco degli articoli"] h2 a > span')) {
			expect(arrow.getAttribute("aria-hidden")).toBe("true");
		}
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
		const images = [...document.querySelectorAll(".prose img")];

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
		const steps = document.querySelector('[aria-label="Il case study in tre passaggi"]');

		expect([...(steps?.querySelectorAll("h2") ?? [])].map(text)).toEqual(["Sfida", "Approccio", "Risultato"]);
		expect([...(steps?.querySelectorAll("li > p:first-child") ?? [])].map(text)).toEqual(["01", "02", "03"]);
	});

	it("renders the full Markdown write-up", () => {
		expect(text(document.querySelector(".prose"))).toContain("Perché partire dal mio sito");
	});
});

describe("CV", () => {
	it("uses the shared tagline and lists the HubSpot certification", () => {
		const page = text(loadPage("/cv/").document.body);

		expect(page).toContain("Da front-end developer a Technical SEO & Analytics specialist");
		expect(page).toContain("Digital Marketing Certified");
	});
});
