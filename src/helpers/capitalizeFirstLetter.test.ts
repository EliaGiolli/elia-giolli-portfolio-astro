import { describe, expect, it } from "vitest";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
	it("uppercases only the first character", () => {
		expect(capitalizeFirstLetter("technical seo")).toBe("Technical seo");
	});

	it("leaves an empty string untouched", () => {
		expect(capitalizeFirstLetter("")).toBe("");
	});

	it("handles accented letters", () => {
		expect(capitalizeFirstLetter("èra")).toBe("Èra");
	});
});
