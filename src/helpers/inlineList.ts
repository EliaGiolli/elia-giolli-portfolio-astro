/** Inline lists use the middle dot: "Core Web Vitals · HTML semantico · Schema.org". Blank items are dropped. */
export function joinInline(items: readonly string[]): string {
	return items.map((item) => item.trim()).filter(Boolean).join(" · ");
}
