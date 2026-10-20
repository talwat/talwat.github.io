#import "@preview/mannot:0.4.0": markrect, annot, mark

#set text(
  size: 16pt
)

#outline()

= Derivations

== Initial Differential Equation

#show math.equation: set block(breakable: true)

#let key = markrect.with(outset: 0.2em)
#let mline = line(length: 10em)
#let dv = $dif v$
#let ds = $dif s$
#let dt = $dif t$
#let du = $dif u$
#let tv = $v_T$

$
F = m g - k v^2 \
m a = m g - k v ^2 \
m dv/dt = m g - k v^2 \
key(dv/dt = g - (k v^2)/m)
$

== Terminal Velocity

$
"Let" tv "be the terminal velocity" \
0 = g - (k tv^2)/m \
tv^2 = (m g)/k \
tv = sqrt((m g)/k) \
$

== Solution for Velocity

$
#let gtC = $g t + C$

k/m = g/tv^2 \
dv/dt = g - g v^2/tv^2 \
dv/dt = g(1 - v^2/tv^2) \
dv / (1 - v^2/v^2_t) = g dif t \
integral (dv) / (1 - v^2/v^2_t) = integral g dif t \
$

=== Initial integration

$
integral (tv^2 dif v) / (tv^2 - v^2) = gtC \
tv^2 integral dv / (tv^2 - v^2) = gtC \
tv^2 integral dv / ((tv+v)(tv - v)) = gtC \

// "Partial Fractions" \
// 1 / (tv^2 - v^2) = A/(tv+v) + B/(tv-v) \
// 1 = A(tv-v) + B(tv+v) \

// v = tv: 1 = 2 B tv \ B=1/(2tv^2) \
// v = -tv: 1 = 2 A tv \ A=1/(2tv^2) \
mline \
"Partial Fractions" \
mline \
1 / (tv^2 - v^2) = 1/(2 tv) (1/(tv+v) + 1/(tv-v)) \
tv^cancel(2)/(2cancel(tv))(
  integral dv / (tv + v) + integral dv / (tv - v)
)
= gtC \
tv/2(integral dv / (tv + v) + integral dv / (tv - v)) = gtC \
tv/2(ln|tv + v| - ln|tv - v|) = gtC \
tv/2ln abs((tv + v)/(tv - v)) = gtC \
$

=== Isolating to find $v(t)$
$
"Initial Condition" \
"Released from Rest, so" v(0) = 0 \
C = tv/2 ln |1| = 0 \
//"Object begins at rest", \
0<=v<=tv therefore "absolute value signs may be omitted." \

mline \
tv/2ln ((tv + v)/(tv - v)) = g t \
ln ((tv + v)/(tv - v)) = (2 g t)/tv \
ln ((tv + v)/(tv - v)) = (2 g t)/tv \

#let egt = $e^(2 g t slash tv)$

(tv + v)/(tv - v) = egt \
tv + v = tv egt - v egt \
v + v egt = tv egt - tv \
v(egt + 1) = tv (egt - 1) \
key(v(t) = tv (egt - 1)/(egt + 1)) \
$

== Solution for Displacement

=== Initial integration

$
#let tgv = $(2g)/tv$
#let fegt = $4 g t slash tv$
#let prelude = $tv t - tv^2/g$

ds/dt = tv (egt - 1)/(egt + 1) \
s = tv integral (egt - 1)/(egt + 1) dt \
s = tv integral (egt + 1 - 2)/(egt + 1) dt \
s = tv (integral 1 dt - integral 2/(egt + 1) dt) \
s = tv t -tv integral 2/(egt + 1) dt \
mline \
u "substitution" \
mline \
"Let" u = egt \
du = tgv egt dt \
du = tgv u dt \
tv/(g u) du = 2 dt \
s = tv t - tv integral tv/(g u) dot 1/(u(u + 1)) du) \
s = prelude integral 1/(u(u + 1)) du) \
$

$
mline \
"Partial Fractions" \
mline \
1/ (u(u+1)) = 1/(u) - 1/(u+1) \
s = prelude (integral 1/u du - integral 1/(u+1)) \
s = prelude (ln|u| - ln|u+1| + C)\
$

#pagebreak()

=== Isolating to find $s(t)$

$
mline \
"Initial Condition" \
mline \
s(0) = 0 \
u = e^0=1 \
0 = cancel(-tv^2/g) (cancel(ln|1|)-ln|2|+C) \
C = ln 2 \
s = prelude (ln|u| - ln|u+1| + ln 2)\
mline \
"Substitute for" u = egt \ t >= 0 therefore u >= 1 therefore "absolute value signs may be omitted" \
mline \
#let legt = $ln (egt+1)$
#let legtw = $ln ((egt+1)/2)$

s = prelude ((2 g t)/tv - legt + ln 2)\
s = tv t
  -tv^cancel(2)/cancel(g)
  dot
  2 t cancel(g / tv)
+tv^2/g (legt - ln 2)) \
s = (tv t -2tv t) + tv^2/g legtw\
key(s(t) = tv^2/g legtw - tv t)\
$

#pagebreak()
== Results

$
a(t) &= g - g v^2/tv^2 \
v(t) &= tv (egt - 1)/(egt + 1) \
s(t) &= tv^2/g legtw - tv t \
$