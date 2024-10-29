import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, TrainerType, PokemonCard, TrainerCard } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';

import { CardImagePopupComponent } from '../card-image-popup/card-image-popup.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface CardInfoPaneOptions {
  enableAbility?: {
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
  };
  enableAttack?: boolean;
  enableTrainer?: boolean;
}

export interface CardInfoPaneAction {
  card: Card;
  attack?: string;
  ability?: string;
  trainer?: boolean;
}

@Component({
  selector: 'ptcg-card-info-pane',
  templateUrl: './card-info-pane.component.html',
  styleUrls: ['./card-info-pane.component.scss']
})
export class CardInfoPaneComponent implements OnChanges {

  @Input() card: Card;
  @Input() facedown: boolean;
  @Input() options: CardInfoPaneOptions = {};
  @Output() action = new EventEmitter<any>();

  public enabledAbilities: { [name: string]: boolean } = {};
  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public TrainerType = TrainerType;
  public heavilyPlayedUrl: SafeUrl;

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  public clickAction(action: CardInfoPaneAction) {
    action.card = this.card;
    this.action.next(action);
  }

  ngOnChanges() {
    // Build map of enabled powers
    if (this.options.enableAbility) {
      this.enabledAbilities = this.buildEnabledAbilities();
    }

    if (this.card) {
      let formattedSetNumber = this.card.setNumber;
      if (formattedSetNumber.length === 1) {
        formattedSetNumber = '00' + formattedSetNumber;
      } else if (formattedSetNumber.length === 2) {
        formattedSetNumber = '0' + formattedSetNumber;
      }
      const searchQuery = `${this.card.name} - ${formattedSetNumber}`;
      const encodedQuery = encodeURIComponent(searchQuery);
      this.heavilyPlayedUrl = this.sanitizer.bypassSecurityTrustUrl(`https://heavilyplayed.com/search/products?search=${encodedQuery}`);
    }
  }

  private buildEnabledAbilities(): { [name: string]: boolean } {
    const enabledAbilities: { [name: string]: boolean } = {};
    if (this.card && this.card.superType === SuperType.POKEMON || this.card.superType === SuperType.TRAINER) {
      const pokemonCard = this.card as PokemonCard;
      pokemonCard.powers.forEach(power => {
        if ((this.options.enableAbility.useWhenInPlay && power.useWhenInPlay)
          || (this.options.enableAbility.useFromDiscard && power.useFromDiscard)
          || (this.options.enableAbility.useFromHand && power.useFromHand)) {
          enabledAbilities[power.name] = true;
        }
      });
      const trainerCard = this.card as TrainerCard;
      trainerCard.powers.forEach(power => {
        if ((this.options.enableAbility.useWhenInPlay && power.useWhenInPlay)
          || (this.options.enableAbility.useFromDiscard && power.useFromDiscard)
          || (this.options.enableAbility.useFromHand && power.useFromHand)) {
          enabledAbilities[power.name] = true;
        }
      });
    }
    return enabledAbilities;
  }

  public showCardImage(card: Card, facedown: boolean): Promise<void> {
    const dialog = this.dialog.open(CardImagePopupComponent, {
      maxWidth: '100%',
      data: { card, facedown }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => false);
  }

}
