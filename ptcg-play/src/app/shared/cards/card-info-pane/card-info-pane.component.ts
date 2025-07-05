import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, TrainerType, PokemonCard, TrainerCard, PokemonCardList, EnergyCard } from 'ptcg-server';
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
  cardList?: PokemonCardList;
}

@Component({
  selector: 'ptcg-card-info-pane',
  templateUrl: './card-info-pane.component.html',
  styleUrls: ['./card-info-pane.component.scss']
})
export class CardInfoPaneComponent implements OnChanges {

  @Input() card: Card;
  @Input() facedown: boolean;
  @Input() cardList: PokemonCardList;
  @Input() options: CardInfoPaneOptions = {};
  @Output() action = new EventEmitter<CardInfoPaneAction>();

  public enabledAbilities: { [name: string]: boolean } = {};
  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public TrainerType = TrainerType;
  public heavilyPlayedUrl: SafeUrl;

  private characterNames = [
    "Marnie's",
    "Iono's",
    "Ethan's",
    "Steven's",
    "Cynthia's",
    "Arven's",
    "N's",
    "Hop's",
    "Team Rocket's"
  ];

  parseCardName(name: string): { prefix: string | null, rest: string } {
    for (const character of this.characterNames) {
      if (name.startsWith(character)) {
        return {
          prefix: character,
          rest: name.substring(character.length).trim()
        };
      }
    }
    return {
      prefix: null,
      rest: name
    };
  }

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  public clickAction(action: CardInfoPaneAction) {
    action.card = this.card;
    if (action.trainer) {
    }
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
    // For Pokemon, use all aggregated powers (including tools, evolutions)
    if (this.card && this.card.superType === SuperType.POKEMON) {
      const powers = this.getDisplayPowers();
      powers.forEach(power => {
        if ((this.options.enableAbility?.useWhenInPlay && power.useWhenInPlay)
          || (this.options.enableAbility?.useFromDiscard && power.useFromDiscard)
          || (this.options.enableAbility?.useFromHand && power.useFromHand)) {
          enabledAbilities[power.name] = true;
        }
      });
      return enabledAbilities;
    }
    // For Trainer and Energy, keep existing logic
    if (this.card && (this.card.superType === SuperType.TRAINER || this.card.superType === SuperType.ENERGY)) {
      const trainerCard = this.card as TrainerCard;
      trainerCard.powers.forEach(power => {
        if ((this.options.enableAbility?.useWhenInPlay && power.useWhenInPlay)
          || (this.options.enableAbility?.useFromDiscard && power.useFromDiscard)
          || (this.options.enableAbility?.useFromHand && power.useFromHand)) {
          enabledAbilities[power.name] = true;
        }
      });
      const energyCard = this.card as EnergyCard;
      energyCard.powers.forEach(power => {
        if ((this.options.enableAbility?.useWhenInPlay && power.useWhenInPlay)
          || (this.options.enableAbility?.useFromDiscard && power.useFromDiscard)
          || (this.options.enableAbility?.useFromHand && power.useFromHand)) {
          enabledAbilities[power.name] = true;
        }
      });
    }
    return enabledAbilities;
  }

  private energyImageMap: { [key: string]: string } = {
    'D': 'darkness',
    'Y': 'fairy',
    'F': 'fighting',
    'R': 'fire',
    'G': 'grass',
    'L': 'lightning',
    'M': 'metal',
    'P': 'psychic',
    'C': 'colorless',
    'W': 'water',
    'N': 'dragon'
  };

  transformEnergyText(text: string): string {
    return text.replace(/\[([WFYRGLPMDCN])\]/g, (match, type) =>
      `<img align="top" style="transform: translateY(12px)" src="assets/energy-icons/${this.energyImageMap[type]}.webp" alt="${this.energyImageMap[type]} Energy" width="18px">`
    );
  }

  public showCardImage(card: Card, facedown: boolean): Promise<void> {
    const dialog = this.dialog.open(CardImagePopupComponent, {
      maxWidth: '100%',
      data: { card, facedown, cardList: this.cardList }
    });

    return dialog.afterClosed().toPromise()
      .catch(() => false);
  }

  // Returns all relevant powers for display (main card, evolutions, tools)
  public getDisplayPowers(): any[] {
    if (!this.card) {
      return [];
    }
    if (this.card.superType === SuperType.POKEMON) {
      if (this.cardList && this.cardList.cards && this.cardList.cards.length > 0) {
        // Find the main card (top evolution, last Pokemon in the stack)
        const mainCard = this.cardList.cards.filter(c => c.superType === SuperType.POKEMON).slice(-1)[0] || this.card;
        let powers = [...(mainCard.powers || [])];
        // Only show all evolutions' powers if showAllStageAbilities is true
        if ((this.cardList as any).showAllStageAbilities) {
          for (const card of this.cardList.cards) {
            if (card.superType === SuperType.POKEMON && card !== mainCard) {
              powers = [...powers, ...(card.powers || [])];
            }
          }
        }
        // Add powers from attached trainers/tools
        for (const card of this.cardList.cards) {
          if (card.superType === SuperType.TRAINER) {
            powers = [...powers, ...(card.powers || [])];
          }
        }
        return powers;
      }
      // Fallback: just use the card's own powers
      return (this.card as any).powers || [];
    }
    // For Trainer and Energy, just return the card's own powers
    return (this.card as any).powers || [];
  }

  // Returns all relevant attacks for display (main card, evolutions, tools)
  public getDisplayAttacks(): any[] {
    if (!this.card) {
      return [];
    }
    if (this.card.superType === SuperType.POKEMON) {
      if (this.cardList && this.cardList.cards && this.cardList.cards.length > 0) {
        const mainCard = this.cardList.cards.filter(c => c.superType === SuperType.POKEMON).slice(-1)[0] || this.card;
        let attacks = [...(mainCard.attacks || [])];
        if ((this.cardList as any).showAllStageAbilities) {
          for (const card of this.cardList.cards) {
            if (card.superType === SuperType.POKEMON && card !== mainCard) {
              attacks = [...attacks, ...(card.attacks || [])];
            }
          }
        }
        for (const card of this.cardList.cards) {
          if (card.superType === SuperType.TRAINER) {
            attacks = [...attacks, ...(card.attacks || [])];
          }
        }
        return attacks;
      }
      return (this.card as any).attacks || [];
    }
    // For Trainer and Energy, just return the card's own attacks
    return (this.card as any).attacks || [];
  }

}
