import type { Board3dCardsAdapter } from './board3dCardsAdapter';
import { Board3dAnimationService } from './services/board-3d-animation.service';
import { Board3dAssetLoaderService } from './services/board-3d-asset-loader.service';
import { Board3dCardOverlayService } from './services/board-3d-card-overlay.service';
import { Board3dHandService } from './services/board-3d-hand.service';
import { Board3dInteractionService } from './services/board-3d-interaction.service';
import { Board3dLightingService } from './services/board-3d-lighting.service';
import { Board3dPostProcessingService } from './services/board-3d-post-processing.service';
import { Board3dPrizeService } from './services/board-3d-prize.service';
import { Board3dStackService } from './services/board-3d-stack.service';
import { Board3dStateSyncService } from './services/board-3d-state-sync.service';
import { Board3dWireframeService } from './services/board-3d-wireframe.service';

export type Board3dRuntime = {
  assetLoader: Board3dAssetLoaderService;
  stateSync: Board3dStateSyncService;
  animationService: Board3dAnimationService;
  interactionService: Board3dInteractionService;
  handService: Board3dHandService;
  wireframeService: Board3dWireframeService;
  lightingService: Board3dLightingService;
  postProcessingService: Board3dPostProcessingService;
};

export function createBoard3dRuntime(cardsAdapter: Board3dCardsAdapter): Board3dRuntime {
  const assetLoader = new Board3dAssetLoaderService();
  const animationService = new Board3dAnimationService();
  const stackService = new Board3dStackService(assetLoader, cardsAdapter);
  const prizeService = new Board3dPrizeService(stackService);
  const overlayService = new Board3dCardOverlayService(assetLoader, cardsAdapter);
  const stateSync = new Board3dStateSyncService(
    assetLoader,
    cardsAdapter,
    animationService,
    overlayService,
    stackService,
    prizeService,
  );
  const handService = new Board3dHandService(assetLoader, cardsAdapter);
  const interactionService = new Board3dInteractionService(assetLoader, stateSync, handService);
  const wireframeService = new Board3dWireframeService();
  const lightingService = new Board3dLightingService();
  const postProcessingService = new Board3dPostProcessingService();

  return {
    assetLoader,
    stateSync,
    animationService,
    interactionService,
    handService,
    wireframeService,
    lightingService,
    postProcessingService,
  };
}
