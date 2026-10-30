<template>
  <div
    ref="root"
    class="iso-cylinder"
    :class="{ 'is-paused': !running }"
    :style="rootStyle"
    role="img"
    aria-label="A wireframe cylinder rotating in isometric view"
  >
    <div class="iso">
      <div class="cyl">
        <!-- Rings: the first and last are the caps, the rest are fainter -->
        <div
          v-for="(_, i) in rings"
          :key="`ring-${i}`"
          class="ring"
          :class="{ m: !isEnd(i) }"
          :style="{ '--y': `calc(var(--h) * ${ringY(i)})` }"
        />

        <!-- Vertical lines around the cylinder -->
        <div class="spin">
          <div
            v-for="i in lines"
            :key="`line-${i}`"
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

<script setup>
import { computed, ref, watch, onBeforeUnmount } from "vue";
import { usePerformance } from "./usePerformance";

const props = defineProps({
  // Geometry (px, before scaling)
  height: { type: Number, default: 420 },
  radius: { type: Number, default: 90 },
  lines: { type: Number, default: 16 }, // vertical lines around the cylinder
  rings: { type: Number, default: 5 }, // rings, including the top and bottom

  // Appearance
  thickness: { type: Number, default: 2 }, // line + cap-ring thickness
  scale: { type: Number, default: 1 },
  color: { type: String, default: "var(--accent)" }, // front lines + rings
  backColor: { type: String, default: "var(--bg-2)" }, // lines on the far side

  // Orientation
  tilt: { type: Number, default: 45 }, // resting in-plane rotation, degrees (0 = upright)
  tiltRange: { type: Number, default: 25 }, // max degrees the mouse can add/subtract
  startAngle: { type: Number, default: 0 }, // degrees, initial rotation around the vertical axis

  // Motion
  animated: { type: Boolean, default: true }, // spin + mouse tilt; still when false
  duration: { type: Number, default: 14 }, // seconds per full revolution
  reverse: { type: Boolean, default: false }, // mirror the spin direction
});

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

// True isometric elevation: atan(1 / sqrt(2))
const ISO_ELEVATION_DEG = 35.264;
const ISO_ELEVATION_RAD = (ISO_ELEVATION_DEG * Math.PI) / 180;
const COS = Math.cos(ISO_ELEVATION_RAD);
const SIN = Math.sin(ISO_ELEVATION_RAD);

const TILT_EASING = 0.08; // fraction of the remaining distance covered per frame
const TILT_EPSILON = 0.01; // degrees; stop animating once this close

/* -------------------------------------------------------------------------- */
/* Motion gate                                                                */
/* -------------------------------------------------------------------------- */

// Motion runs only when the prop allows it and the device is up to it
// (reduced-motion and hardware checks live in the composable).
const performant = usePerformance();
const running = computed(() => props.animated && performant.value);

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

const boxSize = computed(() => {
  const { radius, height, thickness, scale, tilt } = props;

  // Projected size at the isometric angle
  const w = (radius * 2 + thickness) * scale;
  const h = (height * COS + radius * 2 * SIN + thickness) * scale;

  // Bounding box of that rectangle after rotating by `tilt`
  const a = (tilt * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const s = Math.abs(Math.sin(a));

  return { w: w * c + h * s, h: w * s + h * c };
});

const rootStyle = computed(() => ({
  "--r": `${props.radius}px`,
  "--h": `${props.height}px`,
  "--t": `${props.thickness}px`,
  "--u": props.scale,
  "--tilt": `${props.tilt}deg`,
  "--elev": `${ISO_ELEVATION_DEG}deg`,
  "--flip": props.reverse ? -1 : 1,
  "--n": props.lines,
  "--step": `${360 / props.lines}deg`,
  "--ink": props.color,
  "--ink-back": props.backColor,
  "--spin": `${props.duration}s`,
  "--start-turn": props.startAngle / 360, // fraction of a full revolution
  width: `${boxSize.value.w}px`,
  height: `${boxSize.value.h}px`,
}));

// Vertical position of ring i as 0–1 (0 = top cap, 1 = bottom cap)
const ringY = (i) => (props.rings > 1 ? i / (props.rings - 1) : 0);
const isEnd = (i) => i === 0 || i === props.rings - 1;

/* -------------------------------------------------------------------------- */
/* Mouse tilt                                                                 */
/* -------------------------------------------------------------------------- */

/* The horizontal mouse position (left edge to right edge of the window) maps
   to -tiltRange..+tiltRange degrees, eased toward its target. The offset is
   written straight to a CSS variable, so Vue never re-renders. */
const root = ref(null);
let target = 0;
let current = 0;
let raf = 0;

function frame() {
  current += (target - current) * TILT_EASING;

  const settled = Math.abs(target - current) < TILT_EPSILON;
  if (settled) current = target;

  root.value?.style.setProperty("--tilt-offset", `${current.toFixed(3)}deg`);
  raf = settled ? 0 : requestAnimationFrame(frame);
}

function ease() {
  if (!raf) raf = requestAnimationFrame(frame);
}

function onMove(e) {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  target = Math.max(-1, Math.min(1, nx)) * props.tiltRange;
  ease();
}

function resetTilt() {
  target = 0;
  ease();
}

function attach() {
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", resetTilt);
}

function detach() {
  window.removeEventListener("pointermove", onMove);
  document.documentElement.removeEventListener("pointerleave", resetTilt);
}

// Listen only while motion is allowed; ease back to rest when it stops
watch(running, (on) => {
  if (on) {
    attach();
  } else {
    detach();
    resetTilt();
  }
});

onBeforeUnmount(() => {
  detach();
  cancelAnimationFrame(raf);
});
</script>

<style scoped>
.iso-cylinder {
  position: relative;
  display: grid;
  place-items: center;
}

/* Isometric projection */
.iso {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  /* --flip: -1 mirrors the scene, which reverses the spin direction */
  transform: rotateZ(calc(var(--tilt) + var(--tilt-offset, 0deg)))
    scale(calc(var(--u) * var(--flip)), var(--u))
    rotateX(calc(var(--elev) * -1));
}

.cyl {
  position: absolute;
  left: 0;
  top: calc(var(--h) / -2);
  transform-style: preserve-3d;
}

/* Rotating group. The negative delay starts the revolution part-way through. */
.spin {
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  animation: iso-cyl-spin var(--spin) linear infinite;
  animation-delay: calc(var(--spin) * var(--start-turn) * -1);
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

/* Counter-spin: cancels the group's rotation. It needs the same start offset
   as .spin, or the lines would start out of alignment. */
.bb {
  position: absolute;
  top: 0;
  left: calc(var(--t) / -2);
  width: var(--t);
  height: var(--h);
  animation: iso-cyl-unspin var(--spin) linear infinite;
  animation-delay: calc(var(--spin) * var(--start-turn) * -1);
  will-change: transform;
}

@keyframes iso-cyl-unspin {
  to {
    transform: rotateY(-360deg);
  }
}

/* Front/back color: crossfade by position around the cylinder (opacity only).
   The delay staggers each line around the circle, plus the start offset. */
.bb span {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  animation-duration: var(--spin);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-delay: calc(
    var(--spin) * (var(--i) / var(--n) + var(--start-turn)) * -1
  );
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

/* Paused: holds the pose at the start angle with the depth tint intact */
.is-paused .spin,
.is-paused .bb,
.is-paused .bb span {
  animation-play-state: paused;
}

.is-paused .spin,
.is-paused .bb {
  will-change: auto;
}
</style>
