import { unified } from "@astrojs/markdown-remark";
import type { Root } from "hast";
import { visit } from "unist-util-visit";
import { getAssetPath } from "./url";

function rehypeFooterLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "a" && typeof node.properties.href === "string") {
        node.properties.href = getAssetPath(node.properties.href);
      }
    });
  };
}

const renderer = unified({
  gfm: false,
  smartypants: false,
  remarkRehype: { allowDangerousHtml: false },
  rehypePlugins: [rehypeFooterLinks],
}).createRenderer({ syntaxHighlight: false });

export async function renderFooterNote(note?: string): Promise<string> {
  if (!note?.trim()) return "";

  const result = await (await renderer).render(note.trim());
  return result.code;
}
