// src/utils/og.tsx

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import siteConfig from "@/site.config";
import { absoluteUrl } from "@/utils/url";
import type { getPostMetadata } from "@/utils/post-meta";
import notoSansRegular from "@/assets/fonts/NotoSans-Regular.ttf";
import notoSerifRegular from "@/assets/fonts/NotoSerif-Regular.ttf";
import notoSerifBold from "@/assets/fonts/NotoSerif-Bold.ttf";

export type OgImageOptions = {
	title: string;
	description?: string;
	metadata?: ReturnType<typeof getPostMetadata>;
	site?: string;
};

const WIDTH = 1200;
const HEIGHT = 630;

export async function generateOgImage({
	title,
	description,
	metadata,
	site = absoluteUrl("/", siteConfig.url),
}: OgImageOptions) {
	const metadataText = metadata
		? [metadata.displayDate, metadata.readingTime, metadata.tags.join(", ")]
				.filter(Boolean)
				.join(" · ")
		: "";
	const markup = {
		type: "div",
		props: {
			style: {
				width: "100%",
				height: "100%",
				background: "#F5F4ED",
				color: "#22201C",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: 72,
			},
			children: [
				{
					type: "div",
					props: {
						style: { display: "flex", flexDirection: "column", gap: 28 },
						children: [
							{
								type: "div",
								props: {
									style: {
										fontFamily: "Lipi4k Serif",
										fontSize: 72,
										lineHeight: 1.1,
										fontWeight: 700,
										letterSpacing: "-0.04em",
										maxWidth: 900,
									},
									children: title,
								},
							},
							...(description
								? [
										{
											type: "div",
											props: {
												style: {
													fontFamily: "Lipi4k Sans",
													fontSize: 30,
													lineHeight: 1.45,
													opacity: 0.8,
													maxWidth: 760,
												},
												children: description,
											},
										},
									]
								: []),
						],
					},
				},
				{
					type: "div",
					props: {
						style: {
							fontFamily: "Lipi4k Sans",
							fontSize: 24,
							display: "flex",
							flexDirection: "column",
							gap: 16,
							width: "100%",
						},
						children: [
							...(metadataText
								? [
										{
											type: "div",
											props: {
												style: { opacity: 0.7, width: "100%", overflowWrap: "anywhere" },
												children: metadataText,
											},
										},
									]
								: []),
							{ type: "div", props: { style: { opacity: 0.6 }, children: site } },
						],
					},
				},
			],
		},
	};

	const svg = await satori(markup, {
		width: WIDTH,
		height: HEIGHT,
		fonts: [
			{
				name: "Lipi4k Serif",
				data: notoSerifRegular,
				weight: 400,
				style: "normal",
			},

			{
				name: "Lipi4k Serif",
				data: notoSerifBold,
				weight: 700,
				style: "normal",
			},

			{
				name: "Lipi4k Sans",
				data: notoSansRegular,
				weight: 400,
				style: "normal",
			},
		],
	});

	const resvg = new Resvg(svg);

	return resvg.render().asPng();
}
