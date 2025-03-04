import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, PokemonCard, PokemonCardList, Attack, Power } from 'ptcg-server';
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

  public getMainCard(): Card {
    if (!this.cardList || this.cardList.cards.length === 0) {
      return null;
    }

    // Find the last Pokémon card in the list
    for (let i = this.cardList.cards.length - 1; i >= 0; i--) {
      const card = this.cardList.cards[i];
      if (card.superType === SuperType.POKEMON) {
        return card;
      }
    }

    return null;
  }

  public getAllAttachedCards(): Card[] {
    return this.cardList?.cards.slice(1) || [];
  }

  public getDisplayPowers(): Power[] {
    const mainCard = this.getMainCard() as PokemonCard;
    if (!mainCard) {
      return [];
    }

    let powers = [...(mainCard.powers || [])];

    if (this.cardList instanceof PokemonCardList && this.cardList.showAllStageAbilities) {
      // Show powers from all evolution stages
      for (const card of this.cardList.cards) {
        if (card.superType === SuperType.POKEMON && card !== mainCard) {
          powers = [...powers, ...(card.powers || [])];
        }
      }
    }

    // Add powers from tools and other cards that modify the Pokémon
    if (this.cardList) {
      for (const card of this.cardList.cards) {
        if (card.superType === SuperType.TRAINER && card !== mainCard) {
          powers = [...powers, ...(card.powers || [])];
        }
      }
    }

    return powers;
  }

  public getDisplayAttacks(): Attack[] {
    const mainCard = this.getMainCard() as PokemonCard;
    if (!mainCard) {
      return [];
    }

    let attacks = [...(mainCard.attacks || [])];

    if (this.cardList instanceof PokemonCardList && this.cardList.showAllStageAbilities) {
      // Show attacks from all evolution stages
      for (const card of this.cardList.cards) {
        if (card.superType === SuperType.POKEMON && card !== mainCard) {
          attacks = [...attacks, ...(card.attacks || [])];
        }
      }
    }

    // Add attacks from tools and other cards that modify the Pokémon
    if (this.cardList) {
      for (const card of this.cardList.cards) {
        if (card.superType === SuperType.TRAINER && card !== mainCard) {
          attacks = [...attacks, ...(card.attacks || [])];
        }
      }
    }

    return attacks;
  }

  getHpBonus(): number {
    if (!this.cardList || !(this.cardList instanceof PokemonCardList)) {
      return 0;
    }
    return this.cardList.hpBonus;
  }

  getCurrentHp(): number {
    if (!this.cardList || !(this.cardList instanceof PokemonCardList)) {
      return 0;
    }
    const mainCard = this.getMainCard() as PokemonCard;
    if (!mainCard) {
      return 0;
    }
    return mainCard.hp + this.getHpBonus() - this.cardList.damage;
  }

  getMaxHp(): number {
    const mainCard = this.getMainCard() as PokemonCard;
    if (!mainCard) {
      return 0;
    }
    return mainCard.hp + this.getHpBonus();
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