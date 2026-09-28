import type { Paragraph, PhrasingContent, Root } from "mdast";
import type { Plugin } from "unified";

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });

/** Wrap the opening letter without changing the article's text or inline markup. */
function wrapInitial(children: PhrasingContent[]): boolean {
	for (let index = 0; index < children.length; index++) {
		const child = children[index];
		if (child.type === "text") {
			if (!child.value.trim()) continue;
			// Keep opening quotes and punctuation; don't split accented graphemes.
			const match = child.value.match(/^[\s\p{P}]*\p{L}/u);
			if (!match) return false;
			const offset = match[0].search(/\p{L}/u);
			const letter = graphemes.segment(child.value.slice(offset))[Symbol.iterator]().next()
				.value?.segment;
			if (!letter) return false;
			children.splice(
				index,
				1,
				{ type: "text", value: child.value.slice(0, offset) },
				{
					type: "text",
					value: letter,
					data: { hName: "span", hProperties: { className: ["illumination-letter"] } },
				},
				{ type: "text", value: child.value.slice(offset + letter.length) },
			);
			return true;
		}
		if (
			child.type === "strong" ||
			child.type === "emphasis" ||
			child.type === "delete" ||
			child.type === "link" ||
			child.type === "linkReference"
		) {
			return wrapInitial(child.children);
		}
		// Code, images, HTML and MDX expressions aren't a textual initial.
		return false;
	}
	return false;
}

/** Run after the gallery plugin and before Astro collects/optimizes local images. */
export const remarkIllumination: Plugin<[], Root> = () => (tree, file) => {
	if (!file.path || !/(^|\/)src\/content\/posts\//.test(file.path.replaceAll("\\", "/"))) return;
	const source = file.data.astro?.frontmatter?.illumination;
	const images: { url: string; className: string }[] = [];
	if (typeof source === "string" && source.trim()) {
		images.push({ url: source.trim(), className: "illumination-image" });
	} else if (
		source &&
		typeof source === "object" &&
		"light" in source &&
		"dark" in source &&
		typeof source.light === "string" &&
		typeof source.dark === "string"
	) {
		images.push(
			{ url: source.light.trim(), className: "illumination-image--light" },
			{ url: source.dark.trim(), className: "illumination-image--dark" },
		);
	} else {
		return;
	}

	const paragraph = tree.children.find(
		(node): node is Paragraph => node.type === "paragraph" && !node.data?.hName,
	);
	if (!paragraph || !wrapInitial(paragraph.children)) return;

	paragraph.data ??= {};
	paragraph.data.hProperties = {
		...paragraph.data.hProperties,
		className: ["has-illumination"],
	};
	paragraph.children.unshift(
		...images.map(
			({ url, className }): PhrasingContent => ({
				type: "image",
				url,
				alt: "",
				data: {
					hProperties: {
						className,
						loading: "eager",
						decoding: "async",
					},
				},
			}),
		),
	);
};
