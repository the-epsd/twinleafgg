import { useEffect, useMemo } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  ClampToEdgeWrapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  type Group,
} from 'three';

const DECK_BOX_OBJ_URL = '/assets/models/deck-box.obj';

type DeckBoxModelProps = {
  textureUrl: string;
  scale: number;
  /** Yaw in radians. Customize uses Math.PI so the front faces the opposite direction. */
  rotationY?: number;
};

export function DeckBoxModel({ textureUrl, scale, rotationY = 0 }: DeckBoxModelProps) {
  const obj = useLoader(OBJLoader, DECK_BOX_OBJ_URL);
  const texture = useTexture(textureUrl);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  const model = useMemo(() => {
    const clone = obj.clone(true) as Group;
    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new MeshStandardMaterial({
          roughness: 0.85,
          metalness: 0.05,
        });
      }
    });
    return clone;
  }, [obj]);

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.flipY = true;
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.anisotropy = Math.max(4, maxAnisotropy);
    texture.needsUpdate = true;

    model.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const material = child.material;
      if (Array.isArray(material)) {
        for (const mat of material) {
          if (mat instanceof MeshStandardMaterial) {
            mat.map = texture;
            mat.needsUpdate = true;
          }
        }
        return;
      }
      if (material instanceof MeshStandardMaterial) {
        material.map = texture;
        material.needsUpdate = true;
      }
    });
  }, [model, texture, maxAnisotropy]);

  return <primitive object={model} scale={scale} rotation={[0, rotationY, 0]} />;
}
