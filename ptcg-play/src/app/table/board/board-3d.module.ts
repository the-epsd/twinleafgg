import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board3dComponent } from './board-3d/board-3d.component';
import { Board3dAssetLoaderService } from './services/board-3d-asset-loader.service';
import { Board3dStateSyncService } from './services/board-3d-state-sync.service';
import { Board3dAnimationService } from './services/board-3d-animation.service';
import { Board3dInteractionService } from './services/board-3d-interaction.service';
import { Board3dHandService } from './services/board-3d-hand.service';

@NgModule({
  declarations: [
    Board3dComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    Board3dAssetLoaderService,
    Board3dStateSyncService,
    Board3dAnimationService,
    Board3dInteractionService,
    Board3dHandService
  ],
  exports: [
    Board3dComponent
  ]
})
export class Board3dModule { }
