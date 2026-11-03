import { get } from "~~/server/media/documents";
import { getID } from "~~/server/media/utils";

export default defineEventHandler(async (event) => {
  const { id } = getID(event);
  return await get(id);
});
