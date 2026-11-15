import { promises as fs } from "fs";
import path from "path";

import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { getID } from "~~/server/media/utils";

const sourceDir = path.resolve(process.cwd(), "documents/typst/");

interface Document {
  mime: string;
  content: Buffer | string;
}

async function compile(
  workspace: string,
  embed: boolean,
  extra?: string,
): Promise<Document> {
  const compiler = NodeCompiler.create({
    workspace,
  });

  let preamble = await fs.readFile(
    path.resolve(sourceDir, embed ? "embed.typ" : "paged.typ"),
    "utf-8",
  );

  const fg = {
    light: `rgb("#4c4f69")`,
    dark: `rgb("#cad3f5")`,
  };

  const color = extra?.includes("dark")
    ? fg.dark
    : extra?.includes("light")
      ? fg.light
      : "black";
  if (color) preamble = `\n#let fg = ${color}\n` + preamble;

  const source = await fs.readFile(
    path.resolve(workspace, "main.typ"),
    "utf-8",
  );

  const mime = embed ? "image/svg+xml" : "application/pdf";
  const input = `${preamble}\n${source}`;
  const params = {
    mainFileContent: input,
  };

  return {
    mime,
    content: embed ? compiler.svg(params) : compiler.pdf(params),
  };
}

export default defineEventHandler(async (event) => {
  const { id, ext, extra } = getID(event);

  const embed = ext == ".svg";
  const workDir = path.resolve(sourceDir, id);

  const { mime, content } = await compile(workDir, embed, extra);
  setResponseHeader(event, "Content-Type", mime);

  return content;
});
