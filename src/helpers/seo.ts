/**
 * Appends the site name once. The homepage title already contains it, so it is not repeated.
 */
export function buildPageTitle(title: string, siteName: string): string {
	return title.includes(siteName) ? title : `${title} | ${siteName}`;
}

/**
 * Astro emits directory-style routes and the sitemap lists them with a trailing slash:
 * the canonical has to agree, or search engines see two versions of the same page.
 */
export function buildCanonicalUrl(pathname: string, site: URL): URL {
	const path = pathname.replace(/\/+$/, "");
	return new URL(path === "" ? "/" : `${path}/`, site);
}
