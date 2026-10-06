// Serves dist/ for Playwright. `astro preview` detaches into the background in
// non-interactive shells and exits at once, which Playwright reads as a crashed server;
// the programmatic API keeps the process in the foreground until Playwright stops it.
import { preview } from "astro";

await preview({ server: { host: "127.0.0.1", port: 4321 }, logLevel: "warn" });
