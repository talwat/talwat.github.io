import { resolve } from "path";
import { promises as fs } from "fs";
import { parseMarkdown } from "comark";
import { DocumentType, Metadata } from "~~/shared/types";

export async function exists(path: string, except: boolean): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    if (except)
      throw createError({ status: 404, message: "Document not found." });
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
