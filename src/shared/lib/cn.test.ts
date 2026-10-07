import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { cn, DESIGN_SYSTEM_TEXT_SIZES } from "./cn";

describe("cn", () => {
	it("joins class names and drops falsy values", () => {
		expect(cn("px-4", false, undefined, "font-bold")).toBe("px-4 font-bold");
	});

	it("lets the later Tailwind utility win a conflict", () => {
		expect(cn("bg-white px-2", "bg-indigo-600")).toBe("px-2 bg-indigo-600");
	});
});

describe("cn with the design system scale", () => {
	it("keeps a type size and a text colour side by side", () => {
		expect(cn("text-small text-text-body")).toBe("text-small text-text-body");
		expect(cn("text-card-title text-text", "text-accent")).toBe("text-card-title text-accent");
	});

	it("still lets a later type size replace an earlier one", () => {
		expect(cn("text-lead", "text-small")).toBe("text-small");
	});

	it("resolves margin overrides passed by a page", () => {
		expect(cn("mt-4 inline-flex", "mt-0")).toBe("inline-flex mt-0");
	});

	it("knows every type size defined in the theme", () => {
		const css = readFileSync(new URL("../../styles/global.css", import.meta.url), "utf8");
		const themeSizes = [...css.matchAll(/^\s*--text-([a-z-]+?):/gm)].map((match) => match[1]).filter((name) => !name.includes("--"));

		expect([...DESIGN_SYSTEM_TEXT_SIZES].sort()).toEqual([...themeSizes].sort());
	});
});
