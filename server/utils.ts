import { resolve } from "path";
import { promises as fs } from "fs";
import { parseMarkdown } from "comark";
import { DocumentType, Metadata } from "~~/shared/types";


// Input is a file for markdown and a directory for typst.
export async function getMeta(input: string, type: DocumentType): Promise<Metadata> {
  if (type == "markdown") {
    const document = await parseMarkdown((await fs.readFile(input)).toString());
    return document.frontmatter;
  }

  try {
    const data = await fs.readFile(resolve(input, "meta.json"), "utf-8");
    return JSON.parse(data) as Metadata
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    return {};
  }
}

export async function exists(path: string, except: boolean): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    if (except) throw createError({ status: 404, message: "Document not found." });
    return false;
  }
}

export async function contents(path: string, recursive: boolean) {
  const basePath = resolve(process.cwd(), path);
  const directory = await fs.readdir(basePath, {
    recursive,
    withFileTypes: true,
  });

  return directory.filter((value) => value.name != ".DS_Store");
}
