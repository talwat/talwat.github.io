---
title: The Grand Markdown Feature Test
serif: false
---

A single document that pokes at every corner of your renderer: typography, structure, tables, code, math, alerts, and a few sneaky edge cases. If something looks off, you've found a bug worth fixing.[^intro]

---

## Typography

Plain text, **bold**, _italic_, _**bold and italic**_, ~~strikethrough~~, `inline code`, and a [regular link](https://example.com "A link with a title"). Autolinks work too: <https://example.com>. You can also use <mark>highlighted text</mark>, H<sub>2</sub>O, E = mc<sup>2</sup>, and keyboard keys like <kbd>Ctrl</kbd> + <kbd>K</kbd>.

Escaped characters: \*not italic\*, \`not code\`, \# not a heading, 1\. not a list.

A hard line break follows this line.  
And this line comes right after it.

Emoji shortcodes and literals: 🚀 ✨ 🎉 :tada:

Typographic niceties: "curly quotes", 'single quotes', an em dash --- like this, an en dash for ranges (2020--2026), and an ellipsis...

### Heading level three

#### Heading level four

##### Heading level five

###### Heading level six

Setext Heading One
==================

Setext Heading Two
------------------

---

## Lists

### Unordered

- First item
- Second item
  - Nested item
    - Deeply nested item
  - Another nested item
- Third item

### Ordered

1. Gather ingredients
2. Mix thoroughly
   1. Dry first
   2. Wet second
3. Bake until golden

### Task list

- [x] Write the test document
- [x] Include every feature
- [ ] Ship the blog
- [ ] Take a long nap

### Mixed and loose

1. A numbered item with a paragraph.

   A second paragraph inside the same item.

   ```bash
   echo "code inside a list item"
   ```

2. A numbered item with a bullet list:
   - one
   - two

### Definition-style list

Term One
: The first definition, if your renderer supports it.

Term Two
: The second definition.

---

## Blockquotes

> A simple quote.

> A longer quote with **formatting**, `code`, and a [link](https://example.com).
>
> It even spans multiple paragraphs.
>
> > And contains a nested quote.
> >
> > > And one more level down.

> "The best way to find out if your renderer works is to throw everything at it."
>
> --- Somebody, probably

---

## Alerts

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

> [!NOTE]
> Alerts can hold richer content too, like a list:
>
> - Item **one**
> - Item `two`
>
> ```ts
> const nested = "code inside an alert";
> ```

---

## Tables

| Feature        | Supported | Notes                                              |
| -------------- | :-------: | -------------------------------------------------- |
| Tables         |    Yes    | You are looking at one                             |
| Alignment      |    Yes    | Left, centre, and right                            |
| Inline `code`  |    Yes    | Works inside cells                                 |
| **Formatting** |    Yes    | _Italic_, ~~strike~~, [links](https://example.com) |

Alignment test:

| Left aligned       | Centre aligned | Right aligned |
| :----------------- | :------------: | ------------: |
| apple              |     banana     |        cherry |
| 1                  |       22       |           333 |
| a longer cell here |      mid       |             x |

Wide table, to test horizontal overflow on small screens:

| Column A          | Column B             | Column C            | Column D          | Column E             | Column F        | Column G       | Column H        |
| ----------------- | -------------------- | ------------------- | ----------------- | -------------------- | --------------- | -------------- | --------------- |
| Lorem ipsum dolor | Sit amet consectetur | Adipiscing elit sed | Do eiusmod tempor | Incididunt ut labore | Et dolore magna | Aliqua ut enim | Ad minim veniam |

---

## Math

Math is written in Typst syntax. Inline math sits in the flow of a sentence, like $x^2 + y^2 = r^2$ or $sum_(k=1)^n k = (n(n+1))/2$, and should align neatly with the surrounding text.

Euler's identity, the famous one:

$$
  e^(i pi) + 1 = 0
$$

The quadratic formula:

$$
  x = (-b plus.minus sqrt(b^2 - 4 a c)) / (2 a)
$$

The Gaussian integral:

$$
  integral_(-infinity)^infinity e^(-x^2) dif x = sqrt(pi)
$$

The Basel problem:

$$
  sum_(n=1)^infinity 1 / n^2 = pi^2 / 6
$$

A matrix and a determinant:

$$
  A = mat(
    a, b, c;
    d, e, f;
    g, h, i;
  ),
  quad
  det(A) = a(e i - f h) - b(d i - f g) + c(d h - e g)
$$

A piecewise function:

$$
  f(x) = cases(
    x^2 &"if" x >= 0,
    -x &"if" x < 0,
  )
$$

The Laplace transform, with a series expansion:

$$
  cal(L){f(t)} = integral_0^infinity e^(-s t) f(t) dif t
  = sum_(n=0)^infinity frac((-1)^n, n!) frac(d^n f, d s^n)
$$

Maxwell, in potential form:

$$
  nabla times (frac(1, mu_0) nabla times bold(A))
  + epsilon_0 frac(partial^2 bold(A), partial t^2)
  = bold(J) + epsilon_0 nabla (nabla dot bold(A))
$$

A beastly limit, to stress the layout engine:

$$
  lim_(N -> infinity) sum_(k=1)^N frac((-1)^(k+1), k^s)
  product_(j=1)^k frac(Gamma(j+alpha), Gamma(j+beta))
  = frac(1, Gamma(s)) integral_0^infinity
  frac(x^(s-1) e^(-x), 1-e^(-x))
  log(frac(Gamma(x+alpha), Gamma(x+beta))) dif x
$$

And some inline odds and ends: $alpha + beta = gamma$, $vec(1, 2, 3)$, $bold(v) dot bold(w)$, $integral f dif x$, and $"text in math"$.

---

## Programming

### TypeScript

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

### Python

```python
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class Point:
    x: float
    y: float

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)


