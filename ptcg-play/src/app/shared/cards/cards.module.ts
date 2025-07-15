import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from '@ng-dnd/core';
import { DndMultiBackendModule } from '@ng-dnd/multi-backend';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { PokemonCardInfoPaneComponent } from './pokemon-card-info-pane/pokemon-card-info-pane.component';
import { CardComponent } from './card/card.component';
import { CardImagePopupComponent } from './card-image-popup/card-image-popup.component';
import { CardInfoListPopupComponent } from './card-info-list-popup/card-info-list-popup.component';
import { CardInfoPaneComponent } from './card-info-pane/card-info-pane.component';
import { CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardListPaneComponent } from './card-list-pane/card-list-pane.component';
import { CardListPopupComponent } from './card-list-popup/card-list-popup.component';
import { CardPlaceholderDirective } from './card-placeholder/card-placeholder.directive';
import { DropHighlightDirective } from './drop-highlight/drop-highlight.directive';
import { EnergyComponent } from './energy/energy.component';
import { ImageCacheModule } from '../image-cache/image-cache.module';
import { MaterialModule } from '../material.module';
import { TrainerTypeComponent } from './trainer-type/trainer-type.component';
import { HoverHighlightComponent } from './hover-highlight/hover-highlight.component';
import { ArchetypeComponent } from './archetype/archetype.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImageCacheModule,
    FormsModule,
    MaterialModule,
    DndMultiBackendModule,
    DndModule,
    TranslateModule,
    MatDialogModule
  ],
  declarations: [
    CardComponent,
    CardImagePopupComponent,
    CardInfoPaneComponent,
    CardInfoPopupComponent,
    CardListPaneComponent,
    CardListPopupComponent,
    CardPlaceholderDirective,
    ArchetypeComponent,
    EnergyComponent,
    DropHighlightDirective,
    TrainerTypeComponent,
    HoverHighlightComponent,
    CardInfoListPopupComponent,
    PokemonCardInfoPaneComponent
  ],
  entryComponents: [
    CardImagePopupComponent,
    CardInfoPopupComponent,
    CardInfoListPopupComponent,
    CardListPopupComponent
  ],
  exports: [
    CardComponent,
    CardPlaceholderDirective,
    EnergyComponent,
    ArchetypeComponent,
    DropHighlightDirective,
    PokemonCardInfoPaneComponent
  ]
})
export class CardsModule { }
