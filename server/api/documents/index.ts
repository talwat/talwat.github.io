import { contents, exists } from "~~/server/utils/documents";
import path from "path";
import yaml from "yaml";
import { Dirent } from "fs";
import { promises as fs } from "fs";
import { DocumentType, Item, Metadata } from "~~/shared/types";
import { parseMarkdown } from "comark";

// Input is a file for markdown and a directory for typst.
async function getMeta(input: string, type: DocumentType): Promise<Metadata> {
  if (type == "markdown") {
    const document = await parseMarkdown((await fs.readFile(input)).toString());
    return document.frontmatter;
  }

  try {
    const data = await fs.readFile(path.resolve(input, "meta.yaml"), "utf-8");
    return yaml.parse(data) as Metadata;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    return {};
  }
}

const documentsDir = path.resolve(process.cwd(), "media/documents");

const isDocumentType = (value?: string): value is DocumentType =>
  value === "markdown" || value === "typst";

const isValidEntry = async (type: DocumentType, entry: Dirent<string>) =>
  type === "typst"
    ? entry.isDirectory() &&
      (await exists(path.join(entry.parentPath, entry.name, "main.typ"), false))
    : entry.isFile() && path.extname(entry.name) === ".md";

export default defineEventHandler(async () => {
  const lists: Item[] = [];

  const entries = await contents("media/documents", true);
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
