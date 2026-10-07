export interface SkillGroup {
	title: string;
	items: readonly string[];
}

// Tool and role names stay in English: they are the keywords recruiters search for.
export const skillGroups: readonly SkillGroup[] = [
	{ title: "Technical SEO", items: ["Core Web Vitals", "HTML semantico", "Schema.org", "Sitemap e robots.txt"] },
	{ title: "Web analytics", items: ["Google Analytics 4", "Google Search Console", "Consent Mode"] },
	{ title: "Digital marketing", items: ["Inbound marketing", "SEO on-page", "certificazione HubSpot Academy"] },
	{ title: "Sviluppo front-end", items: ["HTML", "CSS", "JavaScript", "Astro", "Tailwind CSS"] },
	{ title: "Reti e sicurezza", items: ["Cisco Networking Academy: Networking, Cybersecurity, Network Support and Security"] },
];
