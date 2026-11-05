import { promises as fs } from "fs";
import path from "path";
import { exists, getID } from "~~/server/media/utils";
import { parse } from "~~/shared/markdown";

const sourceDir = path.resolve(process.cwd(), "documents/markdown/");

export default defineEventHandler(async (event) => {
  const { id, ext } = getID(event);

  const input = path.resolve(sourceDir, `${id}.md`);
  await exists(input, true);

  const content = (await fs.readFile(input)).toString();
  if (ext == ".md") {
    setResponseHeader(event, "Content-Type", "text/markdown");
    return content;
  }

  return await parse(content);
});
