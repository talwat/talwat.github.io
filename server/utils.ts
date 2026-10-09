import { resolve } from "path";
import { promises as fs } from "fs";

export async function contents(path: string, recursive: boolean) {
  const basePath = resolve(process.cwd(), path);
  const directory = await fs.readdir(basePath, {
    recursive,
    withFileTypes: true,
  });

  return directory.filter((value) => value.name != ".DS_Store");
}