print([fib(i) for i in range(10)])  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Rust

```rust
use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<&str, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let counts = word_count("the quick brown fox jumps over the lazy dog the end");
    println!("{:?}", counts.get("the")); // Some(3)
}
```

### Shell

```bash
#!/usr/bin/env bash
set -euo pipefail

for file in ./posts/*.md; do
  echo "Building ${file}..."
  typst compile "$file" || echo "failed: $file" >&2
done
```

### JSON, YAML, and TOML

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "features": ["math", "alerts", "footnotes"],
  "nested": { "enabled": true, "count": 42, "ratio": 0.75, "nothing": null }
}
```

```yaml
site:
  title: My Blog
  serif: false
  tags:
    - markdown
    - typst
```

```toml
[site]
title = "My Blog"
serif = false
tags = ["markdown", "typst"]
```

### Diff

```diff
- const old = "before";
+ const updated = "after";
  const unchanged = true;
```

### Typst

```typst
#set text(font: "Inter", size: 11pt)

= A Typst heading

Some *strong* text and an equation: $ integral_0^1 x^2 dif x = 1/3 $
```

### HTML and CSS

```html
<article class="post">
  <h1>Hello, world</h1>
  <p>Nothing fancy here.</p>
</article>
```

```css
.post {
  max-width: 65ch;
  margin-inline: auto;
  font-family: system-ui, sans-serif;
}
```

### Plain block, no language

```
No syntax highlighting here.
    Whitespace   is   preserved.
```

### Long line, to test horizontal scrolling

```text
This is a very long line of code that should scroll horizontally rather than wrap or break the layout of the page, because that is what code blocks are supposed to do when they get wide.
```

---

## Media

An image with alt text:

![A placeholder landscape](https://picsum.photos/seed/markdown/800/400 "Hover title text")

A linked image:

[![Click me](https://picsum.photos/seed/linked/400/200)](https://example.com)

---

## Raw HTML

<details>
<summary>Click to expand this collapsible section</summary>

Hidden content, which can still contain **Markdown**, `code`, and lists:

- One
- Two
- Three

</details>

<div style="padding: 1rem; border-radius: 8px; border: 1px solid currentColor;">
A raw HTML block with inline styles, in case your renderer allows it.
</div>

<!-- This is an HTML comment and should be invisible. -->

---

## Footnotes and References

Footnotes appear at the bottom of the page, like this one.[^second] You can reference the same note twice.[^second] Long notes can hold more structure.[^long]

Reference-style links keep prose tidy: here is [one][ref-one] and here is [another][ref-two].

Heading links work too: jump back to [the math section](#math) or [the code section](#programming).

[ref-one]: https://example.com "Example one"
[ref-two]: https://example.org "Example two"

---

## The Finale

If you made it this far, everything rendered. Here's one last combo of everything at once:

> [!TIP]
> Mix **bold**, _italic_, `code`, ~~strike~~, a [link](https://example.com), and math like $e^(i pi) = -1$ in one place, and make sure it all still looks good.

[^intro]: This is the first footnote, referenced from the opening paragraph.

[^second]: A short footnote, with _formatting_ and `code`.

[^long]: A longer footnote.

    It has a second paragraph, indented by four spaces.

    ```ts
    const footnoteCode = "even code blocks";
    ```
