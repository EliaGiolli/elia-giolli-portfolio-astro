/**
 * schema.org JSON-LD builders. Search engines read these to understand who the author is
 * and what each page contains, so they are built from content data, not from markup.
 */

type JsonLd = Record<string, unknown>;

interface PersonSchemaInput {
	name: string;
	jobTitle: string;
	description: string;
	url: string;
	image: string;
	sameAs: string[];
	knowsAbout: string[];
}

export function buildPersonSchema(person: PersonSchemaInput): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		...person,
	};
}

interface BlogPostingSchemaInput {
	title: string;
	description: string;
	author: string;
	pubDate: Date;
	updatedDate?: Date;
	tags: string[];
	url: string;
	imageUrl: string;
	siteUrl: string;
}

export function buildBlogPostingSchema(post: BlogPostingSchemaInput): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		inLanguage: "it-IT",
		datePublished: post.pubDate.toISOString(),
		dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
		author: { "@type": "Person", name: post.author, url: post.siteUrl },
		mainEntityOfPage: { "@type": "WebPage", "@id": post.url },
		url: post.url,
		image: post.imageUrl,
		keywords: post.tags.join(", "),
	};
}

interface BreadcrumbItem {
	name: string;
	url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
