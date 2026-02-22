import { Component, OnChanges, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Card, SuperType, Stage, PowerType, EnergyType, TrainerType, TrainerCard, PokemonCardList, EnergyCard, CardTag, PokemonCard, Player } from 'ptcg-server';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { CardImagePopupComponent } from '../card-image-popup/card-image-popup.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SettingsService } from '../../../table/table-sidebar/settings-dialog/settings.service';
import { CardsBaseService } from '../cards-base.service';
import { CardSwapDialogComponent } from '../card-swap-dialog/card-swap-dialog.component';

export interface CardInfoPaneOptions {
  enableAbility?: {
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
  };
  enableAttack?: boolean;
  enableTrainer?: boolean;
  enableRetreat?: boolean;
}

export interface CardInfoPaneAction {
  card: Card;
  attack?: string;
  ability?: string;
  trainer?: boolean;
  retreat?: boolean;
  cardList?: PokemonCardList;
}

function hasHp(obj: any): obj is { hp: number | string } {
  return obj && (typeof obj.hp === 'number' || typeof obj.hp === 'string');
}

function hasHpBonus(obj: any): obj is { hpBonus: number } {
  return obj && typeof obj.hpBonus === 'number';
}
@Component({
  selector: 'ptcg-card-info-pane',
  templateUrl: './card-info-pane.component.html',
  styleUrls: ['./card-info-pane.component.scss']
})
export class CardInfoPaneComponent implements OnChanges, OnDestroy {

  @Input() card: Card;
  @Input() facedown: boolean;
  @Input() cardList: PokemonCardList;
  @Input() options: CardInfoPaneOptions = {};
  @Input() players: Player[] = [];
  @Output() action = new EventEmitter<CardInfoPaneAction>();
  @Output() cardSwap = new EventEmitter<{ originalCard: Card, replacementCard: Card }>();

  public enabledAbilities: { [name: string]: boolean } = {};
  public showTags = false;
  public cardTextKerning = 0;
  public SuperType = SuperType;
  public Stage = Stage;
  public PowerType = PowerType;
  public EnergyType = EnergyType;
  public TrainerType = TrainerType;
  public CardTag = CardTag;

  private subscriptions: Subscription[] = [];

  // Constants for better maintainability
  private readonly SET_NUMBER_PADDING = {
    SINGLE_DIGIT: '00',
    DOUBLE_DIGIT: '0'
  };

  private readonly ENERGY_ICON_SIZE = '18px';
  private readonly ENERGY_ICON_TRANSFORM = 'translateY(12px)';

