import { CONSENT_KEY, expect, test } from "./fixtures";

const banner = (page: import("@playwright/test").Page) => page.getByRole("dialog", { name: "Statistiche anonime, solo se vuoi" });
const storedConsent = (page: import("@playwright/test").Page) => page.evaluate((key) => localStorage.getItem(key), CONSENT_KEY);

test.describe("first visit", () => {
	test.use({ consent: null });

	test("shows the banner and sends nothing to Google before a choice", async ({ page, googleRequests }) => {
		await page.goto("/");

		await expect(banner(page)).toBeVisible();
		await expect(banner(page).getByRole("link", { name: "Privacy e cookie" })).toHaveAttribute("href", "/privacy");
		await page.waitForLoadState("networkidle");
		expect(googleRequests).toHaveLength(0);
		expect(await storedConsent(page)).toBeNull();
	});

	test("loads Google Analytics only after Accetta, and remembers it", async ({ page, googleRequests }) => {
		await page.goto("/");

		await banner(page).getByRole("button", { name: "Accetta" }).click();
		await expect(banner(page)).toBeHidden();
		await expect.poll(() => googleRequests.length).toBeGreaterThan(0);
		expect(googleRequests[0].url()).toContain("gtag/js?id=G-P6B0WQEQ3H");
		expect(await storedConsent(page)).toBe("granted");

		await page.reload();
		await expect(banner(page)).toBeHidden();
	});

	test("keeps Google out after Rifiuta, across pages", async ({ page, googleRequests }) => {
		await page.goto("/");

		await banner(page).getByRole("button", { name: "Rifiuta" }).click();
		await expect(banner(page)).toBeHidden();
		expect(await storedConsent(page)).toBe("denied");

		await page.goto("/blog/");
		await expect(banner(page)).toBeHidden();
		await page.waitForLoadState("networkidle");
		expect(googleRequests).toHaveLength(0);
	});
});

test.describe("returning visitor", () => {
	test.use({ consent: "granted" });

	test("loads Google Analytics straight away without asking again", async ({ page, googleRequests }) => {
		await page.goto("/");

		await expect(banner(page)).toBeHidden();
		await expect.poll(() => googleRequests.length).toBeGreaterThan(0);
	});
});

test.describe("changing your mind", () => {
	test("the footer link reopens the banner", async ({ page }) => {
		await page.goto("/");
		await expect(banner(page)).toBeHidden();

		await page.getByRole("contentinfo").getByRole("button", { name: "Preferenze cookie" }).click();
		await expect(banner(page)).toBeVisible();

		await banner(page).getByRole("button", { name: "Accetta" }).click();
		expect(await storedConsent(page)).toBe("granted");
	});
});
