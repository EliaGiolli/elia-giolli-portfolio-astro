// @ts-expect-error Alpine is used at runtime and its package has no declarations.
import Alpine from "alpinejs";
// @ts-expect-error The plugin ships without type declarations, like Alpine itself.
import intersect from "@alpinejs/intersect";

import { loadGoogleAnalytics, readConsent, saveConsent, type ConsentChoice } from "../../helpers/analyticsConsent";
import { isScrolledToBottom } from "../../helpers/indexNav";
import { CONSENT_STORAGE_KEY } from "../utils/constants";

// Every component imports this module; the bundler evaluates it once, so Alpine starts once.
// x-intersect drives the active entry of the homepage index.
Alpine.plugin(intersect);

// Quiet time after the last scroll event before the index follows the sections again.
const SCROLL_SETTLE_MS = 150;

// Active entry of the homepage index. Sections set it with x-intersect; reaching the end of the
// page activates the last one, which can be too short to cross the activation band.
Alpine.data("sectionIndex", (sectionIds: string[]) => ({
	active: sectionIds[0] ?? "",
	// After a click on the index the page scrolls through other sections: they must not
	// steal the entry the visitor chose. The lock lifts once scrolling settles.
	locked: false,
	settleTimer: 0,

	init() {
		const fromHash = window.location.hash.slice(1);
		if (sectionIds.includes(fromHash)) this.active = fromHash;

		const onScroll = () => {
			if (this.locked) this.scheduleUnlock();
			else if (this.atBottom()) this.active = sectionIds.at(-1) ?? "";
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
	},

	atBottom() {
		return isScrolledToBottom(window.scrollY, window.innerHeight, document.documentElement.scrollHeight);
	},

	scheduleUnlock() {
		window.clearTimeout(this.settleTimer);
		this.settleTimer = window.setTimeout(() => (this.locked = false), SCROLL_SETTLE_MS);
	},

	// Called by the index links.
	select(id: string) {
		this.active = id;
		this.locked = true;
		// If the section is already in place nothing scrolls: unlock anyway.
		this.scheduleUnlock();
	},

	// Called by x-intersect. Observer callbacks can land after the last scroll event,
	// so at the end of the page they must not take the last entry away.
	enter(id: string) {
		if (!this.locked && !this.atBottom()) this.active = id;
	},

	isActive(id: string) {
		return this.active === id;
	},
}));

Alpine.data("cookieConsent", (measurementId: string) => ({
	visible: false,

	init() {
		const stored = readConsent(CONSENT_STORAGE_KEY);
		if (stored === "granted") loadGoogleAnalytics(measurementId);
		this.visible = stored === null;
		// The footer "Preferenze cookie" link reopens the banner.
		window.addEventListener("open-cookie-preferences", () => (this.visible = true));
	},

	choose(choice: ConsentChoice) {
		saveConsent(CONSENT_STORAGE_KEY, choice);
		if (choice === "granted") {
			loadGoogleAnalytics(measurementId);
		} else {
			// Revoking after an earlier "Accetta": GA stops storing data from now on.
			window.gtag?.("consent", "update", { analytics_storage: "denied" });
		}
		this.visible = false;
	},
}));

Alpine.start();
