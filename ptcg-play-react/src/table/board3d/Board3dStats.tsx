import { useEffect, useRef, useState } from 'react';
import type { Scene, WebGLRenderer } from 'three';
import styles from './Board3DCanvas.module.css';

export type Board3dStatsData = {
  fps: number;
  triangles: number;
  drawCalls: number;
  objectCount: number;
  geometries: number;
  textures: number;
};

export function Board3dStats({
  scene,
  renderer,
  onWireframeToggle,
}: {
  scene: Scene | null;
  renderer: WebGLRenderer | null;
  onWireframeToggle: (enabled: boolean) => void;
}) {
  const [stats, setStats] = useState<Board3dStatsData>({
    fps: 0,
    triangles: 0,
    drawCalls: 0,
    objectCount: 0,
    geometries: 0,
    textures: 0,
  });
  const [showWireframes, setShowWireframes] = useState(false);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameRef = useRef(performance.now());
  const lastStatsUpdateRef = useRef(performance.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!scene || !renderer) {
      return;
    }
    let cancelled = false;
    lastFrameRef.current = performance.now();
    lastStatsUpdateRef.current = performance.now();

    const loop = () => {
      if (cancelled) return;
      rafRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = now - lastFrameRef.current;
      lastFrameRef.current = now;
      if (dt > 0) {
        frameTimesRef.current.push(1000 / dt);
        if (frameTimesRef.current.length > 30) frameTimesRef.current.shift();
      }
      if (now - lastStatsUpdateRef.current >= 2500) {
        lastStatsUpdateRef.current = now;
        const avgFps =
          frameTimesRef.current.length > 0
            ? frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
            : 0;
        let triangles = 0;
        let drawCalls = 0;
        scene.traverse((obj) => {
          const m = obj as unknown as { geometry?: { attributes?: unknown }; isMesh?: boolean };
          if (m.isMesh && m.geometry && (m.geometry as { index?: { count: number } }).index) {
            const geo = m.geometry as { index: { count: number } };
            triangles += geo.index.count / 3;
            drawCalls++;
          }
        });
        setStats({
          fps: Math.round(avgFps),
          triangles: Math.round(triangles),
          drawCalls,
          objectCount: scene.children.length,
          geometries: 0,
          textures: 0,
        });
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [scene, renderer]);

  if (!scene || !renderer) {
    return null;
  }

  return (
    <div className={styles.fpsCounter}>
      <div className={styles.statLine}>
        FPS: {stats.fps} | Tris: {stats.triangles} | Draws: {stats.drawCalls} | Obj:{' '}
        {stats.objectCount}
      </div>
      <div className={`${styles.statLine} ${styles.wireframeToggle}`}>
        <label>
          <input
            type="checkbox"
            checked={showWireframes}
            onChange={(e) => {
              const v = e.target.checked;
              setShowWireframes(v);
              onWireframeToggle(v);
            }}
          />
          Wireframes
        </label>
      </div>
    </div>
  );
}
