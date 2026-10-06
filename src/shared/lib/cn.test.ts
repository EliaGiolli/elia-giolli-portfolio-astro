import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
	it("joins class names and drops falsy values", () => {
		expect(cn("px-4", false, undefined, "font-bold")).toBe("px-4 font-bold");
	});

	it("lets the later Tailwind utility win a conflict", () => {
		expect(cn("bg-white px-2", "bg-indigo-600")).toBe("px-2 bg-indigo-600");
	});
});
