import { contents, exists } from "./utils";
import path from "path";
import yaml from "yaml";
import { Dirent } from "fs";
import { promises as fs } from "fs";
import { DocumentType, DocumentEntry, DocumentMeta } from "~~/shared/types";
import { parseMarkdown } from "comark";

const documentsDir = path.resolve(process.cwd(), "documents");
const DOCUMENT_TYPES: DocumentType[] = ["markdown", "typst"];

const isDocumentType = (value?: string): value is DocumentType =>
  value === "markdown" || value === "typst";

const entryPath = (type: DocumentType, id: string) =>
  path.resolve(documentsDir, type, type === "markdown" ? `${id}.md` : id);

const entryExists = async (type: DocumentType, id: string) =>
  type === "typst"
    ? await exists(path.join(entryPath(type, id), "main.typ"), false)
    : await exists(entryPath(type, id), false);

async function resolveType(id: string): Promise<DocumentType> {
  for (const type of DOCUMENT_TYPES) {
    if (await entryExists(type, id)) return type;
  }

  throw new Error(`Document not found: ${id}`);
}

// Input is a file for markdown and a directory for typst.
async function getMeta(
  input: string,
  type?: DocumentType,
): Promise<DocumentMeta> {
  if (type === "markdown") {
    const document = await parseMarkdown((await fs.readFile(input)).toString());
    return document.frontmatter;
  }

  try {
    const data = await fs.readFile(path.resolve(input, "meta.yaml"), "utf-8");
    return yaml.parse(data) as DocumentMeta;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    return {};
  }
}

export async function get(
  id: string,
  type?: DocumentType,
): Promise<DocumentEntry> {
  const resolved = type ?? (await resolveType(id));

  if (type && !(await entryExists(type, id))) {
    throw new Error(`Document not found: ${type}/${id}`);
  }

  return {
    id,
    type: resolved,
    meta: await getMeta(entryPath(resolved, id), resolved),
  };
}

export async function list(): Promise<DocumentEntry[]> {
  const entries = await contents("documents", true);

  const refs = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(entry.parentPath, entry.name);
      const [type, ...rest] = path.relative(documentsDir, full).split(path.sep);
      const { dir, name } = path.parse(path.join(...rest));
      const id = path.join(dir, name);

      if (!rest.length || !isDocumentType(type)) return null;
      if (!(await entryExists(type, id))) return null;

      return { type, id };
    }),
  );

  return Promise.all(
    refs.filter((ref) => ref !== null).map(({ type, id }) => get(id, type)),
  );
}
