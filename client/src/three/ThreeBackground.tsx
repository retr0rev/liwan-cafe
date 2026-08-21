import { useEffect, useRef } from 'react';

const isLowEnd = () =>
  typeof navigator === 'undefined' ||
  navigator.hardwareConcurrency < 4 ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function ThreeBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;

    if (isLowEnd() || !webglSupported() || !ref.current) return;

    import('./ParticlesScene').then(({ createScene }) => {
      if (cancelled || !ref.current) return;
      dispose = createScene(ref.current);
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 h-full w-full opacity-60 pointer-events-none"
    />
  );
}
