import { useEffect, useRef } from 'react';
import { createScene } from './ParticlesScene';

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
    if (isLowEnd() || !webglSupported() || !ref.current) return;
    return createScene(ref.current);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 h-full w-full opacity-60 pointer-events-none"
    />
  );
}
