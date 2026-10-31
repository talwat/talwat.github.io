import { parseMarkdown } from "comark";
import { promises as fs } from "fs";
import path from "path";
import { exists, getID } from "~~/server/utils/documents";

import rangi from "@comark/vue/plugins/rangi";
import math from "~~/server/utils/mathPlugin";
import { catppuccin } from "rangi/themes";

const sourceDir = path.resolve(process.cwd(), "media/documents/markdown/");

export default defineEventHandler(async (event) => {
  const { id, ext } = getID(event);

  const input = path.resolve(sourceDir, `${id}.md`);
  await exists(input, true);

  const content = (await fs.readFile(input)).toString();
  if (ext == "md") {
    setResponseHeader(event, "Content-Type", "text/markdown");
    return content;
  }

  const document = await parseMarkdown(content, {
    plugins: [rangi({ theme: catppuccin, lineNumbers: true }), math()],
  });

  return document;
});
