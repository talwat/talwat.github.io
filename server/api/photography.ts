import { promises as fs } from "fs";
import { join } from "path";

interface Collection {
  name: string,
  files: string[],
}

export default defineEventHandler(async () => {
  const basePath = join(process.cwd(), "public/images/photography");
  const directory = await fs.readdir(basePath, {
    recursive: true,
    withFileTypes: true,
  });

  const grouped = new Map<string, Collection>();
  for (const file of directory) {
    if (!file.isFile()) continue;
    if (file.name == ".DS_Store") continue;
    const parent = file.parentPath.split("/").at(-1)!;

    if (!grouped.has(parent))
      grouped.set(parent, { name: parent, files: [] });

    grouped.get(parent)!.files.push(file.name);
  }

  return Array.from(grouped.values());
});
