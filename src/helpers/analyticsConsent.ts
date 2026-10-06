/**
 * Google Analytics 4 with Consent Mode v2, "basic" implementation: gtag.js is not even
 * downloaded until the visitor accepts. No cookies before consent (GDPR / Garante Privacy)
 * and no third-party script weighing on Core Web Vitals for those who decline.
 */

export type ConsentChoice = "granted" | "denied";

type Gtag = (...args: unknown[]) => void;

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag?: Gtag;
	}
}

export function readConsent(storageKey: string): ConsentChoice | null {
	try {
		const stored = localStorage.getItem(storageKey);
		return stored === "granted" || stored === "denied" ? stored : null;
	} catch {
		// localStorage throws in some privacy modes: treat it as "not chosen yet".
		return null;
	}
}

export function saveConsent(storageKey: string, choice: ConsentChoice): void {
	try {
		localStorage.setItem(storageKey, choice);
	} catch {
		// The choice still applies to this page view.
	}
}

function ensureGtag(): Gtag {
	window.dataLayer = window.dataLayer ?? [];
	if (!window.gtag) {
		window.gtag = function gtag() {
			// gtag.js expects the Arguments object itself, not an array.
			// eslint-disable-next-line prefer-rest-params
			window.dataLayer.push(arguments);
		};
		window.gtag("consent", "default", {
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied",
			analytics_storage: "denied",
		});
	}
	return window.gtag;
}

let loaded = false;

export function loadGoogleAnalytics(measurementId: string): void {
	if (loaded || !measurementId) return;
	loaded = true;

	const gtag = ensureGtag();
	// Only analytics is granted: the site runs no advertising.
	gtag("consent", "update", { analytics_storage: "granted" });
	gtag("js", new Date());
	gtag("config", measurementId, { anonymize_ip: true });

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
	document.head.appendChild(script);
}
