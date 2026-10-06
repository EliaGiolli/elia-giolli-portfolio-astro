import { expect, test } from "./fixtures";

const HEADLINE = "Da front-end developer a Technical SEO & Analytics specialist";

test.describe("main navigation", () => {
	test("scrolls to each homepage section from the navbar", async ({ page }) => {
		await page.goto("/");
		const nav = page.getByRole("navigation", { name: "Navigazione principale" });

		for (const [label, id] of [
			["Su di me", "about"],
			["Certificazioni", "certificates"],
			["Case studies", "case-studies"],
			["Contatti", "contact"],
		]) {
			await nav.getByRole("link", { name: label, exact: true }).click();
			await expect(page).toHaveURL(new RegExp(`#${id}$`));
			await expect(page.locator(`#${id}`)).toBeInViewport();
		}
	});

	test("opens the blog and marks it as the current page", async ({ page }) => {
		await page.goto("/");
		const nav = page.getByRole("navigation", { name: "Navigazione principale" });

		await nav.getByRole("link", { name: "Blog", exact: true }).click();
		await expect(page).toHaveURL(/\/blog\/?$/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("SEO tecnica e analytics, spiegate da uno sviluppatore");
		await expect(nav.getByRole("link", { name: "Blog", exact: true })).toHaveAttribute("aria-current", "page");
	});

	test("reaches a homepage section from another page", async ({ page }) => {
		await page.goto("/blog/");

		await page.getByRole("navigation", { name: "Navigazione principale" }).getByRole("link", { name: "Su di me" }).click();
		await expect(page).toHaveURL(/\/#about$/);
		await expect(page.getByRole("heading", { name: "Su di me", level: 2 })).toBeVisible();
	});

	test("returns home from the logo", async ({ page }) => {
		await page.goto("/privacy/");

		await page.getByRole("link", { name: "Elia Giolli, homepage" }).click();
		await expect(page).toHaveURL(/\/$/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(HEADLINE);
	});
});

test.describe("mobile menu", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test("opens, navigates and closes", async ({ page }) => {
		await page.goto("/");
		const toggle = page.getByRole("button", { name: "Apri il menu di navigazione" });
		const menu = page.getByRole("navigation", { name: "Navigazione mobile" });

		await expect(menu).toBeHidden();
		await toggle.click();
		await expect(toggle).toHaveAttribute("aria-expanded", "true");
		await expect(menu).toBeVisible();

		await menu.getByRole("link", { name: "Case studies" }).click();
		await expect(page).toHaveURL(/#case-studies$/);
		await expect(menu).toBeHidden();
		await expect(toggle).toHaveAttribute("aria-expanded", "false");
	});

	test("closes with the Escape key", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: "Apri il menu di navigazione" }).click();
		const menu = page.getByRole("navigation", { name: "Navigazione mobile" });
		await expect(menu).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(menu).toBeHidden();
	});
});

test.describe("keyboard access", () => {
	test("the skip link is the first stop and jumps to the main content", async ({ page }) => {
		await page.goto("/blog/");

		await page.keyboard.press("Tab");
		const skip = page.getByRole("link", { name: "Vai al contenuto principale" });
		await expect(skip).toBeFocused();
		await expect(skip).toBeVisible();

		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/#main-content$/);
		await expect(page.locator("#main-content")).toBeFocused();
	});
});

test.describe("404", () => {
	test("answers an unknown URL with the not-found page", async ({ page }) => {
		const response = await page.goto("/questa-pagina-non-esiste/");

		expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("404 · Pagina non trovata");

		await page.getByRole("link", { name: "Vai al blog" }).click();
		await expect(page).toHaveURL(/\/blog\/?$/);
	});
});
