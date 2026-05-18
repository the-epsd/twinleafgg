import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

type Board3dFpsBridgeProps = {
  onFps: (fps: number) => void;
  /** How often to call `onFps` with a fresh average (ms). */
  reportIntervalMs?: number;
};

/**
 * Samples the React Three Fiber render loop—the same cadence as the board WebGL frame loop—and
 * reports averaged FPS. The app does not set a custom FPS cap; the browser typically ties rAF to
 * display refresh (e.g. 60 Hz or 120 Hz on ProMotion).
 */
export function Board3dFpsBridge({ onFps, reportIntervalMs = 400 }: Board3dFpsBridgeProps) {
  const onFpsRef = useRef(onFps);
  onFpsRef.current = onFps;

  const windowStartRef = useRef(performance.now());
  const framesInWindowRef = useRef(0);

  useFrame(() => {
    framesInWindowRef.current++;
    const now = performance.now();
    const elapsed = now - windowStartRef.current;
    if (elapsed < reportIntervalMs) {
      return;
    }
    if (elapsed > 0) {
      onFpsRef.current(Math.round((framesInWindowRef.current / elapsed) * 1000));
    }
    windowStartRef.current = now;
    framesInWindowRef.current = 0;
  });

  return null;
}
