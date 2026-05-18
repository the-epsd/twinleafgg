import { forwardRef, useImperativeHandle } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { Board3dCard } from './board-3d-card';
import { useBoard3dControllerRef } from './Board3dControllerContext';

export type Board3dCardMeshProps = {
  card: Board3dCard;
};

/**
 * Declarative wrapper for a {@link Board3dCard} group with R3F pointer surface events
 * (hit object forwarded to {@link Board3dInteractionService} to avoid a second raycast).
 * `ref` exposes the backing Three.js card {@link Group} for GSAP / overlays.
 */
export const Board3dCardMesh = forwardRef<Group, Board3dCardMeshProps>(function Board3dCardMesh(
  { card },
  ref,
) {
  const g = card.getGroup();
  useImperativeHandle(ref, () => g, [card]);
  const ctrlRef = useBoard3dControllerRef();

  return (
    <primitive
      object={g}
      dispose={null}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => ctrlRef.current?.handleR3fMeshPointerDown(e)}
    />
  );
});
