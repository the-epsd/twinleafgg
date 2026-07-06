import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import {
  Card,
  SuperType,
  Stage,
  PowerType,
  EnergyType,
  TrainerType,
  TrainerCard,
  PokemonCardList,
  EnergyCard,
  CardTag,
  PokemonCard,
  Player,
} from "ptcg-server";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { CardImagePopupComponent } from "../card-image-popup/card-image-popup.component";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { SettingsService } from "../../../table/table-sidebar/settings-dialog/settings.service";
import { CardsBaseService } from "../cards-base.service";
import { CardSwapDialogComponent } from "../card-swap-dialog/card-swap-dialog.component";

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
    "Team Magma's",
    "Team Aqua's",
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
    return text.replace(
      /\[([WFYRGLPMDCN])\]/g,
      (match, type) =>
        `<img align="top" style="transform: ${this.ENERGY_ICON_TRANSFORM}" src="assets/energy-icons/${this.energyImageMap[type]}.webp" alt="${this.energyImageMap[type]} Energy" width="${this.ENERGY_ICON_SIZE}">`,
    );
  }

  formatReminderText(text: string): string {
    return text
      .replace(/\(/g, '<span class="reminder">(')
      .replace(/\)/g, ")</span>");
  }

  formatBossMonMechanics(text: string): string {
    return text
      .replace(
        / (ex|V-UNION|VMAX|VSTAR|V|TAG TEAM|GX|BREAK|ACE SPEC)($|\W)/g,
        (match, mechanic, postscript) =>
          ` <span class="boss-mon">${mechanic}</span>${postscript}`,
      )
      .replace(
        /-(EX|GX)/g,
        (match, mechanic) => `-<span class="boss-mon">${mechanic}</span>`,
      );
  }

  formatCardText(text: string): string {
    return this.transformEnergyText(
      this.formatBossMonMechanics(this.formatReminderText(text)),
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

  // Return any relevant rule boxes or nonrule boxes for display
  public getDisplayRuleBoxes(): any[] {
    if (!this.card) {
      return [];
    }

    interface RuleBox {
      name: String;
      isRuleBox: boolean;
      text: String;
    }

    var boxes: RuleBox[] = [];

    // Miscellaneous tagged traits

    if (this.card.tags.includes(CardTag.MEGA)) {
      if (this.card.tags.includes(CardTag.PRIMAL)) {
        var monName = this.card.name;
        boxes.push({
          name: "Primal Reversion rule",
          isRuleBox: true,
          text: `When 1 of your Pokémon becomes ${monName}, your turn ends.`,
        });
      } else {
        boxes.push({
          name: "Mega Evolution rule",
          isRuleBox: true,
          text: "When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.",
        });
      }
    }

    if (this.card.tags.includes(CardTag.POKEMON_TERA)) {
      boxes.push({
        name: "Tera",
        isRuleBox: false,
        text: "As long as this Pokémon is on your Bench, prevent all damage done to this Pokémon by attacks (both yours and your opponent's).",
      });
    }

    // Deck construction rules

    if (this.card.tags.includes(CardTag.UNOWN)) {
      boxes.push({
        name: "Neo Unown",
        isRuleBox: false,
        text: "You may have up to 4 Basic Pokémon cards in your deck with Unown in their names.",
      });
    }

    if (this.card.tags.includes(CardTag.ARCEUS)) {
      boxes.push({
        name: "Platinum Arceus",
        isRuleBox: false,
        text: "You may have as many of this card in your deck as you like.",
      });
    }

    if (this.card.tags.includes(CardTag.STAR)) {
      boxes.push({
        name: "Pokémon Star",
        isRuleBox: false,
        text: "You can't have more than 1 Pokémon Star in your deck.",
      });
    }

    if (this.card.tags.includes(CardTag.ACE_SPEC)) {
      boxes.push({
        name: "ACE SPEC",
        isRuleBox: false,
        text: "You can't have more than 1 ACE SPEC card in your deck.",
      });
    }

    if (this.card.tags.includes(CardTag.PRISM_STAR)) {
      boxes.push({
        name: "Prism Star Rule",
        isRuleBox: true,
        text:
          "You can't have more than 1 Prism Star card with the same name in your deck. " +
          "If a Prism Star card would go to the discard pile, put it in the Lost Zone instead.",
      });
    }

    if (this.card.tags.includes(CardTag.RADIANT)) {
      boxes.push({
        name: "Radiant Pokémon Rule",
        isRuleBox: true,
        text: "You can't have more than 1 Radiant Pokémon in your deck.",
      });
    }

    // Play rules

    if (this.card.tags.includes(CardTag.POKEMON_LV_X)) {
      var monName = this.card.name;
      boxes.push({
        name: "LV.X",
        isRuleBox: false,
        text: `Put this card onto your Active ${monName}. ${monName} LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.`,
      });
    }

    if (this.card.tags.includes(CardTag.BREAK)) {
      var monName = this.card.name;
      boxes.push({
        name: "BREAK Evolution Rule",
        isRuleBox: true,
        text: `${monName} retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.`,
      });
    }

    // Prize card rules

    if (this.card.tags.includes(CardTag.POKEMON_ex)) {
      if (this.card.tags.includes(CardTag.POKEMON_SV_MEGA)) {
        boxes.push({
          name: "Mega Evolution ex rule",
          isRuleBox: true,
          text: "When your Mega Evolution Pokémon ex is Knocked Out, your opponent takes 3 Prize cards.",
        });
      } else {
        if (!this.card.regulationMark) {
          // If there's no regulation mark, it's probably an ex-era card.
          boxes.push({
            name: "Pokémon ex",
            isRuleBox: false,
            text: "When Pokémon ex has been Knocked Out, your opponent takes 2 Prize cards.",
          });
        } else {
          // SV-on era, has a rule box
          boxes.push({
            name: "Pokémon ex rule",
            isRuleBox: true,
            text: "When your Pokémon ex is Knocked Out, your opponent takes 2 Prize cards.",
          });
        }
      }
    }

    if (this.card.tags.includes(CardTag.DUAL_LEGEND)) {
      boxes.push({
        name: "Pair Legend",
        isRuleBox: false,
        text: "When this Pokémon has been Knocked Out, your opponent takes 2 Prize cards.",
      });
    }

    if (this.card.tags.includes(CardTag.POKEMON_EX)) {
      boxes.push({
        name: "Pokémon-EX rule",
        isRuleBox: true,
        text: "When a Pokémon-EX has been Knocked Out, your opponent takes 2 Prize cards.",
      });
    }

    if (this.card.tags.includes(CardTag.POKEMON_GX)) {
      if (this.card.tags.includes(CardTag.TAG_TEAM)) {
        boxes.push({
          name: "TAG TEAM rule",
          isRuleBox: true,
          text: "When your TAG TEAM is Knocked Out, your opponent takes 3 Prize cards.",
        });
      } else {
        boxes.push({
          name: "Pokémon-GX rule",
          isRuleBox: true,
          text: "When your Pokémon-GX has been Knocked Out, your opponent takes 2 Prize cards.",
        });
      }
    }

    if (this.card.tags.includes(CardTag.POKEMON_V)) {
      boxes.push({
        name: "V rule",
        isRuleBox: true,
        text: "When your Pokémon V is Knocked Out, your opponent takes 2 Prize cards.",
      });
    }

    if (this.card.tags.includes(CardTag.POKEMON_VMAX)) {
      boxes.push({
        name: "VMAX rule",
        isRuleBox: true,
        text: "When your Pokémon VMAX is Knocked Out, your opponent takes 3 Prize cards.",
      });
    }

    if (this.card.tags.includes(CardTag.POKEMON_VSTAR)) {
      boxes.push({
        name: "VSTAR rule",
        isRuleBox: true,
        text: "When your Pokémon VSTAR is Knocked Out, your opponent takes 2 Prize cards.",
      });
    }

    if (this.card.tags.includes(CardTag.POKEMON_VUNION)) {
      boxes.push({
        name: "V-UNION rule",
        isRuleBox: true,
        text: "When your Pokémon V-UNION is Knocked Out, your opponent takes 3 Prize cards.",
      });
    }

    return boxes;
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
    if (!this.showTags || !this.card) {
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
