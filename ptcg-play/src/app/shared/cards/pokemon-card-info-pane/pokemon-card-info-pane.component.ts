import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, PokemonCard, PokemonCardList } from 'ptcg-server';
import { MatDialog } from '@angular/material/dialog';
import { CardImagePopupComponent } from '../card-image-popup/card-image-popup.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface PokemonCardInfoPaneOptions {
  enableAbility?: {
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
  };
  enableAttack?: boolean;
}

export interface PokemonCardInfoPaneAction {
  cardList: PokemonCardList;
  attack?: string;
  ability?: string;
}

@Component({
  selector: 'ptcg-pokemon-card-info-pane',
  templateUrl: './pokemon-card-info-pane.component.html',
  styleUrls: ['./pokemon-card-info-pane.component.scss']
})
export class PokemonCardInfoPaneComponent implements OnChanges {
  @Input() cardList: PokemonCardList;
  @Input() facedown: boolean;
  @Input() options: PokemonCardInfoPaneOptions = {};
  @Output() action = new EventEmitter<PokemonCardInfoPaneAction>();

  public enabledAbilities: { [name: string]: boolean } = {};
  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public heavilyPlayedUrl: SafeUrl;

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  public getMainCard(): PokemonCard {
    return this.cardList?.cards[0] as PokemonCard;
  }

  public getAllAttachedCards(): Card[] {
    return this.cardList?.cards.slice(1) || [];
  }

  public getDisplayPowers(): any[] {
    if (!this.cardList) {
      return [];
    }

    let powers: any[] = [];

    // Get powers from all cards in the list
    this.cardList.cards.forEach(card => {
      if (card.powers) {
        powers = powers.concat(card.powers);
      }
    });

    return powers;
  }

  public getDisplayAttacks(): any[] {
    if (!this.cardList) {
      return [];
    }

    let attacks: any[] = [];

    // Get attacks from all cards in the list
    this.cardList.cards.forEach(card => {
      if (card.attacks) {
        attacks = attacks.concat(card.attacks);
      }
    });

    return attacks;
  }

  public getCurrentHp(): number {
    if (!this.cardList) {
      return 0;
    }
    // Current HP is max HP minus damage
    return this.getMaxHp() - (this.cardList.damage || 0);
  }

  public getMaxHp(): number {
    if (!this.cardList) {
      return 0;
    }
    // Base HP plus any modifiers from tools/effects
    const baseHp = this.getMainCard()?.hp || 0;
    const hpBonus = this.cardList.hpBonus || 0;
    return baseHp + hpBonus;
  }

  public clickAction(action: any) {
    console.log('Action clicked:', action);
    // Emit the action with the cardList
    this.action.emit({
      ...action,
      cardList: this.cardList
    });
  }

  ngOnChanges() {
    console.log('PokemonCardInfoPane received:', {
      cardList: this.cardList,
      mainCard: this.getMainCard(),
      powers: this.getDisplayPowers(),
      attacks: this.getDisplayAttacks()
    });

    if (this.options.enableAbility) {
      this.enabledAbilities = this.buildEnabledAbilities();
    }

    const mainCard = this.getMainCard();
    if (mainCard) {
      let formattedSetNumber = mainCard.setNumber;
      if (formattedSetNumber.length === 1) {
        formattedSetNumber = '00' + formattedSetNumber;
      } else if (formattedSetNumber.length === 2) {
        formattedSetNumber = '0' + formattedSetNumber;
      }
      const searchQuery = `${mainCard.name} - ${formattedSetNumber}`;
      const encodedQuery = encodeURIComponent(searchQuery);
      this.heavilyPlayedUrl = this.sanitizer.bypassSecurityTrustUrl(
        `https://heavilyplayed.com/search/products?search=${encodedQuery}`
      );
    }
  }

  private buildEnabledAbilities(): { [name: string]: boolean } {
    const enabledAbilities: { [name: string]: boolean } = {};
    const powers = this.getDisplayPowers();

    powers.forEach(power => {
      if ((this.options.enableAbility.useWhenInPlay && power.useWhenInPlay)
        || (this.options.enableAbility.useFromDiscard && power.useFromDiscard)
        || (this.options.enableAbility.useFromHand && power.useFromHand)) {
        enabledAbilities[power.name] = true;
      }
    });

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