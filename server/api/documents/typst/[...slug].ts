import { execFile } from "child_process";
import { promises as fs } from "fs";
import { basename, dirname, resolve } from "path";
import { exists, contents } from "~~/server/utils";
import { promisify } from "util";

const sourceDir = resolve(process.cwd(), "documents/typst/");
const publicDir = resolve(process.cwd(), "public/generated/documents/");
const typst = "/opt/homebrew/bin/typst";

async function compile(input: string, output: string, transparent: boolean) {
  let preamble = "";
  if (transparent)
    preamble = await fs.readFile(
      resolve(sourceDir, "transparent.typ"),
      "utf-8",
    );

  const source = await fs.readFile(input, "utf-8");
  const temporary = resolve(dirname(input), `.tmp-${basename(input)}`);

  try {
    await fs.writeFile(temporary, `${preamble}\n${source}`);
    await promisify(execFile)(typst, ["compile", temporary, output]);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "slug");
  const { format, transparent } = getQuery<{
    format: string;
    transparent: boolean;
  }>(event);

  if (!id)
    throw createError({ status: 400, message: "Missing name URL parameter." });
  if (!format)
    throw createError({
      status: 400,
      message: "Missing format query parameter.",
    });

  const workDir = resolve(sourceDir, id);
  const input = resolve(workDir, "main.typ");
  await exists(input, true);

  const folder = `typst/${id}/${transparent ? "transparent" : "paged"}`;
  const outdir = resolve(publicDir, folder);
  await fs.mkdir(outdir, { recursive: true });

  let output = resolve(outdir, `${id}.${format}`);
  if (format == "svg" || format == "png")
    output = resolve(outdir, `{n}.${format}`);

  await compile(input, output, transparent);
  const pages = (await contents(outdir, false))
    .map((x) => `/generated/documents/${folder}/${x.name}`)
    .filter((x) => x.endsWith(`.${format}`));

  return {
    pages,
  };
});
