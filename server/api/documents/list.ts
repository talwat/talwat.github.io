import { contents, exists, getMeta } from "~~/server/utils";
import path from "path";
import { Dirent } from "fs";
import { DocumentType, Item } from "~~/shared/types";

const documentsDir = path.resolve(process.cwd(), "documents");

const isDocumentType = (value?: string): value is DocumentType =>
  value === "markdown" || value === "typst";

const isValidEntry = async (type: DocumentType, entry: Dirent<string>) =>
  type === "typst"
    ? entry.isDirectory() &&
      (await exists(path.join(entry.parentPath, entry.name, "main.typ"), false))
    : entry.isFile() && path.extname(entry.name) === ".md";

export default defineEventHandler(async () => {
  const lists: Item[] = [];

  const entries = await contents("documents", true);
  for (const entry of entries) {
    const full = path.join(entry.parentPath, entry.name);
    const [type, ...rest] = path.relative(documentsDir, full).split(path.sep);

    if (!rest.length || !isDocumentType(type)) continue;
    if (!(await isValidEntry(type, entry))) continue;

    const { dir, name } = path.parse(path.join(...rest));
    lists.push({
      id: path.join(dir, name),
      meta: await getMeta(full, type),
      type,
    });
  }

  return lists;
});
