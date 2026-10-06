import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { JSDOM } from "jsdom";

export const distDir = resolve(import.meta.dirname, "../../../dist");
export const SITE = "https://elia-giolli-portfolio-astro.vercel.app";

export interface Page {
	/** Route as a visitor sees it: "/", "/blog/", "/404.html". */
	route: string;
	document: Document;
	html: string;
}

export function readDist(file: string): string {
	return readFileSync(join(distDir, file), "utf8");
}

export function existsInDist(file: string): boolean {
	return existsSync(join(distDir, file));
}

function htmlFiles(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) return name === "_astro" ? [] : htmlFiles(path);
		return name.endsWith(".html") ? [path] : [];
	});
}

function toRoute(file: string): string {
	const path = relative(distDir, file).split(sep).join("/");
	if (path === "index.html") return "/";
	return path.endsWith("/index.html") ? `/${path.slice(0, -"index.html".length)}` : `/${path}`;
}

// One JSDOM per page per test file: building a DOM is the expensive part.
const cache = new Map<string, Page>();

export function loadPage(route: string): Page {
	const cached = cache.get(route);
	if (cached) return cached;

	const file = route.endsWith(".html") ? route : `${route}index.html`;
	const html = readDist(file);
	const page = { route, html, document: new JSDOM(html).window.document };
	cache.set(route, page);
	return page;
}

/** Every page in the build, keyed by route. */
export const pages: Page[] = htmlFiles(distDir).map((file) => loadPage(toRoute(file)));

/** Pages meant for search engines: everything except the 404. */
export const indexablePages = pages.filter((page) => page.route !== "/404.html");

export function jsonLd(document: Document): Array<Record<string, unknown>> {
	return [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent ?? ""));
}

export function meta(document: Document, selector: string): string | null {
	return document.querySelector(selector)?.getAttribute("content") ?? null;
}
