<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  height: { type: Number, default: 420 }, // cylinder height in px
  radius: { type: Number, default: 90 }, // cylinder radius in px
  thickness: { type: Number, default: 2 }, // line + cap-ring thickness in px
  scale: { type: Number, default: 1 }, // scales the whole thing
  tilt: { type: Number, default: 45 }, // resting in-plane rotation in degrees (0 = upright)
  interactive: { type: Boolean, default: true }, // tilt follows the mouse
  tiltRange: { type: Number, default: 25 }, // max degrees the mouse can add/subtract
  lines: { type: Number, default: 16 }, // vertical lines around the cylinder
  rings: { type: Number, default: 5 }, // rings, including the top and bottom
  duration: { type: Number, default: 14 }, // seconds per full revolution
  color: { type: String, default: "var(--accent)" }, // front lines + rings
  backColor: { type: String, default: "var(--fg-1)" }, // lines on the far side
  reverse: { type: Boolean, default: false },
});

const COS = Math.cos((35.264 * Math.PI) / 180);
const SIN = Math.sin((35.264 * Math.PI) / 180);

const boxSize = computed(() => {
  const w = (props.radius * 2 + props.thickness) * props.scale;
  const h =
    (props.height * COS + props.radius * 2 * SIN + props.thickness) *
    props.scale;
  const a = (props.tilt * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const sn = Math.abs(Math.sin(a));
  return { w: w * c + h * sn, h: w * sn + h * c };
});

const rootStyle = computed(() => ({
  "--r": `${props.radius}px`,
  "--h": `${props.height}px`,
  "--t": `${props.thickness}px`,
  "--u": props.scale,
  "--tilt": `${props.tilt}deg`,
  "--flip": props.reverse ? -1 : 1,
  "--n": props.lines,
  "--step": `${360 / props.lines}deg`,
  "--ink": props.color,
  "--ink-back": props.backColor,
  "--spin": `${props.duration}s`,
  width: `${boxSize.value.w}px`,
  height: `${boxSize.value.h}px`,
}));

const ringY = (i) => (props.rings > 1 ? i / (props.rings - 1) : 0);
const isEnd = (i) => i === 0 || i === props.rings - 1;

/* Mouse-driven tilt: the horizontal mouse position (left edge to right edge of
   the window) maps to -tiltRange..+tiltRange degrees, eased toward its target.
   The offset is written straight to a CSS variable, so Vue never re-renders. */
const root = ref(null);
let target = 0;
let current = 0;
let raf = 0;

function frame() {
  current += (target - current) * 0.08;
  if (Math.abs(target - current) < 0.01) {
    current = target;
    raf = 0;
  } else {
    raf = requestAnimationFrame(frame);
  }
  root.value?.style.setProperty("--tilt-offset", `${current.toFixed(3)}deg`);
}
function kick() {
  if (!raf) raf = requestAnimationFrame(frame);
}
function onMove(e) {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  target = Math.max(-1, Math.min(1, nx)) * props.tiltRange;
  kick();
}
function onLeave() {
  target = 0;
  kick();
}

onMounted(() => {
  if (!props.interactive) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
});
onBeforeUnmount(() => {
  window.removeEventListener("pointermove", onMove);
  document.documentElement.removeEventListener("pointerleave", onLeave);
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div
    ref="root"
    class="iso-cylinder"
    :style="rootStyle"
    role="img"
    aria-label="A wireframe cylinder rotating in isometric view"
  >
    <div class="iso">
      <div class="cyl">
        <div
          v-for="(_, i) in rings"
          :key="'r' + i"
          class="ring"
          :class="{ m: !isEnd(i) }"
          :style="{ '--y': `calc(var(--h) * ${ringY(i)})` }"
        />
        <div class="spin">
          <div
            v-for="i in lines"
            :key="'l' + i"
            class="l"
            :style="{ '--i': i - 1 }"
          >
            <div class="bb"><span class="f" /><span class="b" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iso-cylinder {
  position: relative;
  display: grid;
  place-items: center;
}
.iso {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  /* --flip: -1 mirrors the scene, which reverses the spin direction */
  transform: rotateZ(calc(var(--tilt) + var(--tilt-offset, 0deg)))
    scale(calc(var(--u) * var(--flip)), var(--u)) rotateX(-35.264deg);
}
.cyl {
  position: absolute;
  left: 0;
  top: calc(var(--h) / -2);
  transform-style: preserve-3d;
}
.spin {
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  animation: iso-cyl-spin var(--spin) linear infinite;
  will-change: transform;
}
@keyframes iso-cyl-spin {
  to {
    transform: rotateY(360deg);
  }
}

/* Each line sits at its angle on the cylinder, then is counter-rotated so it
   always faces the viewer. That keeps its width constant, so it never thins
   out or pops at the left and right edges. */
.l {
  position: absolute;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
  transform: rotateY(calc(var(--i) * var(--step))) translateZ(var(--r))
    rotateY(calc(var(--i) * var(--step) * -1));
}
.bb {
  position: absolute;
  top: 0;
  left: calc(var(--t) / -2);
  width: var(--t);
  height: var(--h);
  animation: iso-cyl-unspin var(--spin) linear infinite;
  will-change: transform;
}
@keyframes iso-cyl-unspin {
  to {
    transform: rotateY(-360deg);
  }
}

/* Front/back color: crossfade by position around the cylinder (opacity only) */
.bb span {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  animation-duration: var(--spin);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-delay: calc(var(--spin) * var(--i) / var(--n) * -1);
}
.f {
  background: var(--ink);
  animation-name: iso-cyl-front;
}
.b {
  background: var(--ink-back);
  animation-name: iso-cyl-back;
}
@keyframes iso-cyl-front {
  0%,
  20%,
  80%,
  100% {
    opacity: 1;
  }
  30%,
  70% {
    opacity: 0;
  }
}
@keyframes iso-cyl-back {
  0%,
  20%,
  80%,
  100% {
    opacity: 0;
  }
  30%,
  70% {
    opacity: 1;
  }
}

.ring {
  position: absolute;
  left: calc(var(--r) * -1);
  top: calc(var(--r) * -1);
  width: calc(var(--r) * 2);
  height: calc(var(--r) * 2);
  box-sizing: border-box;
  border: var(--t) solid var(--ink);
  border-radius: 50%;
  transform: translateY(var(--y)) rotateX(90deg);
}
.ring.m {
  border-width: max(1px, calc(var(--t) * 1.5));
  opacity: 0.3;
}

@media (prefers-reduced-motion: reduce) {
  .spin,
  .bb,
  .bb span {
    animation-play-state: paused;
  }
}
</style>
