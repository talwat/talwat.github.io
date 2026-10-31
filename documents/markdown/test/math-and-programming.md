---
title: Math & Programming Test
---

## Math

$$
  cal(L){f(t)} = integral_0^infinity e^(-s t) f(t) dif t
  = sum_(n=0)^infinity frac((-1)^n, n!) frac(d^n f, d s^n)
  \
  nabla times (frac(1, mu_0) nabla times bold(A))
  + epsilon_0 frac(partial^2 bold(A), partial t^2)
  = bold(J) + epsilon_0 nabla (nabla dot bold(A))
  \
  lim_(N -> infinity) sum_(k=1)^N frac((-1)^(k+1), k^s)
  product_(j=1)^k frac(Gamma(j+alpha), Gamma(j+beta))
  = frac(1, Gamma(s)) integral_0^infinity
  frac(x^(s-1) e^(-x), 1-e^(-x))
  log(frac(Gamma(x+alpha), Gamma(x+beta))) dif x
$$

## Programming

```ts
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
```
