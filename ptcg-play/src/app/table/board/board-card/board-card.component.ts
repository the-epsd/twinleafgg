import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Card, CardList, PokemonCardList, Power, BoardEffect, SpecialCondition, StadiumDirection, SuperType, EnergyCard, CardType, PlayerType, SlotType, CardTag, Stage, PokemonCard } from 'ptcg-server';
import { BoardInteractionService } from '../../../shared/services/board-interaction.service';
import { Subscription } from 'rxjs';
import { BoardCardAnimationHelper, AnimationState } from './board-card-animations.helper';

const MAX_ENERGY_CARDS = 8;

@Component({
  selector: 'ptcg-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit, OnDestroy {
  // ==================== INPUT/OUTPUT PROPERTIES ====================
  private _cardList: CardList | PokemonCardList;

  @Input() showCardCount = false;
  @Output() cardClick = new EventEmitter<Card>();
  @Output() pokemonPlayed = new EventEmitter<{ pokemonId: string | number }>();

  @Input() set cardList(value: CardList | PokemonCardList) {
    this._cardList = value;
    this.resetCardState();
    this.isEmpty = !value || !value.cards.length;
    if (this.isEmpty) {
      return;
    }

    const cards: Card[] = value.cards;
    this.cardCount = cards.length;
    this.isSecret = value.isSecret;
    this.isPublic = value.isPublic;
    this.isFaceDown = value.isSecret || (!value.isPublic && !this.isOwner);

    if (value instanceof PokemonCardList) {
      this.initPokemonCardList(value);
      return;
    }

    this.mainCard = value.cards[value.cards.length - 1];
  }

  get cardList(): CardList | PokemonCardList {
    return this._cardList;
  }

  @Input() set owner(value: boolean) {
    this.isOwner = value;
    const isFaceDown = this.isSecret || (!this.isPublic && !this.isOwner);
    this.isFaceDown = !this.isEmpty && isFaceDown;
  }

  @Input() set card(value: Card) {
    this.mainCard = value;
    this.resetCardState();
    this.isEmpty = !value;
  }

  @Input() isFaceDown = false;

  // ==================== PUBLIC PROPERTIES ====================
  public isEmpty = true;
  public mainCard: Card;
  public breakCard: Card;
  public legendTopCard: Card;
  public legendBottomCard: Card;
  public vunionTopLeftCard: Card;
  public vunionTopRightCard: Card;
  public vunionBottomLeftCard: Card;
  public vunionBottomRightCard: Card;
  public moreEnergies = 0;
  public cardCount = 0;
  public energyCards: Card[] = [];
  public trainerCard: Card;
  public powers: Power[] = [];
  public damage = 0;
  public specialConditions: SpecialCondition[] = [];
  public SpecialCondition = SpecialCondition;
  public isUpsideDown = false;
  public boardEffect: BoardEffect[] = [];
  public BoardEffect = BoardEffect;
  public hasImprisonMarker = false;

  // Selection state for the card during board interaction mode
  public isSelectable = false;
  public isSelected = false;

  // Animation properties
  public showEvolutionAnimation = false;
  public showBasicAnimation = false;
  public showAttackAnimation = false;

  // ==================== PRIVATE PROPERTIES ====================
  private isSecret = false;
  private isPublic = false;
  private isOwner = false;
  private subscriptions: Subscription[] = [];
  private cardTarget: { player: PlayerType, slot: SlotType, index: number };

  @Input() set player(value: PlayerType) {
    if (value !== undefined) {
      this.cardTarget = { ...this.cardTarget, player: value };
      this.updateSelectionState();
    }
  }

  @Input() set slot(value: SlotType) {
    if (value !== undefined) {
      this.cardTarget = { ...this.cardTarget, slot: value };
      this.updateSelectionState();
    }
  }

  @Input() set index(value: number) {
    if (value !== undefined) {
      this.cardTarget = { ...this.cardTarget, index: value };
      this.updateSelectionState();
    }
  }

  // Animation state properties
  private hasPlayedEvolutionAnimation = false;
  private hasPlayedBasicAnimation = false;
  private currentCardId: number | string;
  private animationElement: HTMLElement;
  private isInPrompt = false;
  private isAnimating = false;

  constructor(
    private boardInteractionService: BoardInteractionService,
    private elementRef: ElementRef
  ) {
    this.cardTarget = { player: undefined, slot: undefined, index: 0 };
  }

  public resolveArtUrlFor(card: Card | undefined): string | undefined {
    if (!card || !this._cardList) return undefined;
    const map = (this._cardList as any).artworksMap as { [code: string]: { imageUrl: string } } | undefined;
    if (!map) return undefined;
    const entry = map[card.fullName];
    return entry?.imageUrl;
  }

  // ==================== LIFECYCLE METHODS ====================
  ngOnInit() {
    this.setupSubscriptions();
    this.createAnimationHandlers();
  }

  ngOnDestroy() {
    this.cleanupSubscriptions();
    this.cleanupAnimationHandlers();
  }

  // ==================== ANIMATION SYSTEM ====================
  private createAnimationHandlers() {
    this.animationEndHandler = (event: AnimationEvent) => {
      if (this.animationElement) {
        BoardCardAnimationHelper.removeAnimationEndListener(this.animationElement, this.animationEndHandler);
        this.showEvolutionAnimation = false;
        this.hasPlayedEvolutionAnimation = true;
        this.animationElement = null;
        if (this._cardList instanceof PokemonCardList) {
          this._cardList.triggerEvolutionAnimation = false;
        }
      }
    };

    this.basicAnimationEndHandler = (event: AnimationEvent) => {
      if (this.animationElement) {
        BoardCardAnimationHelper.removeAnimationEndListener(this.animationElement, this.basicAnimationEndHandler);
        this.showBasicAnimation = false;
        this.hasPlayedBasicAnimation = true;
        this.animationElement = null;
        if (this._cardList instanceof PokemonCardList) {
          this._cardList.showBasicAnimation = false;
        }
      }
    };
  }

  private cleanupAnimationHandlers() {
    if (this.animationElement) {
      BoardCardAnimationHelper.cleanupAnimationHandlers(
        this.animationElement,
        this.animationEndHandler,
        this.basicAnimationEndHandler
      );
    }
  }

  private animationEndHandler = (event: AnimationEvent) => { };
  private basicAnimationEndHandler = (event: AnimationEvent) => { };

  private triggerEvolutionAnimation(cardList: PokemonCardList) {
    const animationState: AnimationState = {
      hasPlayedEvolutionAnimation: this.hasPlayedEvolutionAnimation,
      hasPlayedBasicAnimation: this.hasPlayedBasicAnimation,
      showEvolutionAnimation: this.showEvolutionAnimation,
      showBasicAnimation: this.showBasicAnimation,
      showAttackAnimation: this.showAttackAnimation,
      isInPrompt: this.isInPrompt,
      currentCardId: this.currentCardId
    };

    if (BoardCardAnimationHelper.shouldTriggerEvolutionAnimation(this.mainCard, cardList, animationState)) {
      this.hasPlayedEvolutionAnimation = true;
      this.showEvolutionAnimation = true;

      setTimeout(() => {
        this.animationElement = BoardCardAnimationHelper.getAnimationElement('.evolution-animation');
        if (this.animationElement) {
          BoardCardAnimationHelper.addAnimationEndListener(this.animationElement, this.animationEndHandler);
        }
      });
    }
  }

  private triggerBasicPokemonAnimation(cardList: PokemonCardList) {
    const animationState: AnimationState = {
      hasPlayedEvolutionAnimation: this.hasPlayedEvolutionAnimation,
      hasPlayedBasicAnimation: this.hasPlayedBasicAnimation,
      showEvolutionAnimation: this.showEvolutionAnimation,
      showBasicAnimation: this.showBasicAnimation,
      showAttackAnimation: this.showAttackAnimation,
      isInPrompt: this.isInPrompt,
      currentCardId: this.currentCardId
    };

    if (BoardCardAnimationHelper.shouldTriggerBasicPokemonAnimation(this.mainCard, cardList, animationState)) {
      this.hasPlayedBasicAnimation = true;
      this.showBasicAnimation = true;

      setTimeout(() => {
        this.animationElement = BoardCardAnimationHelper.getAnimationElement('.play-basic-animation');
        if (this.animationElement) {
          BoardCardAnimationHelper.addAnimationEndListener(this.animationElement, this.basicAnimationEndHandler);
        }
      });
    }
  }

  private triggerAttackAnimation(cardList: PokemonCardList) {
    const animationState: AnimationState = {
      hasPlayedEvolutionAnimation: this.hasPlayedEvolutionAnimation,
      hasPlayedBasicAnimation: this.hasPlayedBasicAnimation,
      showEvolutionAnimation: this.showEvolutionAnimation,
      showBasicAnimation: this.showBasicAnimation,
      showAttackAnimation: this.showAttackAnimation,
      isInPrompt: this.isInPrompt,
      currentCardId: this.currentCardId
    };

    if (BoardCardAnimationHelper.shouldTriggerAttackAnimation(this.mainCard, cardList, animationState)) {
      this.showAttackAnimation = true;
      setTimeout(() => {
        this.showAttackAnimation = false;
        cardList.triggerAttackAnimation = false;
      }, 1000);
    }
  }

  private handleCardAnimations(cardList: PokemonCardList) {
    // Check if this is a new card instance
    const animationState: AnimationState = {
      hasPlayedEvolutionAnimation: this.hasPlayedEvolutionAnimation,
      hasPlayedBasicAnimation: this.hasPlayedBasicAnimation,
      showEvolutionAnimation: this.showEvolutionAnimation,
      showBasicAnimation: this.showBasicAnimation,
      showAttackAnimation: this.showAttackAnimation,
      isInPrompt: this.isInPrompt,
      currentCardId: this.currentCardId
    };

    if (BoardCardAnimationHelper.isNewCardInstance(this.mainCard, animationState)) {
      const newCardId = this.mainCard?.id;
      BoardCardAnimationHelper.resetAnimationStateForNewCard(animationState, newCardId);
      this.currentCardId = newCardId;
      this.hasPlayedEvolutionAnimation = animationState.hasPlayedEvolutionAnimation;
      this.showEvolutionAnimation = animationState.showEvolutionAnimation;
      this.hasPlayedBasicAnimation = animationState.hasPlayedBasicAnimation;
      this.showBasicAnimation = animationState.showBasicAnimation;
      this.showEvolutionAnimation = animationState.showEvolutionAnimation;
    }

    this.triggerEvolutionAnimation(cardList);
    this.triggerBasicPokemonAnimation(cardList);
    this.triggerAttackAnimation(cardList);
  }

  private handleEvolutionAnimationEvent(event: any) {
    const slotMatch = String(this.cardTarget.slot) === String(event.slot);
    if (
      this.cardTarget &&
      event &&
      this.cardTarget.player === event.playerId &&
      slotMatch &&
      this.cardTarget.index === event.index &&
      this.mainCard &&
      this.mainCard.id === event.cardId
    ) {
      this.showEvolutionAnimation = true;
    }
  }

  private handleBasicAnimationEvent(event: any) {
    const slotMatch = String(this.cardTarget.slot) === String(event.slot);
    if (
      this.cardTarget &&
      event &&
      this.cardTarget.player === event.playerId &&
      slotMatch &&
      this.cardTarget.index === event.index &&
      this.mainCard &&
      this.mainCard.id === event.cardId
    ) {
      this.showBasicAnimation = true;
    }
  }

  private handleAttackAnimationEvent(event: any) {
    const slotMatch = String(this.cardTarget.slot) === String(event.slot);
    if (
      this.cardTarget &&
      event &&
      this.cardTarget.player === event.playerId &&
      slotMatch &&
      this.cardTarget.index === event.index &&
      this.mainCard &&
      this.mainCard.id === event.cardId
    ) {
      this.showAttackAnimation = true;
    }
  }

  @Input() set evolutionEntrance(value: boolean) {
    if (value && !this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 3000);
    }
  }

  @Input() set playBasicAnimation(value: boolean) {
    if (value && !this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    }
  }

  @Input() set inPrompt(value: boolean) {
    this.isInPrompt = value;
    if (value) {
      this.showEvolutionAnimation = false;
      this.showBasicAnimation = false;
      this.showEvolutionAnimation = false;
      if (this._cardList instanceof PokemonCardList) {
        this._cardList.triggerEvolutionAnimation = false;
        this._cardList.showBasicAnimation = false;
      }
    }
  }

  // ==================== SUBSCRIPTION MANAGEMENT ====================
  private setupSubscriptions() {
    // Selection mode changes
    this.subscriptions.push(
      this.boardInteractionService.selectionMode$.subscribe(() => {
        this.updateSelectionState();
      })
    );

    // Selected targets changes
    this.subscriptions.push(
      this.boardInteractionService.selectedTargets$.subscribe(() => {
        this.updateSelectionState();
      })
    );

    // Evolution animation events
    this.subscriptions.push(
      this.boardInteractionService.evolutionAnimation$.subscribe(event => {
        this.handleEvolutionAnimationEvent(event);
      })
    );

    // Basic animation events
    this.subscriptions.push(
      this.boardInteractionService.basicAnimation$.subscribe(event => {
        this.handleBasicAnimationEvent(event);
      })
    );

    // Attack animation events
    this.subscriptions.push(
      this.boardInteractionService.attackAnimation$.subscribe(event => {
        this.handleAttackAnimationEvent(event);
      })
    );
  }

  private cleanupSubscriptions() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ==================== SELECTION STATE MANAGEMENT ====================
  private updateSelectionState() {
    if (!this.cardTarget.player || !this.cardTarget.slot) {
      this.isSelectable = false;
      this.isSelected = false;
      return;
    }

    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe();

    if (!isSelectionMode) {
      this.isSelectable = false;
      this.isSelected = false;
      return;
    }

    const hasCards = this._cardList && this._cardList.cards && this._cardList.cards.length > 0;
    this.isSelectable = hasCards && this.boardInteractionService.isTargetEligible(this.cardTarget);
    this.isSelected = this.boardInteractionService.isTargetSelected(this.cardTarget);
  }

  // ==================== CARD STATE MANAGEMENT ====================
  private resetCardState() {
    this.mainCard = undefined;
    this.energyCards = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isFaceDown = false;
    this.boardEffect = [];
    this.isUpsideDown = this._cardList?.stadiumDirection === StadiumDirection.DOWN;
    this.showEvolutionAnimation = false;
    this.showBasicAnimation = false;
    this.showEvolutionAnimation = false;
    this.showAttackAnimation = false;
  }

  private initPokemonCardList(cardList: PokemonCardList) {
    this.damage = cardList.damage;
    this.specialConditions = cardList.specialConditions;
    this.boardEffect = cardList.boardEffect;
    this.hasImprisonMarker = cardList.marker.hasMarker('IMPRISON_MARKER');

    this.setupPokemonCards(cardList);
    this.setupEnergyCards(cardList);
    this.handleCardAnimations(cardList);
  }

  // ==================== CARD SETUP METHODS ====================
  private setupPokemonCards(cardList: PokemonCardList) {
    const pokemonCard = cardList.getPokemonCard();

    // Handle BREAK cards
    if (pokemonCard?.tags?.includes(CardTag.BREAK)) {
      const originalCard = cardList.cards.find(card =>
        card.superType === SuperType.POKEMON &&
        !card.tags?.includes(CardTag.BREAK)
      );
      this.mainCard = originalCard;
      this.breakCard = pokemonCard;
    } else {
      this.mainCard = pokemonCard;
      this.breakCard = undefined;
    }

    // Handle Legend cards
    if (pokemonCard?.tags?.includes(CardTag.LEGEND)) {
      this.setupLegendCards(cardList);
    } else {
      this.legendTopCard = undefined;
      this.legendBottomCard = undefined;
    }

    // Handle V-Union cards
    if (pokemonCard?.tags?.includes(CardTag.POKEMON_VUNION)) {
      this.setupVUnionCards(cardList);
    } else {
      this.vunionTopLeftCard = undefined;
      this.vunionTopRightCard = undefined;
      this.vunionBottomLeftCard = undefined;
      this.vunionBottomRightCard = undefined;
    }

    this.trainerCard = cardList.tools[0];
  }

  private setupLegendCards(cardList: PokemonCardList) {
    const topCard = cardList.cards.find(card =>
      card.superType === SuperType.POKEMON &&
      card.tags?.includes(CardTag.LEGEND) &&
      card.fullName.includes('(Top)')
    );
    const bottomCard = cardList.cards.find(card =>
      card.superType === SuperType.POKEMON &&
      card.tags?.includes(CardTag.LEGEND) &&
      card.fullName.includes('(Bottom)')
    );
    this.legendTopCard = topCard;
    this.legendBottomCard = bottomCard;
  }

  private setupVUnionCards(cardList: PokemonCardList) {
    const topLeftCard = cardList.cards.find(card =>
      card.superType === SuperType.POKEMON &&
      card.tags?.includes(CardTag.POKEMON_VUNION) &&
      card.fullName.includes('(Top Left)')
    );
    const topRightCard = cardList.cards.find(card =>
      card.superType === SuperType.POKEMON &&
      card.tags?.includes(CardTag.POKEMON_VUNION) &&
      card.fullName.includes('(Top Right)')
    );
    const bottomLeftCard = cardList.cards.find(card =>
      card.superType === SuperType.POKEMON &&
      card.tags?.includes(CardTag.POKEMON_VUNION) &&
      card.fullName.includes('(Bottom Left)')
    );
    const bottomRightCard = cardList.cards.find(card =>
      card.superType === SuperType.POKEMON &&
      card.tags?.includes(CardTag.POKEMON_VUNION) &&
      card.fullName.includes('(Bottom Right)')
    );
    this.vunionTopLeftCard = topLeftCard;
    this.vunionTopRightCard = topRightCard;
    this.vunionBottomLeftCard = bottomLeftCard;
    this.vunionBottomRightCard = bottomRightCard;
  }

  private setupEnergyCards(cardList: PokemonCardList) {
    for (const card of cardList.cards) {
      if (card.superType === SuperType.ENERGY || cardList.energyCards.includes(card)) {
        if (this.energyCards.length < MAX_ENERGY_CARDS) {
          this.energyCards.push(card);
        } else {
          this.moreEnergies++;
        }
      }
    }
  }

  // ==================== CUSTOM IMAGE HELPERS ====================
  getCustomEnergyIcon(card: Card, isAttachedAsEnergy: boolean = false): string {
    const customEnergyIcon = {
      'Grass Energy': 'assets/energy/grass.png',
      'Fire Energy': 'assets/energy/fire.png',
      'Water Energy': 'assets/energy/water.png',
      'Lightning Energy': 'assets/energy/lightning.png',
      'Psychic Energy': 'assets/energy/psychic.png',
      'Fighting Energy': 'assets/energy/fighting.png',
      'Darkness Energy': 'assets/energy/dark.png',
      'Metal Energy': 'assets/energy/metal.png',
      'Fairy Energy': 'assets/energy/fairy.png',
      'Double Turbo Energy': 'assets/energy/double-turbo.png',
      'Jet Energy': 'assets/energy/jet.png',
      'Gift Energy': 'assets/energy/gift.png',
      'Mist Energy': 'assets/energy/mist.png',
      'Legacy Energy': 'assets/energy/legacy.png',
      'Neo Upper Energy': 'assets/energy/neo-upper.png',
      'Electrode': 'assets/energy/electrode.png',
      'Holon\'s Castform': 'assets/energy/holons-castform.png',
      'Holon\'s Magnemite': 'assets/energy/holons-magnemite.png',
      'Holon\'s Magneton': 'assets/energy/holons-magneton.png',
      'Holon\'s Voltorb': 'assets/energy/holons-voltorb.png',
      'Holon\'s Electrode': 'assets/energy/holons-electrode.png',
    };

    if ((card.superType === SuperType.ENERGY || isAttachedAsEnergy) && customEnergyIcon[card.name]) {
      return customEnergyIcon[card.name];
    }
    return '';
  }

  getCustomToolIcon(card: Card): string {
    const customToolIcon = {
      'Vitality Band': 'assets/tools/vitality-band.png',
      'Bravery Charm': 'assets/tools/bravery-charm.png',
    };

    if (
      card &&
      card.superType === SuperType.TRAINER &&
      customToolIcon[card.name]
    ) {
      return customToolIcon[card.name];
    }
    return '';
  }

  // ==================== EVENT HANDLERS ====================
  public onCardClick(card: Card) {
    this.cardClick.emit(card);
  }

  // ==================== UTILITY METHODS ====================
  public getRotationClass(): string {
    if (this.specialConditions.includes(SpecialCondition.ASLEEP)) {
      return 'asleep-position';
    }
    if (this.specialConditions.includes(SpecialCondition.CONFUSED)) {
      return 'confused-position';
    }
    if (this.specialConditions.includes(SpecialCondition.PARALYZED)) {
      return 'paralyzed-position';
    }
    return '';
  }

  // Expose _cardList for template use (for tools display)
  get cardListInternal(): CardList | PokemonCardList {
    return this._cardList;
  }
}

