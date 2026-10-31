import { createReadStream } from "node:fs";
import { join } from "node:path";

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing file path." });
  }

  const path = join(process.cwd(), "media/photography", slug);
  try {
    return sendStream(event, createReadStream(path));
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Photo not found." });
  }
});
