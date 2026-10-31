import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";

let compiler: NodeCompiler | undefined;

export function render(
  content: string,
  block: boolean,
  mode: "svg" | "html",
): string {
  const math = block ? `$ ${content} $` : `$${content}$`;
  const doc =
    `#set page(width: auto, height: auto, margin: 0pt)\n` +
    `#set text(size: 18pt)\n${math}`;

  compiler ??= NodeCompiler.create();

  const output =
    mode == "svg"
      ? compiler.svg({ mainFileContent: doc })
      : (compiler.tryHtml({ mainFileContent: doc }).result?.body() ?? "");

  const tag = mode == "svg" ? "svg" : "math";
  return (
    output.match(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`))?.[0] ?? ""
  );
}
