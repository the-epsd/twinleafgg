import { useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { DirectionalLight } from 'three';
import type { Board3dLightingSettings } from './board3dLightingConfig';
import { board3dToneMappingConstant } from './board3dLightingConfig';

export function Board3dLightingRig({ settings }: { settings: Board3dLightingSettings }) {
  const gl = useThree((s) => s.gl);
  const dirRef = useRef<DirectionalLight>(null);

  useLayoutEffect(() => {
    gl.shadowMap.enabled = settings.directional.castShadow;
  }, [gl, settings.directional.castShadow]);

  useLayoutEffect(() => {
    gl.toneMapping = board3dToneMappingConstant(settings.renderer.toneMapping);
    gl.toneMappingExposure = settings.renderer.toneMappingExposure;
  }, [gl, settings.renderer.toneMapping, settings.renderer.toneMappingExposure]);

  useLayoutEffect(() => {
    const light = dirRef.current;
    if (!light) return;
    const size = settings.directional.shadowMapSize;
    light.shadow.mapSize.set(size, size);
    light.shadow.bias = settings.directional.shadowBias;
    const cam = light.shadow.camera;
    const sc = settings.directional.shadowCamera;
    cam.left = sc.left;
    cam.right = sc.right;
    cam.top = sc.top;
    cam.bottom = sc.bottom;
    cam.near = sc.near;
    cam.far = sc.far;
    cam.updateProjectionMatrix();
    light.shadow.needsUpdate = true;
  }, [settings.directional]);

  return (
    <>
      <ambientLight color={settings.ambient.color} intensity={settings.ambient.intensity} />
      <directionalLight
        ref={dirRef}
        color={settings.directional.color}
        intensity={settings.directional.intensity}
        position={settings.directional.position}
        castShadow={settings.directional.castShadow}
      />
    </>
  );
}
