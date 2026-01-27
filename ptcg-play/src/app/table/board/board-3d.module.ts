import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Board3dComponent } from './board-3d/board-3d.component';
import { Board3dStatsComponent } from './board-3d/board-3d-stats/board-3d-stats.component';
import { Board3dAssetLoaderService } from './services/board-3d-asset-loader.service';
import { Board3dStateSyncService } from './services/board-3d-state-sync.service';
import { Board3dAnimationService } from './services/board-3d-animation.service';
import { Board3dInteractionService } from './services/board-3d-interaction.service';
import { Board3dHandService } from './services/board-3d-hand.service';
import { Board3dWireframeService } from './services/board-3d-wireframe.service';
import { Board3dCardOverlayService } from './services/board-3d-card-overlay.service';
import { Board3dStackService } from './services/board-3d-stack.service';
import { Board3dPrizeService } from './services/board-3d-prize.service';
import { Board3dLightingService } from './services/board-3d-lighting.service';
import { Board3dPostProcessingService } from './services/board-3d-post-processing.service';

@NgModule({
  declarations: [
    Board3dComponent,
    Board3dStatsComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    Board3dAssetLoaderService,
    Board3dStateSyncService,
    Board3dAnimationService,
    Board3dInteractionService,
    Board3dHandService,
    Board3dWireframeService,
    Board3dCardOverlayService,
    Board3dStackService,
    Board3dPrizeService,
    Board3dLightingService,
    Board3dPostProcessingService
  ],
  exports: [
    Board3dComponent
  ]
})
export class Board3dModule { }
