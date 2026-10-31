import path from "path";
import { promises as fs } from "fs";
import { H3Event } from "#imports";

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

export function getID(event: H3Event<globalThis.EventHandlerRequest>) {
  const slug = getRouterParam(event, "slug");
  if (!slug) throw createError({ status: 400 });

  const parsed = path.parse(slug);
  return { id: path.join(parsed.dir, parsed.name), ext: parsed.ext };
}

export async function contents(scan: string, recursive: boolean) {
  const basePath = path.resolve(process.cwd(), scan);
  const directory = await fs.readdir(basePath, {
    recursive,
    withFileTypes: true,
  });

  return directory.filter((value) => value.name != ".DS_Store");
}
