export interface IndexSection {
	id: string;
	label: string;
}

export interface IndexItem extends IndexSection {
	num: string;
	href: `#${string}`;
}

// The design system caps the homepage index at six entries: more than that stops reading as a summary.
export const MAX_INDEX_ITEMS = 6;

const SECTION_ID = /^[a-z][a-z0-9-]*$/;

/** Two-digit index number: 1 → "01", 12 → "12". */
export function formatIndexNumber(position: number): string {
	if (!Number.isInteger(position) || position < 1) throw new RangeError(`Invalid index position: ${position}`);
	return String(position).padStart(2, "0");
}

/**
 * Turns the homepage sections into index entries (number, label, anchor).
 * Throws on configurations that would break the index: no sections, too many,
 * duplicated or malformed ids, empty labels.
 */
export function buildIndexItems(sections: readonly IndexSection[]): IndexItem[] {
	if (sections.length === 0) throw new Error("The index needs at least one section.");
	if (sections.length > MAX_INDEX_ITEMS) {
		throw new Error(`The index supports at most ${MAX_INDEX_ITEMS} sections, got ${sections.length}.`);
	}

	const seen = new Set<string>();
	return sections.map(({ id, label }, index) => {
		if (!SECTION_ID.test(id)) throw new Error(`Invalid section id: "${id}".`);
		if (seen.has(id)) throw new Error(`Duplicated section id: "${id}".`);
		if (label.trim() === "") throw new Error(`Section "${id}" has an empty label.`);
		seen.add(id);
		return { id, label: label.trim(), num: formatIndexNumber(index + 1), href: `#${id}` };
	});
}

/**
 * Whether the page is scrolled to its end. The last section of the homepage can be too short
 * to ever reach the activation band of the index, so reaching the bottom activates it.
 */
export function isScrolledToBottom(scrollY: number, viewportHeight: number, documentHeight: number, tolerance = 2): boolean {
	// A page that fits in the viewport has nothing to scroll: it is not "at the bottom".
	if (documentHeight <= viewportHeight) return false;
	return scrollY + viewportHeight >= documentHeight - tolerance;
}
