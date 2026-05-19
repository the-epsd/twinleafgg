import { useFrame, useThree } from '@react-three/fiber';
import { useLayoutEffect, useState } from 'react';
import type { Light, PerspectiveCamera } from 'three';
import { Vector3 } from 'three';
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing';
import { updateBoard3dHoloTime } from './board-3d-holo-material';
import type { Board3dStateSyncService } from './services/board-3d-state-sync.service';
import { BoardInteractionService } from '../BoardInteractionService';
import { isBoard3dBloomActive } from './board3dLightingConfig';

/** Screen-space “below the card”: opposite of the old top offset in group-local space. */
const DAMAGE_HUD_LOCAL = new Vector3(0, -2.35, 0);

function collectLights(scene: { traverse: (cb: (o: unknown) => void) => void }): Light[] {
  const found: Light[] = [];
  scene.traverse((o) => {
    const obj = o as Light;
    if (obj.isLight) {
      found.push(obj);
    }
  });
  return found;
}

/**
 * Per-frame work for R3F: holo clock, card billboards, remove-damage HUD screen position.
 * Replaces {@link Board3dController.tick} in R3F mode.
 */
function Board3dPerFrameHooks({
  stateSync,
  boardInteraction,
}: {
  stateSync: Board3dStateSyncService;
  boardInteraction: BoardInteractionService;
}) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  useFrame((state) => {
    updateBoard3dHoloTime(state.clock.elapsedTime);
    stateSync.updateBillboards(camera as PerspectiveCamera);

    if (!boardInteraction.isFloatingDamageHudOverlayActive()) {
      boardInteraction.setRemoveDamageHudAnchor(null);
      return;
    }
    const targets = boardInteraction.getSelectedTargets();
    if (targets.length === 0) {
      boardInteraction.setRemoveDamageHudAnchor(null);
      return;
    }
    const group = stateSync.getBoardPokemonGroupForTarget(targets[0]);
    if (!group) {
      boardInteraction.setRemoveDamageHudAnchor(null);
      return;
    }
    DAMAGE_HUD_LOCAL.set(0, -2.35, 0);
    group.localToWorld(DAMAGE_HUD_LOCAL);
    DAMAGE_HUD_LOCAL.project(camera as PerspectiveCamera);
    const rect = gl.domElement.getBoundingClientRect();
    const x = rect.left + (DAMAGE_HUD_LOCAL.x * 0.5 + 0.5) * rect.width;
    const y = rect.top + (-DAMAGE_HUD_LOCAL.y * 0.5 + 0.5) * rect.height;
    boardInteraction.setRemoveDamageHudAnchor({ x, y });
  });

  return null;
}

function Board3dBloomPipeline({
  bloom,
}: {
  bloom: { intensity: number; luminanceThreshold: number };
}) {
  const scene = useThree((s) => s.scene);
  const [lights, setLights] = useState<Light[]>([]);

  useLayoutEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const sync = () => {
      if (cancelled) return;
      const found = collectLights(scene);
      if (found.length > 0) {
        setLights(found);
        return;
      }
      attempts++;
      if (attempts < 120) {
        requestAnimationFrame(sync);
      }
    };
    sync();
    return () => {
      cancelled = true;
    };
  }, [scene]);

  if (lights.length === 0) {
    return null;
  }

  return (
    <EffectComposer multisampling={0}>
      <SelectiveBloom
        lights={lights}
        inverted
        luminanceThreshold={bloom.luminanceThreshold}
        intensity={bloom.intensity}
      />
    </EffectComposer>
  );
}

/**
 * Post-processing: only mounts while bloom is on. The center emblem is wrapped in
 * {@link Select} + {@link Selection} so inverted selective bloom skips it (natural PNG colours).
 */
export function Board3dFrameEffects({
  stateSync,
  boardInteraction,
  bloom,
}: {
  stateSync: Board3dStateSyncService;
  boardInteraction: BoardInteractionService;
  bloom: { intensity: number; luminanceThreshold: number };
}) {
  const postActive = isBoard3dBloomActive(bloom);

  return (
    <>
      <Board3dPerFrameHooks stateSync={stateSync} boardInteraction={boardInteraction} />
      {postActive ? <Board3dBloomPipeline bloom={bloom} /> : null}
    </>
  );
}
