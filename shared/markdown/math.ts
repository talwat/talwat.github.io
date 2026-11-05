import { defineComarkPlugin } from "comark";

function blockRule(state: any, start: number, end: number, silent: boolean) {
  const from = state.bMarks[start] + state.tShift[start];
  if (state.src.slice(from, from + 2) !== "$$") return false;
  if (silent) return true;

  const lines: string[] = [];
  let line = start;
  let closed = false;

  for (; line < end; line++) {
    let text = state.src.slice(
      line === start ? from + 2 : state.bMarks[line] + state.tShift[line],
      state.eMarks[line],
    );
    if (text.trimEnd().endsWith("$$")) {
      text = text.trimEnd().slice(0, -2);
      closed = true;
    }
    lines.push(text);
    if (closed) break;
  }
  if (!closed) return false;

  const content = lines.join("\n").trim();
  state.line = line + 1;

  const token = state.push("typst-math", "typst-math", 0);
  token.content = content;
  token.map = [start, state.line];
  token.attrs = [
    ["class", "math block"],
    ["content", content],
  ];
  return true;
}

const SKIP = new Set(["pre", "code", "typst-math", "script", "style"]);
const INLINE = /(?<![\\$])\$(?![\s$])((?:\\.|[^$\\\n])+?)(?<![\s\\])\$(?!\d)/g;
function splitText(text: string): any[] | null {
  const out: any[] = [];
  let last = 0;

  for (const m of text.matchAll(INLINE)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push(["typst-math", { class: "math inline", content: m[1] }, m[1]]);
    last = m.index! + m[0].length;
  }

  if (!out.length) return null;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function walk(el: any[]) {
  if (SKIP.has(el[0])) return;

  const children: any[] = [];
  for (let i = 2; i < el.length; i++) {
    const child = el[i];
    if (typeof child === "string") {
      const parts = splitText(child);
      if (parts) children.push(...parts);
      else children.push(child);
    } else {
      if (Array.isArray(child)) walk(child);
      children.push(child);
    }
  }

  el.length = 2;
  el.push(...children);
}

export default defineComarkPlugin(() => ({
  name: "typst-math",

  markdownItPlugins: [
    (md: any) => {
      md.block.ruler.before("fence", "math_block", blockRule, {
        alt: ["paragraph", "reference", "blockquote", "list"],
      });
    },
  ],

  post(state: any) {
    for (const node of state.tree.nodes) {
      if (Array.isArray(node)) walk(node);
    }
  },
}));
