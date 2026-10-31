import { promises as fs } from "fs";
import path from "path";

import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { getID } from "~~/server/utils/documents";

const sourceDir = path.resolve(process.cwd(), "media/documents/typst/");

interface Document {
  mime: string;
  content: Buffer | string;
}

async function compile(workspace: string, embed: boolean): Promise<Document> {
  const compiler = NodeCompiler.create({
    workspace,
  });

  let preamble = await fs.readFile(
    path.resolve(sourceDir, embed ? "embed.typ" : "paged.typ"),
    "utf-8",
  );

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
  const { id, ext } = getID(event);

  const embed = ext == ".svg";
  const workDir = path.resolve(sourceDir, id);

  const { mime, content } = await compile(workDir, embed);
  setResponseHeader(event, "Content-Type", mime);

  return content;
});
