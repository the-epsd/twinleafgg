import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Card, PokemonCard, SuperType } from 'ptcg-server';
import { of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { DeckItem } from '../deck-card/deck-card.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ptcg-deck-card-dialog',
  templateUrl: './deck-card-dialog.component.html',
  styleUrls: ['./deck-card-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeckCardDialogComponent {

  cards$ = of(this.cardsBaseService.getCards());

  alternatePrintings$ = this.cards$.pipe(
    map(cards => cards.filter(c => c.name == this.data.card.name &&
      !(c.fullName === this.data.card.fullName && c.setNumber === this.data.card.setNumber)))
  );

  evolvesFrom$ = this.cards$.pipe(
    map(cards => cards.filter(c => c.name === (<PokemonCard>this.data.card).evolvesFrom)),
    shareReplay(1)
  );

  evolvesInto$ = this.cards$.pipe(
    map(cards => cards.filter(c => (<PokemonCard>c).evolvesFrom === this.data.card.name)),
    shareReplay(1)
  );

  constructor(
    public matDialogRef: MatDialogRef<DeckCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeckItem,
    private cardsBaseService: CardsBaseService) {
  }

  isPokemon(): boolean {
    return this.data.card.superType === SuperType.POKEMON;
  }

  onCardSelected(card: Card, action: 'add' | 'replace') {
    this.matDialogRef.close({ card, action });
  }
}