import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";

let compiler: NodeCompiler = NodeCompiler.create();

export function render(
  block: boolean,
  content: string,
  mode: "svg" | "mathml",
) {
  const math = block ? `$ ${content} $` : `$${content}$`;
  const doc =
    `#set page(width: auto, height: auto, margin: 0pt)\n` +
    `#set text(size: 18pt)\n${math}`;

  const output =
    mode == "svg"
      ? compiler.svg({ mainFileContent: doc })
      : (compiler.tryHtml({ mainFileContent: doc }).result?.body() ?? "");

  const tag = mode == "svg" ? "svg" : "math";
  return (
    output.match(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`))?.[0] ?? ""
  );
}
