import { execFile } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import { resolve } from "path";
import { contents } from "~~/server/utils";

async function compile(input: string, output: string) {
  await promisify(execFile)("/opt/homebrew/bin/typst", [
    "compile",
    input,
    output
  ]);
}

const sourceDir = resolve(process.cwd(), "documents/typst");
const publicDir = resolve(process.cwd(), "public/generated/documents/");

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name");
  if (!name) throw createError({ status: 400 });

  const workdir = resolve(sourceDir, name);
  const input = resolve(workdir, "main.typ");

  const outdir = resolve(publicDir, name);
  await fs.mkdir(outdir, { recursive: true });

  const output = resolve(outdir, `{n}.svg`);
  await compile(input, output);

  const pages = (await contents(outdir, false)).map(x => `/generated/documents/${name}/${x.name}`);
  return {
    pages
  };
});
