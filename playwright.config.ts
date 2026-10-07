import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	// Each worker runs its own Chromium: two stay stable on a laptop that already has a browser open.
	workers: 2,
	reporter: "list",
	use: {
		// Same port as tests/e2e/server.mjs, distinct from the dev server's 4321.
		baseURL: "http://127.0.0.1:4329",
		trace: "on-first-retry",
	},
	// Serves the production build (`npm run test:e2e` builds it first), so the suite sees exactly
	// what Vercel ships, including the consent banner that only exists in production.
	webServer: {
		command: "node tests/e2e/server.mjs",
		url: "http://127.0.0.1:4329",
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
