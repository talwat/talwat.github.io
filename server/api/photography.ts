import { promises as fs } from "fs";
import { join } from "path";

interface Collection {
  name: string,
  id: string,
  createdAt: Date,
  files: string[],
}

export function toAscii(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(" ", "-");
}

export default defineEventHandler(async () => {
  const basePath = join(process.cwd(), "public/images/photography");
  const directory = await fs.readdir(basePath, {
    recursive: true,
    withFileTypes: true,
  });

  const collections = new Map<string, Collection>();
  for (const file of directory) {
    if (!file.isFile()) continue;
    if (file.name == ".DS_Store") continue;
    const parent = file.parentPath.split("/").at(-1)!;

    if (!collections.has(parent)) {
      const stats = await fs.stat(file.parentPath);
      collections.set(parent, { name: parent, id: toAscii(parent), createdAt: stats.birthtime, files: [] });
    }

    const collection = collections.get(parent)!;
    collection.files.push(file.name);
  }

  const sorted = Array.from(collections.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return sorted;
});
