import { execFile } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { exists, contents } from "~~/server/utils";
import { promisify } from "util";

const sourceDir = path.resolve(process.cwd(), "documents/typst/");
const publicDir = path.resolve(process.cwd(), "public/generated/documents/");
const typst = process.env.TYPST_PATH ?? "typst";

async function compile(input: string, output: string, transparent: boolean) {
  let preamble = "";
  if (transparent)
    preamble = await fs.readFile(
      path.resolve(sourceDir, "transparent.typ"),
      "utf-8",
    );

  const source = await fs.readFile(input, "utf-8");
  const temporary = path.resolve(
    path.dirname(input),
    `.tmp-${path.basename(input)}`,
  );

  try {
    await fs.writeFile(temporary, `${preamble}\n${source}`);
    await promisify(execFile)(typst, ["compile", temporary, output]);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  const { format, transparent } = getQuery<{
    format: string;
    transparent: boolean;
  }>(event);

  if (!slug)
    throw createError({ status: 400, message: "Missing name URL parameter." });

  const id = slug.replace(/\/+$/, "");
  if (!format)
    throw createError({
      status: 400,
      message: "Missing format query parameter.",
    });

  const workDir = path.resolve(sourceDir, id);
  const input = path.resolve(workDir, "main.typ");
  await exists(input, true);

  const folder = `typst/${id}/${transparent ? "transparent" : "paged"}`;
  const outdir = path.resolve(publicDir, folder);
  await fs.mkdir(outdir, { recursive: true });

  let output = path.resolve(outdir, `${id}.${format}`);
  if (format == "svg" || format == "png")
    output = path.resolve(outdir, `{n}.${format}`);

  await compile(input, output, transparent);
  const pages = (await contents(outdir, false))
    .map((x) => `/generated/documents/${folder}/${x.name}`)
    .filter((x) => x.endsWith(`.${format}`));

  return {
    pages,
  };
});
