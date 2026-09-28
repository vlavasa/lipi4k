import assert from "node:assert/strict";
import { test } from "node:test";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkImageProcessing } from "./remark-image-processing.ts";
import { remarkIllumination } from "./remark-illumination.ts";

const processor = await createMarkdownProcessor({
	remarkPlugins: [remarkImageProcessing, remarkIllumination],
});

function render(
	content: string,
	illumination?: string | { light: string; dark: string },
	collection = "posts",
) {
	return processor.render(content, {
		fileURL: new URL(`../content/${collection}/example.md`, import.meta.url),
		frontmatter: { illumination },
	});
}

test("collects both theme images while preserving exactly one opening letter", async () => {
	const { code, metadata } = await render("Příliš žluťoučký kůň.", {
		light: "./light.png",
		dark: "./dark.png",
	});
	assert.deepEqual(metadata.localImagePaths, ["./light.png", "./dark.png"]);
	assert.match(code, /illumination-image--light/);
	assert.match(code, /illumination-image--dark/);
	assert.equal(code.match(/class="illumination-letter"/g)?.length, 1);
});

test("preserves the complete word, nested formatting, and local image processing", async () => {
	const { code, metadata } = await render(
		"**[Příliš](./other/)** žluťoučký kůň.",
		"./attachments/p.png",
	);
	assert.match(code, /<p class="has-illumination">/);
	assert.match(code, /<strong><a href="\.\/other\/">/);
	assert.match(code, /<span class="illumination-letter">P<\/span>říliš<\/a><\/strong>/);
	assert.deepEqual(metadata.localImagePaths, ["./attachments/p.png"]);
	assert.match(code, /illumination-image/);
});

test("keeps combining accents and opening punctuation intact", async () => {
	const { code } = await render("„C\u030ceský text.“", "./initial.png");
	assert.match(code, /„<span class="illumination-letter">C\u030c<\/span>eský text/);
});

test("skips headings, quotes, and standalone galleries; only changes the first paragraph", async () => {
	const { code } = await render(
		"# Heading\n\n> Quotation\n\n![Photo](./photo.png)\n\nOpening paragraph.\n\nAnother paragraph.",
		"./initial.png",
	);
	assert.match(code, /gallery-single/);
	assert.match(code, /<span class="illumination-letter">O<\/span>pening paragraph/);
	assert.equal(code.match(/class="illumination-letter"/g)?.length, 1);
});

test("leaves unconfigured posts, pages, and non-text openings unchanged", async () => {
	for (const [content, image, collection] of [
		["Plain text.", undefined, "posts"],
		["Plain text.", "./initial.png", "pages"],
		["`Code` first.\n\nAnother paragraph.", "./initial.png", "posts"],
		["![Icon](./icon.png) then text.", "./initial.png", "posts"],
	] as const) {
		const { code, metadata } = await render(content, image, collection);
		assert.doesNotMatch(code, /illumination/);
		assert.ok(!metadata.localImagePaths.includes("./initial.png"));
	}
});
