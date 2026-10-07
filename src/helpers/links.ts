export type LinkArrow = "→" | "↗" | "";

const FILE_EXTENSION = /\.(pdf|docx?|xlsx?|zip)$/i;

/** http(s) links and protocol-relative links that leave the site. Relative paths and anchors stay internal. */
export function isExternalUrl(href: string, siteHost?: string): boolean {
	const match = /^(?:https?:)?\/\/([^/?#]+)/i.exec(href.trim());
	if (!match) return false;
	return siteHost ? match[1].toLowerCase() !== siteHost.toLowerCase() : true;
}

/**
 * Arrow that closes a link, following the design system:
 * → for site pages reached from a list, ↗ for detail pages, files and external sites,
 * nothing for mailto:/tel: links (they read as "Email" on their own).
 */
export function linkArrow(href: string, options: { detail?: boolean; siteHost?: string } = {}): LinkArrow {
	const target = href.trim();
	if (/^(mailto|tel):/i.test(target)) return "";
	if (options.detail || isExternalUrl(target, options.siteHost)) return "↗";
	if (FILE_EXTENSION.test(target.split(/[?#]/)[0])) return "↗";
	return "→";
}

/** Attributes for links that open another site in a new tab. */
export function externalLinkAttributes(href: string, siteHost?: string): { target?: "_blank"; rel?: string } {
	return isExternalUrl(href, siteHost) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

/** Readable form of a web address for print: "https://www.linkedin.com/in/x/" → "linkedin.com/in/x". */
export function displayUrl(href: string): string | undefined {
	if (!/^https?:\/\//i.test(href.trim())) return undefined;
	return href.trim().replace(/^https?:\/\/(www\.)?/i, "").replace(/\/+$/, "");
}
