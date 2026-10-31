import { list } from "~~/server/media/photography";

export default defineEventHandler(async (event) => {
  return await list();
});
