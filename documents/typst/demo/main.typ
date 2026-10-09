= Answer to Inductive Proof

$ "Prove that" sin x + sin 3x + ... + sin(2n-1)x = (1-cos 2 n x)/(2sin x),
n in ZZ^+, x != k pi "where" k in ZZ $

== Given

$ (1-cos 2x)/(sin x) = sin x, x != k pi "where" k in ZZ $

== The Proof

$ P(n): sum^n_(i=1) sin((2i-1)x) = (1 - cos(2n x))/(2sin x) $

Prove $P(1)$, the base case
$ P(1): sin ((2 - 1)x) &= (1-cos 2x)/(2 sin x) \
sin x &= sin x && "Use given identity" \
"LHS" &= "RHS" $

$"Assume" P(n) "true for some" n = a, a in ZZ^+$

$ P(a): sum^a_(i=1) sin((2i-1)x) = (1 - cos(2a x))/(2sin x) $

#pagebreak()

$"Prove" P(n) "true for some" n = a+1 $

$ P(a+1): sum^(a+1)_(i=1) sin((2i-1)x) = (1 - cos(2(a+1)x))/(2sin x) $

$
& underline("LHS") \
&= sum^(a+1)_(i=1) sin((2i-1)x) \
&= sum^(a)_(i=1) sin((2i-1)x) + sin((2a+1)x) \
&= (1 - cos(2a x))/(2sin x) + sin(2a x + x) && "Substitute assumption" \
&= (1 - cos(2a x))/(2sin x) +
cos (2 a x) sin x + sin(2a x) cos x && "Use compound angle identity" \
&= (1 - cos(2a x))/(2sin x) +
(cos(2a x) (1-cos 2x))/(2 sin x)
+ sin(2a x) cos x " " && "Use given identity" \
&= (1-cos(2a x)[(cancel(1 - 1))(cos 2 x)])/(2sin x)
+ sin(2a x) cos x \
&= (1-cos(2a x)cos (2 x) - 2sin(x)cos(x)sin(2a x))/(2sin x) \
&= (1-[cos(2a x)cos (2 x) + sin(2x)sin(2a x))]/(2sin x)
&& "Double angle identity for" sin(2 theta) \
&= (1-cos(2a x +2x))/(2sin x) && "Compound angle identity for" cos(A + B) \
&= (1-cos(2 (a + 1)x))/(2sin x) \
& "LHS" = "RHS" therefore P(a+1) "is true" \
& "QED"
$