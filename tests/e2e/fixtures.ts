import { test as base, expect, type Request } from "@playwright/test";

export const CONSENT_KEY = "analytics-consent";
const GOOGLE_TAG = /googletagmanager\.com|google-analytics\.com/;

interface Fixtures {
	/** Consent stored before the page loads. `null` = first visit, the banner shows. */
	consent: "granted" | "denied" | null;
	/** Every request the page tried to send to Google. */
	googleRequests: Request[];
}

export const test = base.extend<Fixtures>({
	// Most tests are not about the banner: start as a visitor who already declined,
	// so the dialog never covers the elements under test.
	consent: ["denied", { option: true }],

	googleRequests: [
		async ({ context }, use) => {
			const requests: Request[] = [];
			// The suite runs against the production build, which carries the real GA4 ID:
			// never let a test visit reach the live property.
			await context.route(GOOGLE_TAG, (route) => {
				requests.push(route.request());
				return route.abort();
			});
			await use(requests);
		},
		{ auto: true },
	],

	page: async ({ page, consent }, use) => {
		if (consent) {
			await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [CONSENT_KEY, consent] as const);
		}
		await use(page);
	},
});

export { expect };
