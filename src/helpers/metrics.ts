// Shown until real Search Console / GA4 / PageSpeed data exists: numbers are never invented.
export const METRIC_PLACEHOLDER = "[in arrivo]";

export interface MetricDisplay {
	text: string;
	filled: boolean;
}

/** What a MetricTile shows. Missing or blank values become the placeholder; 0 is a real measurement. */
export function formatMetricValue(value: string | number | null | undefined): MetricDisplay {
	if (value === null || value === undefined) return { text: METRIC_PLACEHOLDER, filled: false };
	if (typeof value === "number") {
		return Number.isFinite(value) ? { text: String(value), filled: true } : { text: METRIC_PLACEHOLDER, filled: false };
	}

	const text = value.trim();
	if (text === "" || text === METRIC_PLACEHOLDER) return { text: METRIC_PLACEHOLDER, filled: false };
	return { text, filled: true };
}
