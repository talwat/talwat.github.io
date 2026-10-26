<template>
  <div
    class="iso-camera"
    role="img"
    aria-label="A wireframe camera rotating in isometric view"
    :style="containerStyle"
  >
    <div class="iso">
      <div class="spin">
        <!-- Edges -->
        <i
          v-for="(edge, idx) in geo.edges"
          :key="'edge-' + idx"
          :class="['e', edge.axis]"
          :style="edge.style"
        >
          <b />
          <b />
        </i>

        <!-- Rings -->
        <i
          v-for="(ring, idx) in geo.rings"
          :key="'ring-' + idx"
          :class="['ring', { m: ring.mid }]"
          :style="ring.style"
        >
          <i
            v-for="k in SEG"
            :key="'seg-' + k"
            :style="{ '--ang': `${((k - 1) * 360) / SEG}deg` }"
          >
            <b />
            <b />
          </i>
        </i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  width: { type: Number, default: 240 },
  height: { type: Number, default: 150 },
  depth: { type: Number, default: 90 },
  lens: { type: Number, default: 52 },
  lensLength: { type: Number, default: 56 },
  thickness: { type: Number, default: 2 },
  scale: { type: Number, default: 1.4 },
  tilt: { type: Number, default: 0 },
  lines: { type: Number, default: 16 },
  duration: { type: Number, default: 14 },
  color: { type: String, default: "var(--accent, #1d4ed8)" },
  backColor: { type: String, default: "var(--bg-2, #cfcac0)" },
  reverse: { type: Boolean, default: false },
});

const SEG = 24;
const COS = Math.cos((35.264 * Math.PI) / 180);
const SIN = Math.sin((35.264 * Math.PI) / 180);

const geo = computed(() => {
  const {
    width: W,
    height: H,
    depth: D,
    lens: R,
    lensLength: L,
    thickness: t,
  } = props;
  const edges = [];
  const rings = [];

  const edge = (axis, x, y, z, len) => edges.push({ axis, x, y, z, len });

  const box = (cx, cy, cz, w, h, d) => {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        edge("x", cx, cy + (sy * h) / 2, cz + (sz * d) / 2, w);
      }
    }
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        edge("y", cx + (sx * w) / 2, cy, cz + (sz * d) / 2, h);
      }
    }
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        edge("z", cx + (sx * w) / 2, cy + (sy * h) / 2, cz, d);
      }
    }
  };

  const rect = (cx, cy, z, w, h) => {
    for (const sy of [-1, 1]) edge("x", cx, cy + (sy * h) / 2, z, w);
    for (const sx of [-1, 1]) edge("y", cx + (sx * w) / 2, cy, z, h);
  };

  // Camera Body & Parts
  box(0, 0, 0, W, H, D);
  box(0, H / 2 + H * 0.09, 0, W * 0.34, H * 0.18, D * 0.55);
  box(-W * 0.34, H / 2 + H * 0.04, 0, W * 0.16, H * 0.08, D * 0.35);
  box(W * 0.34, H / 2 + H * 0.03, D * 0.05, W * 0.09, H * 0.06, W * 0.09);
  rect(-W * 0.34, H * 0.22, D / 2, W * 0.13, H * 0.15);
  rect(W * 0.34, H * 0.22, D / 2, W * 0.1, H * 0.1);

  // Lens Rings
  const ly = -H * 0.03;
  const z0 = D / 2;
  rings.push(
    { x: 0, y: ly, z: z0, r: R, mid: false },
    { x: 0, y: ly, z: z0 + L * 0.5, r: R, mid: true },
    { x: 0, y: ly, z: z0 + L, r: R, mid: false },
    { x: 0, y: ly, z: z0 + L, r: R * 0.62, mid: false },
    { x: 0, y: ly, z: z0 + L * 0.45, r: R * 0.62, mid: true },
  );

  // Lens Length Lines
  for (let k = 0; k < props.lines; k++) {
    const a = (k / props.lines) * Math.PI * 2;
    edge("z", R * Math.sin(a), ly + R * Math.cos(a), z0 + L / 2, L);
  }

  // Calculate Bounds
  let rxz = 0;
  let ymin = Infinity;
  let ymax = -Infinity;

  for (const e of edges) {
    const h = e.len / 2;
    const xs = e.axis === "x" ? [e.x - h, e.x + h] : [e.x];
    const zs = e.axis === "z" ? [e.z - h, e.z + h] : [e.z];
    const ys = e.axis === "y" ? [e.y - h, e.y + h] : [e.y];

    for (const x of xs) {
      for (const z of zs) {
        rxz = Math.max(rxz, Math.hypot(x, z));
      }
    }
    for (const y of ys) {
      ymin = Math.min(ymin, y);
      ymax = Math.max(ymax, y);
    }
  }

  for (const r of rings) {
    rxz = Math.max(rxz, Math.hypot(r.x + r.r, r.z));
    ymin = Math.min(ymin, r.y - r.r);
    ymax = Math.max(ymax, r.y + r.r);
  }

  const yc = (ymin + ymax) / 2;
  const phase = (x, z) =>
    (((Math.atan2(x, z) * 180) / Math.PI + 360) % 360) / 360;

  const place = (o) => ({
    "--x": `${o.x.toFixed(2)}px`,
    "--y": `${(-(o.y - yc)).toFixed(2)}px`,
    "--z": `${o.z.toFixed(2)}px`,
    "--a": phase(o.x, o.z).toFixed(4),
  });

  return {
    rxz,
    span: ymax - ymin,
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
        "--sl": `${((2 * Math.PI * r.r) / SEG + props.thickness).toFixed(2)}px`,
      },
    })),
  };
});

