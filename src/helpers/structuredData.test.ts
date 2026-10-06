import { describe, expect, it } from "vitest";
import { buildBlogPostingSchema, buildBreadcrumbSchema, buildPersonSchema } from "./structuredData";

describe("buildPersonSchema", () => {
	const person = {
		name: "Elia Giolli",
		jobTitle: "Technical SEO & Analytics specialist",
		description: "Da front-end developer a SEO.",
		url: "https://example.test/",
		image: "https://example.test/photo.jpg",
		sameAs: ["https://www.linkedin.com/in/eliagiolli/", "https://github.com/EliaGiolli"],
		knowsAbout: ["Technical SEO", "Google Analytics 4"],
	};

	it("describes a schema.org Person", () => {
		const schema = buildPersonSchema(person);

		expect(schema["@context"]).toBe("https://schema.org");
		expect(schema["@type"]).toBe("Person");
	});

	it("passes every field through unchanged", () => {
		expect(buildPersonSchema(person)).toMatchObject(person);
	});
});

describe("buildBlogPostingSchema", () => {
	const post = {
		title: "SEO tecnica in pratica",
		description: "Come ho preparato il mio sito per Google.",
		author: "Elia Giolli",
		pubDate: new Date("2026-10-06T00:00:00.000Z"),
		tags: ["Technical SEO", "GA4"],
		url: "https://example.test/blog/seo-tecnica/",
		imageUrl: "https://example.test/og-image.png",
		siteUrl: "https://example.test/",
	};

	it("describes an Italian BlogPosting", () => {
		const schema = buildBlogPostingSchema(post);

		expect(schema["@type"]).toBe("BlogPosting");
		expect(schema.inLanguage).toBe("it-IT");
		expect(schema.headline).toBe(post.title);
		expect(schema.description).toBe(post.description);
	});

	it("falls back to the publication date when the post was never updated", () => {
		const schema = buildBlogPostingSchema(post);

		expect(schema.datePublished).toBe("2026-10-06T00:00:00.000Z");
		expect(schema.dateModified).toBe("2026-10-06T00:00:00.000Z");
	});

	it("prefers the update date when there is one", () => {
		const schema = buildBlogPostingSchema({ ...post, updatedDate: new Date("2026-10-20T00:00:00.000Z") });

		expect(schema.datePublished).toBe("2026-10-06T00:00:00.000Z");
		expect(schema.dateModified).toBe("2026-10-20T00:00:00.000Z");
	});

	it("links the author to the site and the post to its own URL", () => {
		const schema = buildBlogPostingSchema(post);

		expect(schema.author).toEqual({ "@type": "Person", name: "Elia Giolli", url: post.siteUrl });
		expect(schema.mainEntityOfPage).toEqual({ "@type": "WebPage", "@id": post.url });
		expect(schema.url).toBe(post.url);
		expect(schema.image).toBe(post.imageUrl);
	});

	it("flattens the tags into keywords", () => {
		expect(buildBlogPostingSchema(post).keywords).toBe("Technical SEO, GA4");
	});

	it("serialises to valid JSON for the ld+json script", () => {
		expect(() => JSON.parse(JSON.stringify(buildBlogPostingSchema(post)))).not.toThrow();
	});
});

describe("buildBreadcrumbSchema", () => {
	const items = [
		{ name: "Home", url: "https://example.test/" },
		{ name: "Blog", url: "https://example.test/blog/" },
		{ name: "Articolo", url: "https://example.test/blog/articolo/" },
	];

	it("describes a BreadcrumbList", () => {
		expect(buildBreadcrumbSchema(items)["@type"]).toBe("BreadcrumbList");
	});

	it("numbers the items from 1, in order", () => {
		const list = buildBreadcrumbSchema(items).itemListElement as Array<Record<string, unknown>>;

		expect(list.map((item) => item.position)).toEqual([1, 2, 3]);
		expect(list[2]).toEqual({ "@type": "ListItem", position: 3, name: "Articolo", item: "https://example.test/blog/articolo/" });
	});

	it("handles an empty trail", () => {
		expect(buildBreadcrumbSchema([]).itemListElement).toEqual([]);
	});
});
