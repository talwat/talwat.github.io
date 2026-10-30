<script setup>
import { computed } from "vue";
import { usePerformance } from "./usePerformance";

const animated = usePerformance();
const props = defineProps({
  // Camera body dimensions (px, before scaling)
  width: { type: Number, default: 240 },
  height: { type: Number, default: 150 },
  depth: { type: Number, default: 90 },

  // Lens
  lens: { type: Number, default: 52 }, // radius
  lensLength: { type: Number, default: 56 },
  lines: { type: Number, default: 16 }, // lines running along the lens barrel

  // Appearance
  thickness: { type: Number, default: 2 },
  scale: { type: Number, default: 1.4 },
  tilt: { type: Number, default: 0 }, // degrees, rotates the whole scene
  color: { type: String, default: "var(--accent)" },
  backColor: {
    type: String,
    default: "color-mix(in srgb, var(--accent) 50%, transparent)",
  },

  // Motion
  duration: { type: Number, default: 14 }, // seconds per revolution
  reverse: { type: Boolean, default: false }, // mirror the spin direction
  startAngle: { type: Number, default: 0 }, // degrees, initial rotation around the vertical axis
});

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SEGMENTS = 24; // strokes per ring
const SEGMENT_ANGLES = Array.from(
  { length: SEGMENTS },
  (_, i) => `${(i * 360) / SEGMENTS}deg`,
);

// True isometric elevation: atan(1 / sqrt(2))
const ISO_ELEVATION_DEG = 35.264;
const ISO_ELEVATION_RAD = (ISO_ELEVATION_DEG * Math.PI) / 180;
const COS = Math.cos(ISO_ELEVATION_RAD);
const SIN = Math.sin(ISO_ELEVATION_RAD);

const SIGNS = [-1, 1];

/* -------------------------------------------------------------------------- */
/* Geometry                                                                   */
/* -------------------------------------------------------------------------- */

/** Builds the raw edge and ring lists for the camera model. */
function buildModel({
  width: W,
  height: H,
  depth: D,
  lens: R,
  lensLength: L,
  lines,
}) {
  const edges = [];
  const rings = [];

  // A straight edge of length `len`, centred on (x, y, z), running along `axis`.
  const edge = (axis, x, y, z, len) => edges.push({ axis, x, y, z, len });

  // Wireframe box centred on (cx, cy, cz).
  const box = (cx, cy, cz, w, h, d) => {
    for (const sy of SIGNS) {
      for (const sz of SIGNS) {
        edge("x", cx, cy + (sy * h) / 2, cz + (sz * d) / 2, w);
      }
    }
    for (const sx of SIGNS) {
      for (const sz of SIGNS) {
        edge("y", cx + (sx * w) / 2, cy, cz + (sz * d) / 2, h);
      }
    }
    for (const sx of SIGNS) {
      for (const sy of SIGNS) {
        edge("z", cx + (sx * w) / 2, cy + (sy * h) / 2, cz, d);
      }
    }
  };

  // Flat rectangle in the plane z.
  const rect = (cx, cy, z, w, h) => {
    for (const sy of SIGNS) edge("x", cx, cy + (sy * h) / 2, z, w);
    for (const sx of SIGNS) edge("y", cx + (sx * w) / 2, cy, z, h);
  };

  // Body, prism housing, and top controls
  box(0, 0, 0, W, H, D);
  box(0, H / 2 + H * 0.09, 0, W * 0.34, H * 0.18, D * 0.55);
  box(-W * 0.34, H / 2 + H * 0.04, 0, W * 0.16, H * 0.08, D * 0.35);
  box(W * 0.34, H / 2 + H * 0.03, D * 0.05, W * 0.09, H * 0.06, W * 0.09);

  // Front-face details (viewfinder and flash)
  rect(-W * 0.34, H * 0.22, D / 2, W * 0.13, H * 0.15);
  rect(W * 0.34, H * 0.22, D / 2, W * 0.1, H * 0.1);

  // Lens rings: outer barrel, then inner element
  const lensY = -H * 0.03;
  const lensZ = D / 2;
  rings.push(
    { x: 0, y: lensY, z: lensZ, r: R, mid: false },
    { x: 0, y: lensY, z: lensZ + L * 0.5, r: R, mid: true },
    { x: 0, y: lensY, z: lensZ + L, r: R, mid: false },
    { x: 0, y: lensY, z: lensZ + L, r: R * 0.62, mid: false },
    { x: 0, y: lensY, z: lensZ + L * 0.45, r: R * 0.62, mid: true },
  );

  // Lines running along the lens barrel
  for (let k = 0; k < lines; k++) {
    const a = (k / lines) * Math.PI * 2;
    edge("z", R * Math.sin(a), lensY + R * Math.cos(a), lensZ + L / 2, L);
  }

  return { edges, rings };
}

