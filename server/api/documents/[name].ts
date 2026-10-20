import { execFile, spawn } from "child_process";
import { promises as fs } from "fs";
import { basename, dirname, resolve } from "path";
import { contents } from "~~/server/utils";
import { tmpdir } from "os";
import { promisify } from "util";

const sourceDir = resolve(process.cwd(), "documents/typst");
const publicDir = resolve(process.cwd(), "public/generated/documents/");

const execFileAsync = promisify(execFile);
async function compile(input: string, output: string, transparent: boolean) {
  if (!transparent) {
    await execFileAsync("/opt/homebrew/bin/typst", ["compile", input, output]);
    return;
  }

  const preamble = await fs.readFile(
    resolve(sourceDir, "transparent.typ"),
    "utf-8",
  );
  const source = await fs.readFile(input, "utf-8");

  const temporary = resolve(dirname(input), `.tmp-${basename(input)}`);
  try {
    await fs.writeFile(temporary, `${preamble}\n${source}`);
    await execFileAsync("/opt/homebrew/bin/typst", [
      "compile",
      temporary,
      output,
    ]);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name");
  const { format, transparent } = getQuery<{
    format: string;
    transparent: boolean;
  }>(event);

  if (!name || !format) throw createError({ status: 400 });

  const workdir = resolve(sourceDir, name);
  const input = resolve(workdir, "main.typ");
  try {
    await fs.access(input);
  } catch {
    throw createError({ status: 404 });
  }

  const folder = `${name}/${transparent ? "transparent" : "paged"}`;
  const outdir = resolve(publicDir, folder);
  await fs.mkdir(outdir, { recursive: true });

  let output = resolve(outdir, `${name}.${format}`);
  if (format == "svg") output = resolve(outdir, `{n}.svg`);

  await compile(input, output, transparent);
  const pages = (await contents(outdir, false))
    .map((x) => `/generated/documents/${folder}/${x.name}`)
    .filter((x) => x.endsWith(`.${format}`));

  return {
    pages,
  };
});
