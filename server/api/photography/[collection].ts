import { get } from "~~/server/media/photography";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "collection");
  if (!slug) throw createError({ status: 400 });

  return await get(slug);
});
