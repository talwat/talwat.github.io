import { render } from "~~/server/media/math";

export default defineEventHandler(async (event) => {
  const { content } = await readBody<{ content: string }>(event);
  const query = getQuery(event);

  const block = query.block === "true";
  const mode = query.mode === "svg" ? "svg" : "mathml";

  return render(block, content, mode);
});
