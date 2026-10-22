import { promises as fs } from "fs";
import { resolve } from "path";
import { exists, getMeta } from "~~/server/utils";

const sourceDir = resolve(process.cwd(), "documents/markdown/");

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "slug");
  if (!id) throw createError({ status: 400 });

  const input = resolve(sourceDir, `${id}.md`);
  await exists(input, true);

  return {
    content: (await fs.readFile(input)).toString(),
    meta: await getMeta(input, "markdown"),
  };
});
