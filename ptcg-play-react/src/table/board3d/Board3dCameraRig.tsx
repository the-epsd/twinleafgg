import { useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { PerspectiveCamera } from 'three';
import { PerspectiveCamera as DreiPerspectiveCamera } from '@react-three/drei';
import type { Player } from 'ptcg-server';
import { getCameraConfig } from './board-3d-config';

export function Board3dCameraRig({ clientId, topPlayer }: { clientId: number; topPlayer: Player }) {
  const camRef = useRef<PerspectiveCamera>(null);
  const size = useThree(s => s.size);
  const isUpsideDown = topPlayer?.id === clientId;

  useLayoutEffect(() => {
    const cam = camRef.current;
    if (!cam) {
      return;
    }
    const aspect = size.width / Math.max(size.height, 1e-6);
    const cfg = getCameraConfig(aspect, isUpsideDown);
    cam.fov = cfg.fov;
    cam.aspect = aspect;
    cam.updateProjectionMatrix();
    cam.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
    cam.lookAt(cfg.lookAt.x, cfg.lookAt.y, cfg.lookAt.z);
  }, [size.width, size.height, isUpsideDown]);

  return <DreiPerspectiveCamera ref={camRef} near={0.1} far={2000} makeDefault />;
}
