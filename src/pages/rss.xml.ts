import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { publishedEntries } from "../helpers";
import { BLOG_NAME, SITE_DESCRIPTION } from "../shared/utils/constants";

export async function GET(context: APIContext) {
	const posts = publishedEntries(await getCollection("blog"));

	return rss({
		title: `${BLOG_NAME} · Blog`,
		description: SITE_DESCRIPTION,
		// `site` from astro.config.mjs: @astrojs/rss needs it to build absolute links.
		site: context.site!,
		customData: "<language>it-IT</language>",
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			author: post.data.author,
			categories: post.data.tags,
			link: `/blog/${post.id}/`,
		})),
	});
}