const containerStyle = computed(() => {
  const w = (geo.value.rxz * 2 + props.thickness) * props.scale;
  const h =
    (geo.value.span * COS + geo.value.rxz * 2 * SIN + props.thickness) *
    props.scale;
  const a = (props.tilt * Math.PI) / 180;
  const c = Math.abs(Math.cos(a));
  const sn = Math.abs(Math.sin(a));

  return {
    "--t": `${props.thickness}px`,
    "--u": props.scale,
    "--tilt": `${props.tilt}deg`,
    "--flip": props.reverse ? -1 : 1,
    "--ink": props.color,
    "--ink-back": props.backColor,
    "--spin": `${props.duration}s`,
    width: `${w * c + h * sn}px`,
    height: `${w * sn + h * c}px`,
  };
});
</script>

<style scoped>
.iso-camera {
  position: relative;
  display: grid;
  place-items: center;
}

.iso {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform: rotateZ(var(--tilt)) scale(calc(var(--u) * var(--flip)), var(--u))
    rotateX(-35.264deg);
}

.spin {
  position: absolute;
  left: 0;
  top: 0;
  transform-style: preserve-3d;
  animation: iso-cam-spin var(--spin) linear infinite;
  will-change: transform;
}

@keyframes iso-cam-spin {
  to {
    transform: rotateY(360deg);
  }
}

.e,
.ring {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  color: var(--ink);
  animation: iso-cam-tone var(--spin) linear infinite;
  animation-delay: calc(var(--spin) * var(--a) * -1);
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

.e {
  transform: translate3d(var(--x), var(--y), var(--z));
}

.e.y {
  transform: translate3d(var(--x), var(--y), var(--z)) rotateZ(90deg);
}

.e.z {
  transform: translate3d(var(--x), var(--y), var(--z)) rotateY(90deg);
}

:deep(.e b),
:deep(.ring i b) {
  position: absolute;
  border-radius: 999px;
  background: currentColor;
}

.e :deep(b) {
  left: calc(var(--len) / -2);
  top: calc(var(--t) / -2);
  width: var(--len);
  height: var(--t);
}

.e :deep(b + b) {
  transform: rotateX(90deg);
}

.ring {
  --th: var(--t);
  transform: translate3d(var(--x), var(--y), var(--z));
}

.ring :deep(i) {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  transform: rotateZ(var(--ang)) translateX(var(--rr)) rotateZ(90deg);
}

.ring :deep(i b) {
  left: calc(var(--sl) / -2);
  top: calc(var(--th) / -2);
  width: var(--sl);
  height: var(--th);
}

.ring :deep(i b + b) {
  transform: rotateX(90deg);
}

.ring.m :deep(i b) {
  background: color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .spin,
  .e,
  .ring {
    animation-play-state: paused;
  }
}
</style>
