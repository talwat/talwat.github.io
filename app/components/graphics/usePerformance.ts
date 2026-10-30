import { ref, onMounted, onScopeDispose } from "vue";

/**
 * Returns a ref that is `true` when it's reasonable to run motion:
 * the user hasn't asked for reduced motion and the device looks capable.
 *
 * Starts as `false`, so SSR and the first render show the still version.
 */
export const usePerformance = () => {
  const performant = ref(false);
  let motionQuery: MediaQueryList | undefined;

  const evaluate = () => {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory; // Chromium only
    const reducedMotion = motionQuery?.matches ?? false;

    performant.value = !reducedMotion && cores >= 4 && (!memory || memory >= 8);
  };

  onMounted(() => {
    motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", evaluate); // follows OS setting live
    evaluate();
  });

  onScopeDispose(() => motionQuery?.removeEventListener("change", evaluate));

  return performant;
};
