// Serves dist/ for Playwright. `astro preview` detaches into the background in
// non-interactive shells and exits at once, which Playwright reads as a crashed server;
// the programmatic API keeps the process in the foreground until Playwright stops it.
// Its own port, never 4321: with reuseExistingServer a running `astro dev` would otherwise be
// picked up and the suite would test the dev server instead of the production build.
import { preview } from "astro";

const E2E_PORT = 4329;

await preview({ server: { host: "127.0.0.1", port: E2E_PORT }, logLevel: "warn" });
