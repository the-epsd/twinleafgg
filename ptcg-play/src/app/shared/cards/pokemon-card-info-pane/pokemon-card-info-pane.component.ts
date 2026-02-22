import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, PokemonCard, PokemonCardList, Attack, Power, CardType, EnergyCard, Player } from 'ptcg-server';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CardImagePopupComponent } from '../card-image-popup/card-image-popup.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BoardInteractionService } from '../../services/board-interaction.service';

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
  @Input() player: any; // Player object from the game state
  @Input() players: Player[] = [];
  @Output() action = new EventEmitter<PokemonCardInfoPaneAction>();

  public enabledAbilities: { [name: string]: boolean } = {};
  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public isSelectionMode = false;

  // Track available energy types to determine if attack costs are met
  private availableEnergy: { [key in CardType]?: number } = {};

  constructor(
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private boardInteractionService: BoardInteractionService
  ) {
    // Subscribe to selection mode changes
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      this.isSelectionMode = mode;
    });
  }

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

    // Cap the HP bonus at a reasonable value to prevent excessive values
    // Most HP boosting cards in the game add between 10-50 HP
    const MAX_REASONABLE_HP_BONUS = 100;

    // If the bonus seems too high, return a capped value
    if (this.cardList.hpBonus > MAX_REASONABLE_HP_BONUS) {
      return MAX_REASONABLE_HP_BONUS;
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
    // If we're in selection mode, don't handle the click
    if (this.isSelectionMode) {
      return;
    }
    // Emit the action with the cardList
    this.action.emit({
      ...action,
      cardList: this.cardList
    });
  }

  ngOnChanges() {
    if (this.options.enableAbility) {
      this.enabledAbilities = this.buildEnabledAbilities();
    }

    // Count available energy on the Pokemon
    this.countAvailableEnergy();

    const mainCard = this.getMainCard();
    if (mainCard) {
      let formattedSetNumber = mainCard.setNumber;
      if (formattedSetNumber.length === 1) {
        formattedSetNumber = '00' + formattedSetNumber;
      } else if (formattedSetNumber.length === 2) {
        formattedSetNumber = '0' + formattedSetNumber;
      }
    }
  }

  // Count available energy for this Pokemon
  private countAvailableEnergy() {
    this.availableEnergy = {};

    if (!this.cardList) {
      return;
    }

    // Only use the provides property from energy cards
    for (const card of this.cardList.cards) {
      if (card.superType === SuperType.ENERGY) {
        const energyCard = card as EnergyCard;

        // Add each energy type provided by the card
        if (energyCard.provides && energyCard.provides.length > 0) {
          for (const energyType of energyCard.provides) {
            this.availableEnergy[energyType] = (this.availableEnergy[energyType] || 0) + 1;
          }
        }
      }
    }

    // Also count Pokemon cards used as energy (count them as colorless)
    if (this.cardList.energies && this.cardList.energies.cards && this.cardList.energies.cards.length > 0) {
      this.availableEnergy[CardType.COLORLESS] = (this.availableEnergy[CardType.COLORLESS] || 0) + this.cardList.energies.cards.length;
    }
  }

  // Check if an attack cost is met
  public hasEnoughEnergyForAttack(attack: Attack): boolean {
    if (!attack || !attack.cost || attack.cost.length === 0) {
      return true;
    }

    // Create a copy of available energy to work with
    const availableEnergy: { [key in CardType]?: number } = { ...this.availableEnergy };

    // Count required energy by type
    const attackCost: { [key in CardType]?: number } = {};
    let colorlessCount = 0;

    for (const type of attack.cost) {
      if (type === CardType.COLORLESS) {
        colorlessCount++;
      } else {
        attackCost[type] = (attackCost[type] || 0) + 1;
      }
    }

    // First, check specific type requirements
    for (const type in attackCost) {
      const requiredAmount = attackCost[type as unknown as CardType];
      const availableAmount = availableEnergy[type as unknown as CardType] || 0;

      if (availableAmount >= requiredAmount) {
        // We have enough of this type, subtract what we used
        availableEnergy[type as unknown as CardType] = availableAmount - requiredAmount;
      } else {
        // Try to use rainbow/special energy
        const deficit = requiredAmount - availableAmount;
        const anyAvailable = availableEnergy[CardType.ANY] || 0;

        if (anyAvailable >= deficit) {
          // Use special energy to cover the deficit
          availableEnergy[type as unknown as CardType] = 0;
          availableEnergy[CardType.ANY] = anyAvailable - deficit;
        } else {
          return false; // Not enough energy for specific requirements
        }
      }
    }

    // Then, check colorless requirements (any energy type can be used)
    if (colorlessCount > 0) {
      let totalRemaining = 0;

      // Count all remaining energy
      for (const type in availableEnergy) {
        totalRemaining += availableEnergy[type as unknown as CardType] || 0;
      }

      return totalRemaining >= colorlessCount;
    }

    return true;
  }

  // Check if a specific energy type is missing for an attack
  public isEnergyTypeMissing(attack: Attack, type: CardType, index?: number): boolean {
    if (!attack || !attack.cost || attack.cost.length === 0) {
      return false;
    }

    // Create a copy of available energy to work with
    const availableEnergy: { [key in CardType]?: number } = { ...this.availableEnergy };

    // Quick check - if we have no energy at all and this is a cost, return true (it's missing)
    const totalAvailableEnergy = Object.values(availableEnergy).reduce((sum, count) => sum + count, 0);
    if (totalAvailableEnergy === 0 && attack.cost.length > 0) {
      return true;
    }

    // For colorless energy, we need to determine which specific energy symbol
    // is missing based on the index
    if (type === CardType.COLORLESS) {
      // Count specific type energy costs and check them first
      const specificCosts: { [key in CardType]?: number } = {};
      let colorlessIndexes: number[] = [];

      // Identify specific type costs and colorless indexes
      attack.cost.forEach((costType, i) => {
        if (costType === CardType.COLORLESS) {
          colorlessIndexes.push(i);
        } else {
          specificCosts[costType] = (specificCosts[costType] || 0) + 1;
        }
      });

      // Check if we have enough specific energy
      for (const costType in specificCosts) {
        const needed = specificCosts[costType as unknown as CardType];
        const available = availableEnergy[costType as unknown as CardType] || 0;

        // If enough specific energy, subtract it
        if (available >= needed) {
          availableEnergy[costType as unknown as CardType] = available - needed;
        } else {
          // Not enough specific, try to use special energy
          const deficit = needed - available;
          const specialEnergy = availableEnergy[CardType.ANY] || 0;

          if (specialEnergy >= deficit) {
            availableEnergy[CardType.ANY] = specialEnergy - deficit;
            availableEnergy[costType as unknown as CardType] = 0;
          } else {
            // Not enough even with special energy
            // Some specific energy requirements can't be met
            return true;
          }
        }
      }

      // Now check colorless energy requirements
      if (index !== undefined && colorlessIndexes.includes(index)) {
        // Calculate the position of this colorless energy in the colorless requirements
        const colorlessPosition = colorlessIndexes.indexOf(index);
        let totalRemainingEnergy = 0;

        // Count remaining energy after specific requirements
        for (const energyType in availableEnergy) {
          totalRemainingEnergy += availableEnergy[energyType as unknown as CardType] || 0;
        }

        // Check if there's enough energy for colorless requirements up to this position
        return totalRemainingEnergy < colorlessPosition + 1;
      }

      return false;
    } else {
      // For specific types, count how many of this type are required
      const typeRequired = attack.cost.filter(t => t === type).length;

      if (typeRequired === 0) {
        return false;
      }

      // Count specific position
      if (index !== undefined) {
        // Count occurrences of this type up to this index
        const typeOccurrences = attack.cost.slice(0, index + 1).filter(t => t === type).length;
        const position = attack.cost.indexOf(type) === index ? 1 : typeOccurrences;

        // Check if we have enough specific energy for this position
        const typeAvailable = availableEnergy[type] || 0;
        const anyAvailable = availableEnergy[CardType.ANY] || 0;

        return typeAvailable + anyAvailable < position;
      }

      // Default check for the type as a whole
      const typeAvailable = availableEnergy[type] || 0;
      const anyAvailable = availableEnergy[CardType.ANY] || 0;

      return typeAvailable + anyAvailable < typeRequired;
    }
  }

  private isKlefkiActive(): boolean {
    if (!this.players || this.players.length === 0) {
      return false;
    }
    for (const player of this.players) {
      const activePokemon = player?.active?.getPokemonCard?.();
      if (activePokemon && activePokemon.name === 'Klefki') {
        return true;
      }
    }
    return false;
  }

  private buildEnabledAbilities(): { [name: string]: boolean } {
    const enabledAbilities: { [name: string]: boolean } = {};
    const powers = this.getDisplayPowers();

    const mainCard = this.getMainCard() as PokemonCard;
    const isBasicPokemon = mainCard && mainCard.stage === Stage.BASIC;
    const klefkiActive = this.isKlefkiActive();

    powers.forEach(power => {
      if ((this.options.enableAbility?.useWhenInPlay && power.useWhenInPlay)
        || (this.options.enableAbility?.useFromDiscard && power.useFromDiscard)
        || (this.options.enableAbility?.useFromHand && power.useFromHand)) {
        // If Klefki is active and this is a Basic Pokemon, only allow Mischievous Lock ability
        if (klefkiActive && isBasicPokemon && power.useWhenInPlay && power.powerType === PowerType.ABILITY) {
          if (power.name === 'Mischievous Lock') {
            enabledAbilities[power.name] = true;
          }
        } else {
          enabledAbilities[power.name] = true;
        }
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

  getFormattedStage(stage: Stage): string {
    switch (stage) {
      case Stage.BASIC:
        return 'Basic';
      case Stage.STAGE_1:
        return 'Stage 1';
      case Stage.STAGE_2:
        return 'Stage 2';
      case Stage.BREAK:
        return 'BREAK';
      case Stage.RESTORED:
        return 'Restored';
      case Stage.VMAX:
        return 'VMAX';
      case Stage.VSTAR:
        return 'VSTAR';
      default:
        return Stage[stage] || '';
    }
  }
}