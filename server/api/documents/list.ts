import { contents } from "~~/server/utils";

export default defineEventHandler(async () => {
  const entries = await contents("documents/typst", false);

  return entries;
});