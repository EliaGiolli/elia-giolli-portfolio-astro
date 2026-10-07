import { describe, expect, it } from "vitest";
import { MAX_INDEX_ITEMS, buildIndexItems, formatIndexNumber, isScrolledToBottom } from "./indexNav";

describe("formatIndexNumber", () => {
	it("pads single digits to two", () => {
		expect(formatIndexNumber(1)).toBe("01");
		expect(formatIndexNumber(9)).toBe("09");
	});

	it("keeps two-digit numbers as they are", () => {
		expect(formatIndexNumber(10)).toBe("10");
	});

	it("rejects zero, negative and non-integer positions", () => {
		expect(() => formatIndexNumber(0)).toThrow(RangeError);
		expect(() => formatIndexNumber(-1)).toThrow(RangeError);
		expect(() => formatIndexNumber(1.5)).toThrow(RangeError);
		expect(() => formatIndexNumber(Number.NaN)).toThrow(RangeError);
	});
});

describe("buildIndexItems", () => {
	const sections = [
		{ id: "about", label: "Chi sono" },
		{ id: "case-studies", label: "Case study" },
		{ id: "blog", label: "Blog" },
	];

	it("numbers the entries in order and links them to their section", () => {
		expect(buildIndexItems(sections)).toEqual([
			{ id: "about", label: "Chi sono", num: "01", href: "#about" },
			{ id: "case-studies", label: "Case study", num: "02", href: "#case-studies" },
			{ id: "blog", label: "Blog", num: "03", href: "#blog" },
		]);
	});

	it("accepts a single section", () => {
		expect(buildIndexItems([{ id: "about", label: "Chi sono" }])).toHaveLength(1);
	});

	it("accepts exactly the maximum number of sections", () => {
		const max = Array.from({ length: MAX_INDEX_ITEMS }, (_, i) => ({ id: `s${i}`, label: `Sezione ${i}` }));
		expect(buildIndexItems(max).at(-1)?.num).toBe("06");
	});

	it("rejects an empty list", () => {
		expect(() => buildIndexItems([])).toThrow(/at least one/);
	});

	it("rejects more sections than the design system allows", () => {
		const tooMany = Array.from({ length: MAX_INDEX_ITEMS + 1 }, (_, i) => ({ id: `s${i}`, label: `Sezione ${i}` }));
		expect(() => buildIndexItems(tooMany)).toThrow(/at most 6/);
	});

	it("rejects duplicated ids, so two entries never point at the same section", () => {
		expect(() => buildIndexItems([...sections, { id: "blog", label: "Ancora blog" }])).toThrow(/Duplicated/);
	});

	it("rejects ids that would not work as anchors", () => {
		for (const id of ["", "#blog", "Blog", "chi sono", "1about", "blog/"]) {
			expect(() => buildIndexItems([{ id, label: "Etichetta" }])).toThrow(/Invalid section id/);
		}
	});

	it("rejects empty labels and trims the others", () => {
		expect(() => buildIndexItems([{ id: "about", label: "   " }])).toThrow(/empty label/);
		expect(buildIndexItems([{ id: "about", label: "  Chi sono " }])[0].label).toBe("Chi sono");
	});
});

describe("isScrolledToBottom", () => {
	it("is true when the viewport reaches the end of the document", () => {
		expect(isScrolledToBottom(1200, 800, 2000)).toBe(true);
	});

	it("tolerates sub-pixel rounding near the end", () => {
		expect(isScrolledToBottom(1198.5, 800, 2000)).toBe(true);
	});

	it("is false while there is still content below", () => {
		expect(isScrolledToBottom(1000, 800, 2000)).toBe(false);
	});

	it("is false on a page that does not scroll at all", () => {
		expect(isScrolledToBottom(0, 800, 800)).toBe(false);
		expect(isScrolledToBottom(0, 800, 600)).toBe(false);
	});
});
