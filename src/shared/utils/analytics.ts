import { GA_MEASUREMENT_ID } from "./constants";

/**
 * The GA4 ID the site actually uses. Empty outside production builds, so visits from
 * `astro dev` never reach the real property; the env variable can override the default.
 */
export const ANALYTICS_ID: string = import.meta.env.PROD
	? import.meta.env.PUBLIC_GA_MEASUREMENT_ID || GA_MEASUREMENT_ID
	: "";
