import { useEffect, type RefObject } from 'react';
import anime from 'animejs';

export function useReveal(
  ref: RefObject<HTMLElement>,
  opts: { delay?: number; translateY?: number; duration?: number } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [opts.translateY ?? 24, 0],
      duration: opts.duration ?? 700,
      delay: opts.delay ?? 0,
      easing: 'easeOutCubic',
    });
  }, [ref, opts]);
}
