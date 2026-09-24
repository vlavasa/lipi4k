// src/pages/og.png.ts

import type {
  APIRoute,
} from "astro";

import {
  generateOgImage,
} from "@/utils/og";
import siteConfig from "@/site.config";

export const GET: APIRoute =
  async () => {
    const png =
      await generateOgImage(
        {
          title: siteConfig.title,

          description: siteConfig.description,

        }
      );

    return new Response(png, {
      headers: {
        "Content-Type":
          "image/png",
      },
    });
  };
