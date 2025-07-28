import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, TrainerType, PokemonCard, TrainerCard, PokemonCardList, EnergyCard, CardTag } from 'ptcg-server';
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

// Helper type guards for computedHp and hp
function hasComputedHp(obj: any): obj is { computedHp: number } {
  return obj && typeof obj.computedHp === 'number';
}
function hasHp(obj: any): obj is { hp: number | string } {
  return obj && (typeof obj.hp === 'number' || typeof obj.hp === 'string');
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
  public CardTag = CardTag;
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

    // Check if this card is a tool attached to a different Pokémon
    const tools = (this.cardList as any)?.tools || [];
    const isToolCard = tools.includes(this.card);

    // For Pokemon, use all aggregated powers (including tools, evolutions)
    if (this.card && this.card.superType === SuperType.POKEMON) {
      // If this is a Pokémon tool, disable all abilities
      if (isToolCard) {
        return enabledAbilities; // Return empty object - no abilities enabled
      }

      // Check if we're viewing a specific card from the evolution chain
      const isViewingSpecificCard = this.cardList && this.cardList.cards && this.cardList.cards.includes(this.card);

      if (isViewingSpecificCard) {
        // If viewing a specific card in the evolution chain, enable its own abilities plus tool abilities
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
      // Check if this card is a tool attached to a different Pokémon
      const tools = (this.cardList as any)?.tools || [];
      const isToolCard = tools.includes(this.card);

      if (isToolCard) {
        // If this card is a tool, just show its own powers
        return (this.card as any).powers || [];
      }

      if (this.cardList && this.cardList.cards && this.cardList.cards.length > 0) {
        // Check if we're viewing a specific card from the evolution chain
        const isViewingSpecificCard = this.cardList.cards.includes(this.card);

        if (isViewingSpecificCard) {
          // If viewing a specific card in the evolution chain, show its own powers plus any tool powers
          let powers = [...(this.card.powers || [])];

          // Add powers from tool cards in the tools array, if present
          for (const tool of tools) {
            if (tool.powers && tool.powers.length > 0) {
              // Only add powers that are not fossils and not from Pokémon tools
              const nonFossilPowers = tool.powers.filter(power => !power.isFossil);
              // Exclude Pokémon cards from tools (like Unown Q, Shedinja, etc.)
              if (tool.superType !== SuperType.POKEMON) {
                powers = [...powers, ...nonFossilPowers];
              }
            }
          }
          return powers;
        }

        // Find the main card (top evolution, last Pokemon in the stack)
        // Exclude cards that are in the tools array to avoid treating attached Pokémon tools as main cards
        const mainCard = this.cardList.cards.filter(c =>
          c.superType === SuperType.POKEMON && !tools.includes(c)
        ).slice(-1)[0] || this.card;
        let powers = [...(mainCard.powers || [])];
        // Only show all evolutions' powers if showAllStageAbilities is true
        if ((this.cardList as any).showAllStageAbilities) {
          for (const card of this.cardList.cards) {
            if (card.superType === SuperType.POKEMON && card !== mainCard && !tools.includes(card)) {
              powers = [...powers, ...(card.powers || [])];
            }
          }
        }
        // Add powers from attached trainers/tools
        for (const card of this.cardList.cards) {
          if (card.superType === SuperType.TRAINER) {
            // Only add powers that are not fossils
            const nonFossilPowers = (card.powers || []).filter(power => !power.isFossil);
            powers = [...powers, ...nonFossilPowers];
          }
        }
        // Add powers from tool cards in the tools array, if present
        for (const tool of tools) {
          if (tool.powers && tool.powers.length > 0) {
            // Only add powers that are not fossils and not from Pokémon tools
            const nonFossilPowers = tool.powers.filter(power => !power.isFossil);
            // Exclude Pokémon cards from tools (like Unown Q, Shedinja, etc.)
            if (tool.superType !== SuperType.POKEMON) {
              powers = [...powers, ...nonFossilPowers];
            }
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
      // Check if this card is a tool attached to a different Pokémon
      const tools = (this.cardList as any)?.tools || [];
      const isToolCard = tools.includes(this.card);

      if (isToolCard) {
        // If this card is a tool, just show its own attacks
        return (this.card as any).attacks || [];
      }

      if (this.cardList && this.cardList.cards && this.cardList.cards.length > 0) {
        // Check if we're viewing a specific card from the evolution chain
        const isViewingSpecificCard = this.cardList.cards.includes(this.card);

        if (isViewingSpecificCard) {
          // If viewing a specific card in the evolution chain, show its own attacks plus any tool attacks
          let attacks = [...(this.card.attacks || [])];

          // Add attacks from tool cards in the tools array, if present
          for (const tool of tools) {
            if (tool.attacks && tool.attacks.length > 0) {
              // Exclude Pokémon cards from tools (like Unown Q, Shedinja, etc.)
              if (tool.superType !== SuperType.POKEMON) {
                attacks = [...attacks, ...tool.attacks];
              }
            }
          }
          return attacks;
        }

        // Exclude cards that are in the tools array to avoid treating attached Pokémon tools as main cards
        const mainCard = this.cardList.cards.filter(c =>
          c.superType === SuperType.POKEMON && !tools.includes(c)
        ).slice(-1)[0] || this.card;
        let attacks = [...(mainCard.attacks || [])];
        if ((this.cardList as any).showAllStageAbilities) {
          for (const card of this.cardList.cards) {
            if (card.superType === SuperType.POKEMON && card !== mainCard && !tools.includes(card)) {
              attacks = [...attacks, ...(card.attacks || [])];
            }
          }
        }
        for (const card of this.cardList.cards) {
          if (card.superType === SuperType.TRAINER) {
            attacks = [...attacks, ...(card.attacks || [])];
          }
        }
        // Add attacks from tool cards in the tools array, if present
        for (const tool of tools) {
          if (tool.attacks && tool.attacks.length > 0) {
            // Exclude Pokémon cards from tools (like Unown Q, Shedinja, etc.)
            if (tool.superType !== SuperType.POKEMON) {
              attacks = [...attacks, ...tool.attacks];
            }
          }
        }
        return attacks;
      }
      return (this.card as any).attacks || [];
    }
    // For Trainer and Energy, just return the card's own attacks
    return (this.card as any).attacks || [];
  }

  public getComputedHp(): number | null {
    if (!this.card || this.card.superType !== SuperType.POKEMON) return null;
    // Prefer computedHp from cardList, fallback to card.hp
    if (this.cardList && hasComputedHp(this.cardList)) {
      return this.cardList.computedHp;
    }
    if (hasHp(this.card)) {
      return Number(this.card.hp) || 0;
    }
    return 0;
  }

  public getCurrentHp(): number | null {
    const computedHp = this.getComputedHp();
    const damage = (this.cardList && typeof this.cardList.damage === 'number') ? this.cardList.damage : 0;
    return computedHp !== null ? Math.max(0, computedHp - damage) : null;
  }

  public shouldEnableAttacks(): boolean {
    // Check if this card is a tool attached to a different Pokémon
    const tools = (this.cardList as any)?.tools || [];
    const isToolCard = tools.includes(this.card);

    // If this is a Pokémon tool, disable attacks
    if (this.card && this.card.superType === SuperType.POKEMON && isToolCard) {
      return false;
    }

    // Check if we're viewing a specific card from the evolution chain
    const isViewingSpecificCard = this.cardList && this.cardList.cards && this.cardList.cards.includes(this.card);

    if (isViewingSpecificCard) {
      // If viewing a specific card in the evolution chain, enable attacks if the card or its tools have attacks
      const attacks = this.getDisplayAttacks();
      return this.options.enableAttack && attacks.length > 0;
    }

    return this.options.enableAttack || false;
  }

}
