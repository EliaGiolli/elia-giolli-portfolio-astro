import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../../..");
const astroCli = resolve(projectRoot, "node_modules/astro/bin/astro.mjs");

/** Builds the site once before the integration suite, exactly as Vercel does. */
export default function buildSite(): void {
	try {
		execFileSync(process.execPath, [astroCli, "build"], {
			cwd: projectRoot,
			// Vitest sets NODE_ENV=test; the build must see production, or the analytics banner
			// (production only) would be missing from the HTML under test.
			env: { ...process.env, NODE_ENV: "production" },
			encoding: "utf8",
			stdio: ["ignore", "pipe", "pipe"],
		});
	} catch (error) {
		const details = error && typeof error === "object" && "stderr" in error ? String(error.stderr) : String(error);
		throw new Error(`Astro build failed before the integration tests.\n${details}`);
	}
}
