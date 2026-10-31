import path from "path";
import yaml from "yaml";
import fs from "fs/promises";
import { contents } from "./utils";

const ORDER = [
  "barcelona",
  "tel-aviv",
  "mitzpe-ramon",
  "puig-de-dorria",
  "andorra",
  "freiburg",
  "cadi",
  "vallter-2000",
  "port-del-comte",
  "sant-llorenc",
];

interface Collection {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  files: string[];
}

export async function get(id: string): Promise<Collection> {
  const dir = path.resolve("public/images/photography", id);
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const buf = await fs.readFile(path.resolve(dir, "meta.yaml"));
  const meta = yaml.parse(buf.toString());

  return {
    id,
    ...meta,
    files: entries
      .filter((entry) => entry.isFile() && path.extname(entry.name) !== ".yaml")
      .map((entry) => entry.name),
  };
}

export async function list(): Promise<Collection[]> {
  const entries = await contents("public/images/photography", true);
  const ids = new Set(
    entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.basename(entry.parentPath)),
  );

  const collections = await Promise.all(Array.from(ids, (id) => get(id)));

  return collections.sort((a, b) => {
    const ai = ORDER.indexOf(a.id);
    const bi = ORDER.indexOf(b.id);

    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
