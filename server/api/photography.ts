import { promises as fs } from "fs";
import { join } from "path";

const ORDER = [
  "barcelona",
  "andorra",
  "cadi",
  "vallter-2000",
  "port-del-comte",
  "sant-llorenc",
];

interface Collection {
  name: string;
  id: string;
  files: string[];
}

export function toAscii(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^\x00-\x7F]/g, "")
    .replaceAll(" ", "-");
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
      collections.set(parent, { name: parent, id: toAscii(parent), files: [] });
    }

    const collection = collections.get(parent)!;
    collection.files.push(file.name);
  }

  const sorted = Array.from(collections.values()).sort((a, b) => {
    const ai = ORDER.indexOf(a.id);
    const bi = ORDER.indexOf(b.id);

    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  
  return sorted;
});
