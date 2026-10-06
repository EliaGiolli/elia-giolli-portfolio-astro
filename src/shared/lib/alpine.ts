// @ts-expect-error Alpine is used at runtime and its package has no declarations.
import Alpine from "alpinejs";

import { loadGoogleAnalytics, readConsent, saveConsent, type ConsentChoice } from "../../helpers/analyticsConsent";
import { CONSENT_STORAGE_KEY } from "../utils/constants";

// Every component imports this module; the bundler evaluates it once, so Alpine starts once.
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
