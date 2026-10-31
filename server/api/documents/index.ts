import { list } from "~~/server/media/documents";

export default defineEventHandler(async () => {
  return await list();
});
