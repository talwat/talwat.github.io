---
title: Math & Programming Test
serif: false
---

## Math

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut malesuada leo dignissim nunc porta posuere. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempus elit tellus, tempus tincidunt leo finibus vitae. Nam non arcu quam. Donec ut convallis lacus. Suspendisse potenti. Donec mollis ut tortor ac tristique. Aenean blandit ultrices elit sit amet ultricies. Maecenas hendrerit ultrices mauris quis tempor. Integer faucibus ornare metus sit amet varius. Ut aliquet neque eget massa elementum tempor. Cras velit felis, faucibus ac arcu non, feugiat vehicula velit.[^1]

$$
  cal(L){f(t)} = integral_0^infinity e^(-s t) f(t) dif t
  = sum_(n=0)^infinity frac((-1)^n, n!) frac(d^n f, d s^n)
$$

In ante massa, egestas eget libero nec, facilisis semper leo. Maecenas mollis ac justo vel condimentum. Etiam auctor metus at nunc semper, ut rutrum massa sagittis. Etiam fermentum ut velit in ultrices. Phasellus placerat placerat luctus. Sed vel ultricies risus, at lobortis mauris. Aenean a lobortis nisi. Curabitur pretium erat vel lorem sagittis sollicitudin. Sed sollicitudin egestas tortor nec ultricies.

Nulla placerat egestas lacinia. Maecenas ac metus porta, sodales mi sed, efficitur magna. Donec congue lectus semper, viverra lectus sit amet, tristique risus. Fusce quis fringilla nulla, vitae tempor ligula. Duis et enim id odio molestie varius a ut purus. Fusce blandit, magna quis scelerisque vehicula, odio eros rhoncus enim, eget faucibus massa sapien ac odio. Proin faucibus in ligula ut rutrum.

$$
  nabla times (frac(1, mu_0) nabla times bold(A))
  + epsilon_0 frac(partial^2 bold(A), partial t^2)
  = bold(J) + epsilon_0 nabla (nabla dot bold(A))
$$

Curabitur at arcu nulla. Integer turpis metus, consequat ac fringilla in, viverra non magna. Suspendisse potenti. Curabitur id accumsan mauris. Donec tincidunt mauris diam, in accumsan eros sollicitudin facilisis. Donec vulputate, dolor quis interdum aliquam, enim arcu rhoncus velit, ac egestas ipsum mauris auctor dui. Vivamus purus quam, lacinia vel massa at, dapibus placerat nisi. Aliquam condimentum elit eget eros pretium, ut convallis quam tincidunt. Curabitur condimentum rutrum nulla vitae vestibulum. Sed magna urna, mollis ac felis a, congue scelerisque metus. Pellentesque consequat laoreet neque, eget molestie mauris posuere sit amet. Pellentesque sit amet felis vitae dui tincidunt iaculis. Pellentesque tempus, ex sed faucibus consectetur, nibh felis placerat turpis, et consequat enim lacus in tortor.

$$
  lim_(N -> infinity) sum_(k=1)^N frac((-1)^(k+1), k^s)
  product_(j=1)^k frac(Gamma(j+alpha), Gamma(j+beta))
  = frac(1, Gamma(s)) integral_0^infinity
  frac(x^(s-1) e^(-x), 1-e^(-x))
  log(frac(Gamma(x+alpha), Gamma(x+beta))) dif x
$$

Donec blandit ligula et lacus accumsan rutrum. Donec est eros, congue sit amet lacus eu, elementum varius nulla. Phasellus augue ex, placerat ac nulla a, condimentum pellentesque ligula. Donec lacus erat, rhoncus vel enim at, venenatis dictum lacus. Nam et ante enim. Nulla laoreet nibh sed efficitur vehicula. Integer sed eros varius, tempus magna eget, egestas enim. Sed blandit lorem nunc, vitae hendrerit libero dignissim eget. Sed at luctus quam, nec ornare sem. Nam nibh mauris, facilisis eget tellus at, luctus egestas enim. Mauris a ligula nec lorem ullamcorper ornare in at purus. Pellentesque lobortis, mauris eu euismod faucibus, diam erat rhoncus turpis, non ultricies mi nisl quis enim.

> Quote

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

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
