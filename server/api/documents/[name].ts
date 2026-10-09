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

const documentsDir = resolve(process.cwd(), "documents/typst");

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, "name");
  if (!name) throw createError({ status: 400 });

  const workdir = resolve(documentsDir, name);
  const input = resolve(workdir, "main.typ");

  const outdir = resolve(workdir, "output");
  await fs.mkdir(outdir, { recursive: true });

  const output = resolve(workdir, "output", "{n}.svg");
  await compile(input, output);

  const files = await contents(outdir, false);
  const promises = files.map(
    async (x) => await fs.readFile(resolve(outdir, x.name), "utf8"),
  );
  
  return Promise.all(promises);
});