/**
 * Finds the largest horizontal radius (for the spin footprint) and the
 * vertical extent (for centring) of the model.
 */
function measureModel(edges, rings) {
  let radius = 0;
  let yMin = Infinity;
  let yMax = -Infinity;

  for (const { axis, x, y, z, len } of edges) {
    const half = len / 2;
    const xs = axis === "x" ? [x - half, x + half] : [x];
    const ys = axis === "y" ? [y - half, y + half] : [y];
    const zs = axis === "z" ? [z - half, z + half] : [z];

    for (const px of xs) {
      for (const pz of zs) radius = Math.max(radius, Math.hypot(px, pz));
    }
    for (const py of ys) {
      yMin = Math.min(yMin, py);
      yMax = Math.max(yMax, py);
    }
  }

  for (const { x, y, z, r } of rings) {
    radius = Math.max(radius, Math.hypot(x + r, z));
    yMin = Math.min(yMin, y - r);
    yMax = Math.max(yMax, y + r);
  }

  return { radius, yMin, yMax };
}

/** Position on the spin circle as 0–1, used to offset the depth-tint animation. */
const spinPhase = (x, z) => (Math.atan2(x, z) / (2 * Math.PI) + 1) % 1;

const geo = computed(() => {
  const { edges, rings } = buildModel(props);
  const { radius, yMin, yMax } = measureModel(edges, rings);
  const yCenter = (yMin + yMax) / 2;

  // CSS custom properties shared by edges and rings
  const place = ({ x, y, z }) => ({
    "--x": `${x.toFixed(2)}px`,
    "--y": `${(yCenter - y).toFixed(2)}px`, // flip: model +y is up, CSS +y is down
    "--z": `${z.toFixed(2)}px`,
    "--a": spinPhase(x, z).toFixed(4),
  });

  return {
    radius,
    span: yMax - yMin,
    edges: edges.map((e) => ({
      axis: e.axis,
      style: {
        ...place(e),
        "--len": `${(e.len + props.thickness).toFixed(2)}px`,
      },
    })),
    rings: rings.map((r) => ({
      mid: r.mid,
      style: {
        ...place(r),
        "--rr": `${r.r.toFixed(2)}px`,
        "--sl": `${((2 * Math.PI * r.r) / SEGMENTS + props.thickness).toFixed(2)}px`,
      },
    })),
  };
});

/* -------------------------------------------------------------------------- */
/* Container sizing                                                           */
/* -------------------------------------------------------------------------- */

const containerStyle = computed(() => {
  const { radius, span } = geo.value;
  const { thickness, scale, tilt } = props;

  // Projected size of the model at the isometric angle
  const w = (radius * 2 + thickness) * scale;
  const h = (span * COS + radius * 2 * SIN + thickness) * scale;

  // Bounding box of that rectangle after rotating by `tilt`
  const tiltRad = (tilt * Math.PI) / 180;
  const c = Math.abs(Math.cos(tiltRad));
  const s = Math.abs(Math.sin(tiltRad));

  return {
    "--t": `${thickness}px`,
    "--u": scale,
    "--tilt": `${tilt}deg`,
    "--elev": `${ISO_ELEVATION_DEG}deg`,
    "--flip": props.reverse ? -1 : 1,
    "--ink": props.color,
    "--ink-back": props.backColor,
    "--spin": `${props.duration}s`,
    "--start-turn": props.startAngle / 360, // fraction of a full revolution
    width: `${w * c + h * s}px`,
    height: `${w * s + h * c}px`,
  };
});
</script>

