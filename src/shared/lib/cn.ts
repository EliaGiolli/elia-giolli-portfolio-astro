import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The design system type scale (text-name, text-small, ...) is unknown to tailwind-merge, which would
// read it as a text colour and drop it next to text-text-body. Register it as font sizes.
export const DESIGN_SYSTEM_TEXT_SIZES = ["name", "role", "card-title", "lead", "card-body", "small", "chip", "toc", "meta", "metric"];

const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [{ text: DESIGN_SYSTEM_TEXT_SIZES }],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
