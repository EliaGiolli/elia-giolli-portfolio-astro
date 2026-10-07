import { expect, test } from "./fixtures";

test.describe("blog", () => {
	test("goes from the homepage to an article and back through the breadcrumbs", async ({ page }) => {
		await page.goto("/");

		await page.getByRole("link", { name: "Tutti gli articoli" }).click();
		await expect(page).toHaveURL(/\/blog\/?$/);

		await page.getByRole("link", { name: "SEO tecnica in pratica: come ho preparato il mio sito per Google" }).click();
		await expect(page).toHaveURL(/\/blog\/seo-tecnica-portfolio-astro\/$/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("SEO tecnica in pratica: come ho preparato il mio sito per Google");
		await expect(page.getByText(/\d+ min di lettura/)).toBeVisible();

		await page.getByRole("navigation", { name: "Percorso" }).getByRole("link", { name: "Blog" }).click();
		await expect(page).toHaveURL(/\/blog\/$/);
	});

	test("loads the article screenshots when they scroll into view", async ({ page }) => {
		await page.goto("/blog/seo-tecnica-portfolio-astro/");
		const screenshot = page.getByRole("img", { name: /Panoramica in tempo reale di GA4/ });

		await screenshot.scrollIntoViewIfNeeded();
		await expect(screenshot).toBeVisible();
		await expect.poll(() => screenshot.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
	});

	test("links the two posts to each other", async ({ page }) => {
		await page.goto("/blog/da-developer-a-seo-specialist/");

		await page.getByRole("link", { name: "SEO tecnica in pratica: come ho preparato il mio sito per Google" }).click();
		await expect(page).toHaveURL(/\/blog\/seo-tecnica-portfolio-astro\/$/);

		await page.getByRole("link", { name: "primo articolo" }).click();
		await expect(page).toHaveURL(/\/blog\/da-developer-a-seo-specialist\/$/);
	});

	test("points the LinkedIn call to action at the profile in a new tab", async ({ page }) => {
		await page.goto("/blog/da-developer-a-seo-specialist/");
		const cta = page.getByRole("link", { name: "Seguimi su LinkedIn" });

		await expect(cta).toHaveAttribute("href", "https://www.linkedin.com/in/eliagiolli/");
		await expect(cta).toHaveAttribute("target", "_blank");
	});
});

test.describe("case studies", () => {
	test("opens the audit from its title", async ({ page }) => {
		await page.goto("/case-studies/");

		await page.getByRole("link", { name: "Audit SEO tecnico del mio portfolio" }).click();
		await expect(page).toHaveURL(/\/case-studies\/audit-seo-tecnico-portfolio\/$/);
		await expect(page.getByRole("heading", { name: "Sfida" })).toBeVisible();
		await expect(page.getByRole("heading", { name: "Il case study completo" })).toBeVisible();
	});
});

test.describe("certificates", () => {
	test("lists every certificate, HubSpot first, with a link to its proof", async ({ page }) => {
		await page.goto("/#certificates");
		const titles = page.locator("#certificates h3");

		await expect(titles).toHaveCount(4);
		await expect(titles.first()).toContainText("Digital Marketing");

		const proof = page.getByRole("link", { name: /^Network Support and Security/ });
		const href = await proof.getAttribute("href");
		const response = await page.request.get(href ?? "");
		expect(response.ok()).toBe(true);
		expect(response.headers()["content-type"]).toContain("image/webp");
	});
});

test.describe("contact form", () => {
	test("blocks an empty submission with native validation", async ({ page }) => {
		await page.goto("/#contact");

		await page.getByRole("button", { name: "Invia messaggio" }).click();
		await expect(page).toHaveURL(/#contact$/);
		expect(await page.getByLabel("Nome").evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
	});

	test("rejects a malformed email", async ({ page }) => {
		await page.goto("/#contact");
		const email = page.getByLabel("Email");

		await email.fill("non-una-email");
		expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
	});
});