<template>
  <div
    class="iso-camera"
    :class="{ 'is-paused': !animated }"
    role="img"
    aria-label="A wireframe camera rotating in isometric view"
    :style="containerStyle"
  >
    <div class="iso">
      <div class="spin">
        <!-- Straight edges (box outlines, rects, lens lines) -->
        <i
          v-for="(edge, idx) in geo.edges"
          :key="`edge-${idx}`"
          :class="['e', edge.axis]"
          :style="edge.style"
        >
          <b />
          <b />
        </i>

        <!-- Lens rings, each built from SEGMENTS short strokes -->
        <i
          v-for="(ring, idx) in geo.rings"
          :key="`ring-${idx}`"
          :class="['ring', { m: ring.mid }]"
          :style="ring.style"
        >
          <i
            v-for="(angle, k) in SEGMENT_ANGLES"
            :key="`seg-${k}`"
            :style="{ '--ang': angle }"
          >
            <b />
            <b />
          </i>
        </i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iso-camera {
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
  transform: rotateZ(var(--tilt)) scale(calc(var(--u) * var(--flip)), var(--u))
    rotateX(calc(var(--elev) * -1));
}

/* Rotating group */
.spin {
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  animation: iso-cam-spin var(--spin) linear infinite;
  /* Negative delay starts the spin part-way through the revolution */
  animation-delay: calc(var(--spin) * var(--start-turn) * -1);
  will-change: transform;
}

@keyframes iso-cam-spin {
  to {
    transform: rotateY(360deg);
  }
}

/* Shared by straight edges and rings */
.e,
.ring {
  --pos: translate3d(var(--x), var(--y), var(--z));

  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform: var(--pos);
  transform-style: preserve-3d;
  color: var(--ink);
  /* Negative delay staggers each part around the spin circle, so the tint
     follows depth: front parts use --ink, rear parts fade to --ink-back. */
  animation: iso-cam-tone var(--spin) linear infinite;
  animation-delay: calc(var(--spin) * (var(--a) + var(--start-turn)) * -1);
}

@keyframes iso-cam-tone {
  0%,
  20%,
  80%,
  100% {
    color: var(--ink);
  }
  30%,
  70% {
    color: var(--ink-back);
  }
}

/* Edge orientation (default axis is x) */
.e.y {
  transform: var(--pos) rotateZ(90deg);
}

.e.z {
  transform: var(--pos) rotateY(90deg);
}

/* Each stroke is two crossed bars so it stays visible from any angle */
.e b,
.ring i b {
  position: absolute;
  border-radius: 999px;
  background: currentColor;
}

.e b {
  left: calc(var(--len) / -2);
  top: calc(var(--t) / -2);
  width: var(--len);
  height: var(--t);
}

.ring i {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform: rotateZ(var(--ang)) translateX(var(--rr)) rotateZ(90deg);
}

.ring i b {
  left: calc(var(--sl) / -2);
  top: calc(var(--t) / -2);
  width: var(--sl);
  height: var(--t);
}

.e b + b,
.ring i b + b {
  transform: rotateX(90deg);
}

/* Mid-barrel rings are drawn fainter */
.ring.m i b {
  background: color-mix(in srgb, currentColor 30%, transparent);
}

/* Paused: holds the front-on pose with the depth tint intact */
.is-paused .spin,
.is-paused .e,
.is-paused .ring {
  animation-play-state: paused;
}

.is-paused .spin {
  will-change: auto;
}

@media (prefers-reduced-motion: reduce) {
  .spin,
  .e,
  .ring {
    animation-play-state: paused;
  }
}
</style>
