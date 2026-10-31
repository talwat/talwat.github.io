import { list } from "~~/server/media/photography";

export default defineEventHandler(async () => {
  return await list();
});
