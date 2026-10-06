import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const caseStudiesCollection = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: './src/content/case-studies'
    }),
    schema: z.object({
        title: z.string(),
        // Used as meta description and card copy: keep it around 150 characters.
        description: z.string().max(170),
        pubDate: z.date(),
        tags: z.array(z.string()),
        // The three steps shown above the full write-up.
        challenge: z.string(),
        approach: z.string(),
        result: z.string(),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        draft: z.boolean().default(false),
    })
});

const blogCollection = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: './src/content/blog'
    }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string().max(170),
        pubDate: z.date(),
        updatedDate: z.date().optional(),
        author: z.string().default("Elia Giolli"),
        tags: z.array(z.string()),
        // The LinkedIn post this article was repurposed into, once published there.
        linkedinUrl: z.string().url().optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        draft: z.boolean().default(false),
    }).refine((data) => !data.cover || Boolean(data.coverAlt?.trim()), {
        message: "A cover image needs its coverAlt description",
        path: ["coverAlt"],
    })
});

export const collections = {
    caseStudies: caseStudiesCollection,
    blog: blogCollection,
}
