import { Suspense, useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import type { Group, PerspectiveCamera } from 'three';
import { Selection } from '@react-three/postprocessing';
import {
  Board3dController,
  type Board3dControllerProps,
  type Board3dR3fInitContext,
} from './board3dController';
import type { Board3dRuntime } from './createBoard3dRuntime';
import type { Board3dCardsAdapter } from './board3dCardsAdapter';
import type { Board3dGameActions } from './board3dGameActions';
import type { Board3dLightingSettings } from './board3dLightingConfig';
import { isBoard3dBloomActive } from './board3dLightingConfig';
import { Board3dLightingRig } from './Board3dLightingRig';
import { BoardInteractionService } from '../BoardInteractionService';
import { Board3dCameraRig } from './Board3dCameraRig';
import { Board3dStaticScene } from './Board3dStaticScene';
import { Board3dBoardCardsLayer } from './Board3dBoardCardsLayer';
import { Board3dFrameEffects } from './Board3dFrameEffects';
import { Board3dControllerRefContext } from './Board3dControllerContext';
import { Board3dFpsBridge } from './Board3dFpsBridge';
import { Board3dShufflePreviewKey } from './Board3dShufflePreviewKey';
import { Board3dPrizeLayer } from './Board3dPrizeLayer';

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

  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const viewportWidth = useThree((s) => s.size.width);
  const viewportHeight = useThree((s) => s.size.height);

  const gameActionsRef = useRef(gameActions);
  gameActionsRef.current = gameActions;
  const boardInteractionRef = useRef(boardInteraction);
  boardInteractionRef.current = boardInteraction;

  const bloomActive = isBoard3dBloomActive(lightingSettings.bloom);

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
      runtime.assetLoader,
      runtime.stateSync,
      runtime.animationService,
      runtime.interactionService,
      runtime.handService,
      runtime.wireframeService,
      runtime.lightingService,
      runtime.postProcessingService,
      cardsAdapter,
      gameActionsRef.current,
      boardInteractionRef.current,
    );

    ctrl.initFromR3f(ctx, controllerProps);
    ctrlRef.current = ctrl;
    onControllerReady?.(ctrl);

    return () => {
      ctrl.destroy();
      ctrlRef.current = null;
      onControllerReady?.(null);
    };
  }, [gl, scene, camera, runtime, cardsAdapter, onControllerReady]);

  useLayoutEffect(() => {
    ctrlRef.current?.applyViewportDimensions(viewportWidth, viewportHeight);
  }, [viewportWidth, viewportHeight]);

  useLayoutEffect(() => {
    ctrlRef.current?.refreshProps(controllerProps);
  }, [controllerProps]);

  const tree = (
    <Board3dControllerRefContext.Provider value={ctrlRef}>
      {onBoardFps ? <Board3dFpsBridge onFps={onBoardFps} /> : null}
      <Board3dShufflePreviewKey />
      <Board3dCameraRig clientId={controllerProps.clientId} topPlayer={controllerProps.topPlayer} />
      <Board3dLightingRig settings={lightingSettings} />
      <Suspense fallback={null}>
        <Board3dStaticScene bloomActive={bloomActive} />
      </Suspense>
      <group ref={worldRef}>
        <group ref={handRef} />
        <Board3dBoardCardsLayer stateSync={runtime.stateSync} />
        <Board3dPrizeLayer />
      </group>
      <Board3dFrameEffects
        stateSync={runtime.stateSync}
        boardInteraction={boardInteraction}
        bloom={lightingSettings.bloom}
      />
    </Board3dControllerRefContext.Provider>
  );

  if (bloomActive) {
    return <Selection>{tree}</Selection>;
  }

  return tree;
}
