/**
 * Whether a nav link points at the page being viewed. Section anchors ("/#about") never
 * count as the current page; real routes match themselves and their children
 * ("/blog" is current on "/blog/" and on "/blog/some-post/").
 */
export function isCurrentPath(href: string, pathname: string): boolean {
	if (href.includes("#")) return false;

	const current = pathname.replace(/\/+$/, "") || "/";
	const target = href.replace(/\/+$/, "") || "/";

	if (target === "/") return current === "/";
	return current === target || current.startsWith(`${target}/`);
}
