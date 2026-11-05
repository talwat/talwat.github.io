import footnotes from "@comark/vue/plugins/footnotes";
import rangi from "@comark/vue/plugins/rangi";
import math from "./math";
import toc from "comark/plugins/toc";
import { catppuccin } from "rangi/themes";
import { parseMarkdown } from "comark";

export default async function parse(content: string) {
  return await parseMarkdown(content, {
    plugins: [
      rangi({ theme: catppuccin, lineNumbers: true }),
      math(),
      toc(),
      footnotes(),
    ],
  });
}
