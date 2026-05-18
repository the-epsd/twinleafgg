import type { MutableRefObject } from 'react';
import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { Group, PerspectiveCamera } from 'three';
import {
  Board3dController,
  type Board3dControllerProps,
  type Board3dR3fInitContext,
} from './board3dController';
import type { Board3dRuntime } from './createBoard3dRuntime';
import type { Board3dCardsAdapter } from './board3dCardsAdapter';
import type { Board3dGameActions } from './board3dGameActions';
import type { Board3dLightingSettings } from './board3dLightingConfig';
import { Board3dLightingRig } from './Board3dLightingRig';
import { BoardInteractionService } from '../BoardInteractionService';
import { Board3dCameraRig } from './Board3dCameraRig';
import { Board3dStaticScene } from './Board3dStaticScene';
import { Board3dBoardCardsLayer } from './Board3dBoardCardsLayer';
import { Board3dFrameEffects } from './Board3dFrameEffects';
import { Board3dStatsR3f } from './Board3dStats';
import { Board3dControllerRefContext } from './Board3dControllerContext';
import { Board3dFpsBridge } from './Board3dFpsBridge';
import { Board3dShufflePreviewKey } from './Board3dShufflePreviewKey';
import { Board3dPrizeLayer } from './Board3dPrizeLayer';
import { Selection } from '@react-three/postprocessing';

export type Board3dExperienceProps = {
  runtime: Board3dRuntime;
  cardsAdapter: Board3dCardsAdapter;
  gameActions: Board3dGameActions;
  boardInteraction: BoardInteractionService;
  controllerProps: Board3dControllerProps;
  onControllerReady?: (c: Board3dController | null) => void;
  lightingSettings: Board3dLightingSettings;
  /** Report averaged board WebGL FPS (from the R3F frame loop). */
  onBoardFps?: (fps: number) => void;
};

export function Board3dExperience({
  runtime,
  cardsAdapter,
  gameActions,
  boardInteraction,
  controllerProps,
  onControllerReady,
  lightingSettings,
  onBoardFps,
}: Board3dExperienceProps) {
  const worldRef = useRef<Group>(null!);
  const handRef = useRef<Group>(null!);
  const ctrlRef = useRef<Board3dController | null>(null);

  const { gl, scene, camera, size } = useThree();

  const stableRuntime = useMemo(() => runtime, [runtime]);

  useLayoutEffect(() => {
    const world = worldRef.current;
    const hand = handRef.current;
    if (!world || !hand) {
      return;
    }

    const ctx: Board3dR3fInitContext = {
      gl,
      scene,
      camera: camera as PerspectiveCamera,
      worldContentRoot: world,
      handSlot: hand,
    };

    const ctrl = new Board3dController(
      stableRuntime.assetLoader,
      stableRuntime.stateSync,
      stableRuntime.animationService,
      stableRuntime.interactionService,
      stableRuntime.handService,
      stableRuntime.wireframeService,
      stableRuntime.lightingService,
      stableRuntime.postProcessingService,
      cardsAdapter,
      gameActions,
      boardInteraction,
    );

    ctrl.initFromR3f(ctx, controllerProps);
    ctrlRef.current = ctrl;
    onControllerReady?.(ctrl);

    return () => {
      ctrl.destroy();
      ctrlRef.current = null;
      onControllerReady?.(null);
    };
  }, [gl, scene, camera, stableRuntime, cardsAdapter, gameActions, boardInteraction, onControllerReady]);

  useLayoutEffect(() => {
    ctrlRef.current?.applyViewportDimensions(size.width, size.height);
  }, [size.width, size.height]);

  useLayoutEffect(() => {
    ctrlRef.current?.refreshProps(controllerProps);
  }, [controllerProps]);

  return (
    <Selection>
      <Board3dControllerRefContext.Provider value={ctrlRef}>
        {onBoardFps ? <Board3dFpsBridge onFps={onBoardFps} /> : null}
        <Board3dShufflePreviewKey />
        <Board3dCameraRig clientId={controllerProps.clientId} topPlayer={controllerProps.topPlayer} />
        <Board3dLightingRig settings={lightingSettings} />
        <Suspense fallback={null}>
          <Board3dStaticScene />
        </Suspense>
        <group ref={worldRef}>
          <group ref={handRef} />
          <Board3dBoardCardsLayer stateSync={stableRuntime.stateSync} />
          <Board3dPrizeLayer />
        </group>
        <Board3dFrameEffects
          stateSync={stableRuntime.stateSync}
          boardInteraction={boardInteraction}
          bloom={lightingSettings.bloom}
        />
        <Board3dStatsR3f />
      </Board3dControllerRefContext.Provider>
    </Selection>
  );
}
