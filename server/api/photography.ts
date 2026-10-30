import { contents } from "../utils";
import fs from "fs/promises";
import yaml from "yaml";
import path from "path";

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

export default defineEventHandler(async () => {
  const entries = await contents("public/images/photography", true);
  const collections = new Map<string, Collection>();
  for (const entry of entries) {
    if (!entry.isFile() || path.extname(entry.name) == ".yaml") continue;

    const parent = path.basename(entry.parentPath);
    if (!collections.has(parent)) {
      const buf = await fs.readFile(
        path.resolve(entry.parentPath, "meta.yaml"),
      );
      const meta = yaml.parse(buf.toString());
      collections.set(parent, { id: parent, files: [], ...meta });
    }

    const collection = collections.get(parent)!;
    collection.files.push(entry.name);
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
