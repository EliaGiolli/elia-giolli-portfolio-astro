// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "analytics-consent";
const GTAG_SELECTOR = 'script[src^="https://www.googletagmanager.com/gtag/js"]';

// The module remembers whether GA was loaded: each test gets a fresh copy.
const loadModule = () => import("./analyticsConsent");

const commands = () => (window.dataLayer ?? []).map((args) => Array.from(args as ArrayLike<unknown>));

beforeEach(() => {
	vi.resetModules();
	localStorage.clear();
	document.head.innerHTML = "";
	window.dataLayer = [];
	delete window.gtag;
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("readConsent / saveConsent", () => {
	it("returns null before the visitor has chosen", async () => {
		const { readConsent } = await loadModule();

		expect(readConsent(KEY)).toBeNull();
	});

	it("round-trips both choices", async () => {
		const { readConsent, saveConsent } = await loadModule();

		saveConsent(KEY, "granted");
		expect(readConsent(KEY)).toBe("granted");

		saveConsent(KEY, "denied");
		expect(readConsent(KEY)).toBe("denied");
	});

	it("ignores unexpected stored values", async () => {
		const { readConsent } = await loadModule();
		localStorage.setItem(KEY, "maybe");

		expect(readConsent(KEY)).toBeNull();
	});

	it("survives a localStorage that throws (privacy modes)", async () => {
		const { readConsent, saveConsent } = await loadModule();
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
			throw new Error("blocked");
		});
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("blocked");
		});

		expect(readConsent(KEY)).toBeNull();
		expect(() => saveConsent(KEY, "granted")).not.toThrow();
	});
});

describe("loadGoogleAnalytics", () => {
	it("injects gtag.js once, with the measurement ID", async () => {
		const { loadGoogleAnalytics } = await loadModule();

		loadGoogleAnalytics("G-TEST123");
		loadGoogleAnalytics("G-TEST123");

		const scripts = document.querySelectorAll<HTMLScriptElement>(GTAG_SELECTOR);
		expect(scripts).toHaveLength(1);
		expect(scripts[0].src).toBe("https://www.googletagmanager.com/gtag/js?id=G-TEST123");
		expect(scripts[0].async).toBe(true);
	});

	it("sets every consent to denied first, then grants analytics only", async () => {
		const { loadGoogleAnalytics } = await loadModule();

		loadGoogleAnalytics("G-TEST123");

		const [defaults, update] = commands();
		expect(defaults).toEqual([
			"consent",
			"default",
			{ ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" },
		]);
		expect(update).toEqual(["consent", "update", { analytics_storage: "granted" }]);
	});

	it("configures the property after the consent commands", async () => {
		const { loadGoogleAnalytics } = await loadModule();

		loadGoogleAnalytics("G-TEST123");

		const names = commands().map((args) => args[0]);
		expect(names).toEqual(["consent", "consent", "js", "config"]);
		expect(commands()[3]).toEqual(["config", "G-TEST123", { anonymize_ip: true }]);
	});

	it("does nothing without a measurement ID", async () => {
		const { loadGoogleAnalytics } = await loadModule();

		loadGoogleAnalytics("");

		expect(document.querySelector(GTAG_SELECTOR)).toBeNull();
		expect(commands()).toEqual([]);
	});

	it("escapes the ID in the script URL", async () => {
		const { loadGoogleAnalytics } = await loadModule();

		loadGoogleAnalytics("G-1&x=<y>");

		expect(document.querySelector<HTMLScriptElement>(GTAG_SELECTOR)?.src).toContain("id=G-1%26x%3D%3Cy%3E");
	});
});
