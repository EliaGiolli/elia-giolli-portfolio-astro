import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					name: "unit",
					// Unit tests sit next to the file they cover.
					include: ["src/**/*.test.ts"],
				},
			},
			{
				test: {
					name: "integration",
					include: ["tests/integration/**/*.test.ts"],
					// One production build for the whole suite; every file then reads dist/.
					globalSetup: ["tests/integration/setup/buildSite.ts"],
					hookTimeout: 180_000,
					// Each file builds a jsdom for every page: run them one at a time, or parallel
					// workers run out of memory on a laptop.
					fileParallelism: false,
				},
			},
		],
	},
});