  private characterNames = [
    "Marnie's",
    "Iono's",
    "Ethan's",
    "Steven's",
    "Cynthia's",
    "Arven's",
    "N's",
    "Hop's",
    "Team Rocket's",
    "Lillie's",
    "Larry's",
    "Misty's",
    "Brock's",
    "Blaine's",
    "Erika's",
    "Giovanni's",
    "Lt. Surge's",
    "Rocket's",
    "Sabrina's",
    "Koga's"
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
    private sanitizer: DomSanitizer,
    private settingsService: SettingsService,
    private router: Router,
    private cardsBaseService: CardsBaseService
  ) {
    this.subscriptions.push(
      this.settingsService.showTags$.subscribe(showTags => {
        this.showTags = showTags;
      })
    );
    this.subscriptions.push(
      this.settingsService.cardTextKerning$.subscribe(kerning => {
        this.cardTextKerning = kerning;
      })
    );
  }

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
        formattedSetNumber = this.SET_NUMBER_PADDING.SINGLE_DIGIT + formattedSetNumber;
      } else if (formattedSetNumber.length === 2) {
        formattedSetNumber = this.SET_NUMBER_PADDING.DOUBLE_DIGIT + formattedSetNumber;
      }
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

    // Check if this card is a tool attached to a different Pokémon
    const tools = (this.cardList as any)?.tools || [];
    const isToolCard = tools.includes(this.card);

    // For Pokemon, use all aggregated powers (including tools, evolutions)
    if (this.card && this.card.superType === SuperType.POKEMON) {
      // If this is a Pokémon tool, disable all abilities
      if (isToolCard) {
        return enabledAbilities; // Return empty object - no abilities enabled
      }

      const pokemonCard = this.card as PokemonCard;
      const isBasicPokemon = pokemonCard.stage === Stage.BASIC;
      const klefkiActive = this.isKlefkiActive();

      // Check if we're viewing a specific card from the evolution chain
      const isViewingSpecificCard = this.cardList && this.cardList.cards && this.cardList.cards.includes(this.card);

      if (isViewingSpecificCard) {
        // If viewing a specific card in the evolution chain, enable its own abilities plus tool abilities
        const powers = this.getDisplayPowers();
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

      const powers = this.getDisplayPowers();
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
      `<img align="top" style="transform: ${this.ENERGY_ICON_TRANSFORM}" src="assets/energy-icons/${this.energyImageMap[type]}.webp" alt="${this.energyImageMap[type]} Energy" width="${this.ENERGY_ICON_SIZE}">`
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

  // Helper methods to reduce code duplication
  private isToolCard(): boolean {
    const tools = (this.cardList as any)?.tools || [];
    return tools.includes(this.card);
  }

  private isViewingSpecificCard(): boolean {
    return this.cardList && this.cardList.cards && this.cardList.cards.includes(this.card);
  }

  private getMainCard(): Card {
    const tools = (this.cardList as any)?.tools || [];
    return this.cardList.cards.filter(c =>
      c.superType === SuperType.POKEMON && !tools.includes(c)
    ).slice(-1)[0] || this.card;
  }

  private shouldShowAllStageAbilities(): boolean {
    return (this.cardList as any)?.showAllStageAbilities || false;
  }

  private addToolPowers(powers: any[], excludePokemon: boolean = true): any[] {
    const tools = (this.cardList as any)?.tools || [];
    for (const tool of tools) {
      if (tool.powers && tool.powers.length > 0) {
        const nonFossilPowers = tool.powers.filter(power => !power.isFossil);
        if (!excludePokemon || tool.superType !== SuperType.POKEMON) {
          powers = [...powers, ...nonFossilPowers];
        }
      }
    }
    return powers;
  }

  private addToolAttacks(attacks: any[], excludePokemon: boolean = true): any[] {
    const tools = (this.cardList as any)?.tools || [];
    for (const tool of tools) {
      if (tool.attacks && tool.attacks.length > 0) {
        if (!excludePokemon || tool.superType !== SuperType.POKEMON) {
          attacks = [...attacks, ...tool.attacks];
        }
      }
    }
    return attacks;
  }

  // Returns all relevant powers for display (main card, evolutions, tools)
  public getDisplayPowers(): any[] {
    if (!this.card) {
      return [];
    }
    if (this.card.superType === SuperType.POKEMON) {
      if (this.isToolCard()) {
        // If this card is a tool, just show its own powers
        return (this.card as any).powers || [];
      }

      if (this.cardList && this.cardList.cards && this.cardList.cards.length > 0) {
        if (this.isViewingSpecificCard()) {
          // If viewing a specific card in the evolution chain, show its own powers plus any tool powers
          let powers = [...(this.card.powers || [])];
          return this.addToolPowers(powers);
        }

        // Find the main card (top evolution, last Pokemon in the stack)
        const mainCard = this.getMainCard();
        let powers = [...(mainCard.powers || [])];

        // Only show all evolutions' powers if showAllStageAbilities is true
        if (this.shouldShowAllStageAbilities()) {
          const tools = (this.cardList as any)?.tools || [];
          for (const card of this.cardList.cards) {
            if (card.superType === SuperType.POKEMON && card !== mainCard && !tools.includes(card)) {
              powers = [...powers, ...(card.powers || [])];
            }
          }
        }

        // Add powers from attached trainers/tools
        for (const card of this.cardList.cards) {
          if (card.superType === SuperType.TRAINER) {
            const nonFossilPowers = (card.powers || []).filter(power => !power.isFossil);
            powers = [...powers, ...nonFossilPowers];
          }
        }

        return this.addToolPowers(powers);
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
      if (this.isToolCard()) {
        // If this card is a tool, just show its own attacks
        return (this.card as any).attacks || [];
      }

      if (this.cardList && this.cardList.cards && this.cardList.cards.length > 0) {
        if (this.isViewingSpecificCard()) {
          // If viewing a specific card in the evolution chain, show its own attacks plus any tool attacks
          let attacks = [...(this.card.attacks || [])];
          return this.addToolAttacks(attacks);
        }

        const mainCard = this.getMainCard();
        let attacks = [...(mainCard.attacks || [])];

        if (this.shouldShowAllStageAbilities()) {
          const tools = (this.cardList as any)?.tools || [];
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

        return this.addToolAttacks(attacks);
      }
      return (this.card as any).attacks || [];
    }
    // For Trainer and Energy, just return the card's own attacks
    return (this.card as any).attacks || [];
  }

  public getComputedHp(): number | null {
    if (!this.card || this.card.superType !== SuperType.POKEMON) return null;
    // Prefer computedHp from cardList, fallback to card.hp
    var hp: number = 0;
    if (hasHp(this.card)) {
      hp = Number(this.card.hp) || 0;
    }
    if (hasHpBonus(this.cardList)) {
      hp += this.cardList.hpBonus || 0;
    }
    return hp;
  }

  public getCurrentHp(): number | null {
    const computedHp = this.getComputedHp();
    const damage = (this.cardList && typeof this.cardList.damage === 'number') ? this.cardList.damage : 0;
    return computedHp !== null ? Math.max(0, computedHp - damage) : null;
  }

  public shouldEnableAttacks(): boolean {
    // If this is a Pokémon tool, disable attacks
    if (this.card && this.card.superType === SuperType.POKEMON && this.isToolCard()) {
      return false;
    }

    if (this.isViewingSpecificCard()) {
      // If viewing a specific card in the evolution chain, enable attacks if the card or its tools have attacks
      const attacks = this.getDisplayAttacks();
      return this.options.enableAttack && attacks.length > 0;
    }

    return this.options.enableAttack || false;
  }

  public shouldEnableRetreat(): boolean {
    return !!(this.card?.superType === SuperType.POKEMON && this.options.enableRetreat);
  }

  public getDisplayTags(): string[] {
    if (!this.showTags || !this.card || this.card.superType !== SuperType.POKEMON) {
      return [];
    }

    const pokemonCard = this.card as any;
    return pokemonCard.tags || [];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public isInGame(): boolean {
    return this.router.url.includes('/table');
  }

  public getCardsWithSameName(): Card[] {
    if (!this.card) {
      return [];
    }
    return this.cardsBaseService.getCards().filter(c =>
      c.name === this.card.name && c.fullName !== this.card.fullName
    );
  }

  public getEvolutionCards(): { preEvolutions: Card[], evolutions: Card[] } {
    if (!this.card || this.card.superType !== SuperType.POKEMON) {
      return { preEvolutions: [], evolutions: [] };
    }

    const pokemonCard = this.card as PokemonCard;
    const allCards = this.cardsBaseService.getCards();

    const preEvolutions = allCards.filter(c => {
      if (c.superType !== SuperType.POKEMON) return false;
      const cPokemon = c as PokemonCard;
      return cPokemon.evolvesFrom === this.card.name ||
        (cPokemon.evolvesTo && cPokemon.evolvesTo.includes(this.card.name));
    });

    const evolutions = allCards.filter(c => {
      if (c.superType !== SuperType.POKEMON) return false;
      const cPokemon = c as PokemonCard;
      return cPokemon.name === pokemonCard.evolvesFrom ||
        (pokemonCard.evolvesTo && pokemonCard.evolvesTo.includes(cPokemon.name));
    });

    return { preEvolutions, evolutions };
  }

  public async openCardSwapDialog(): Promise<void> {
    const cardsWithSameName = this.getCardsWithSameName();
    if (cardsWithSameName.length === 0) {
      return;
    }

    const dialog = this.dialog.open(CardSwapDialogComponent, {
      maxWidth: '95vw',
      width: 'min(1200px, 90vw)',
      data: {
        currentCard: this.card,
        alternativeCards: cardsWithSameName
      }
    });

    const result = await dialog.afterClosed().toPromise();
    if (result && result.selectedCard) {
      this.onCardSwap(result.selectedCard);
    }
  }

  public onCardSwap(replacementCard: Card): void {
    if (this.card && replacementCard) {
      this.cardSwap.emit({
        originalCard: this.card,
        replacementCard: replacementCard
      });
    }
  }

  public onEvolutionCardClick(card: Card): void {
    this.showCardImage(card, false);
  }

  public isFavoriteCard(): boolean {
    if (!this.card) {
      return false;
    }
    return this.cardsBaseService.isFavoriteCard(this.card);
  }

  public toggleFavorite(): void {
    if (!this.card) {
      return;
    }

    if (this.isFavoriteCard()) {
      this.cardsBaseService.clearFavoriteCard(this.card.name);
    } else {
      this.cardsBaseService.setFavoriteCard(this.card.name, this.card.fullName);
    }
  }

  public getCardTextKerningStyle(): { [key: string]: string } {
    return { 'letter-spacing': this.cardTextKerning + 'px' };
  }

}
