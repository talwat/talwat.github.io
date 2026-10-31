import { promises as fs } from "fs";
import { resolve } from "path";
import { exists } from "~~/server/utils";

const sourceDir = resolve(process.cwd(), "documents/markdown/");

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) throw createError({ status: 400 });
  const id = slug.replace(/\/+$/, "");

  const input = resolve(sourceDir, `${id}.md`);
  await exists(input, true);

  return (await fs.readFile(input)).toString();
});
