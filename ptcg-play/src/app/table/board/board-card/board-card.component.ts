import { Component, EventEmitter, Input, Output, Inject, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Card, CardList, PokemonCardList, Power, BoardEffect, SpecialCondition, StadiumDirection, SuperType, EnergyCard, CardType, PlayerType, SlotType, CardTag, Stage, PokemonCard } from 'ptcg-server';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardInteractionService } from '../../../shared/services/board-interaction.service';
import { SettingsService } from '../../table-sidebar/settings-dialog/settings.service';
import { Subscription } from 'rxjs';

const MAX_ENERGY_CARDS = 8;

export interface CardInfoDialogData {
  cardList: PokemonCardList;
  facedown: boolean;
  options?: {
    enableAbility?: {
      useWhenInPlay?: boolean;
      useFromHand?: boolean;
      useFromDiscard?: boolean;
    };
    enableAttack?: boolean;
  };
}

@Component({
  selector: 'ptcg-card-info-dialog',
  template: `
    <div class="dialog-content">
      <div *ngIf="!data.cardList">No card list available</div>
      <div *ngIf="data.cardList">
        <ptcg-pokemon-card-info-pane
          [cardList]="data.cardList"
          [facedown]="data.facedown"
          [options]="data.options"
          (action)="onAction($event)">
        </ptcg-pokemon-card-info-pane>
      </div>
    </div>
  `,
  styles: [`
    .dialog-content {
      min-width: 300px;
      min-height: 200px;
      padding: 8px;
    }
  `]
})
export class CardInfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CardInfoDialogData,
    private dialogRef: MatDialogRef<CardInfoDialogComponent>
  ) {
  }

  onAction(action: any) {
    this.dialogRef.close(action);
  }
}

@Component({
  selector: 'ptcg-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent implements OnInit, OnDestroy {
  private _cardList: CardList | PokemonCardList;

  @Input() showCardCount = false;
  @Output() cardClick = new EventEmitter<Card>();
  @Output() pokemonPlayed = new EventEmitter<{ pokemonId: string | number }>();

  @Input() set cardList(value: CardList | PokemonCardList) {
    this._cardList = value;
    this.mainCard = undefined;
    this.energyCards = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isFaceDown = false;
    this.boardEffect = [];
    this.isUpsideDown = value?.stadiumDirection === StadiumDirection.DOWN;
    this.showTestAnimation = false;
    this.showBasicAnimation = false;

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
    this.energyCards = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isEmpty = !value;
    this.boardEffect = [];
  }

  @Input() isFaceDown = false;

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
  private isSecret = false;
  private isPublic = false;
  private isOwner = false;

  // Selection state for the card during board interaction mode
  public isSelectable = false;
  public isSelected = false;

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

  constructor(
    private dialog: MatDialog,
    private boardInteractionService: BoardInteractionService,
    private elementRef: ElementRef,
    private settingsService: SettingsService
  ) {
    this.cardTarget = { player: undefined, slot: undefined, index: 0 };
  }

  ngOnInit() {
    // Subscribe to selection mode changes
    this.subscriptions.push(
      this.boardInteractionService.selectionMode$.subscribe(() => {
        this.updateSelectionState();
      })
    );

    // Subscribe to selected targets changes
    this.subscriptions.push(
      this.boardInteractionService.selectedTargets$.subscribe(() => {
        this.updateSelectionState();
      })
    );

    // Create animation end handlers
    this.animationEndHandler = () => {
      if (this.animationElement) {
        this.animationElement.removeEventListener('animationend', this.animationEndHandler);
        this.showTestAnimation = false;
        this.hasPlayedTestAnimation = true;
        this.animationElement = null;
        if (this._cardList instanceof PokemonCardList) {
          this._cardList.triggerAnimation = false;
        }
      }
    };

    this.basicAnimationEndHandler = () => {
      if (this.animationElement) {
        this.animationElement.removeEventListener('animationend', this.basicAnimationEndHandler);
        this.showBasicAnimation = false;
        this.hasPlayedBasicAnimation = true;
        this.animationElement = null;
        if (this._cardList instanceof PokemonCardList) {
          this._cardList.showBasicAnimation = false;
        }
      }
    };

    // Subscribe to animation settings
    this.subscriptions.push(
      this.settingsService.testAnimation$.subscribe(enabled => {
        if (!enabled) {
          this.showTestAnimation = false;
          this.showBasicAnimation = false;
        }
      })
    );

    // Subscribe to evolution animation events
    this.subscriptions.push(
      this.boardInteractionService.evolutionAnimation$.subscribe(event => {
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
          this.showTestAnimation = true;
        }
      })
    );

    // Subscribe to attack animation events
    this.subscriptions.push(
      this.boardInteractionService.attackAnimation$.subscribe(event => {
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
      })
    );
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Clean up animation handler
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.animationEndHandler);
      this.animationElement.removeEventListener('animationend', this.basicAnimationEndHandler);
    }
  }

  /**
   * Update the selection state of this card
   */
  private updateSelectionState() {
    // Check if we have all the required target properties
    if (!this.cardTarget.player || !this.cardTarget.slot) {
      this.isSelectable = false;
      this.isSelected = false;
      return;
    }

    // Get the current selection mode
    let isSelectionMode = false;
    this.boardInteractionService.selectionMode$.subscribe(mode => {
      isSelectionMode = mode;
    }).unsubscribe();

    if (!isSelectionMode) {
      this.isSelectable = false;
      this.isSelected = false;
      return;
    }

    // Only mark as selectable if:
    // 1. The slot is eligible for selection
    // 2. The slot actually contains cards (not empty)
    const hasCards = this._cardList && this._cardList.cards && this._cardList.cards.length > 0;

    // Check if this card is eligible for selection
    this.isSelectable = hasCards && this.boardInteractionService.isTargetEligible(this.cardTarget);

    // Check if this card is currently selected
    this.isSelected = this.boardInteractionService.isTargetSelected(this.cardTarget);
  }

  private hasPlayedTestAnimation = false;
  private hasPlayedBasicAnimation = false;
  private currentCardId: number | string;
  private animationElement: HTMLElement;
  private isInPrompt = false;

  private animationEndHandler = () => {
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.animationEndHandler);
      this.showTestAnimation = false;
      this.hasPlayedTestAnimation = true;
      this.animationElement = null;
      if (this._cardList instanceof PokemonCardList) {
        this._cardList.triggerAnimation = false;
      }
    }
  };

  private basicAnimationEndHandler = () => {
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.basicAnimationEndHandler);
      this.showBasicAnimation = false;
      this.hasPlayedBasicAnimation = true;
      this.animationElement = null;
      if (this._cardList instanceof PokemonCardList) {
        this._cardList.showBasicAnimation = false;
      }
    }
  };

  private initPokemonCardList(cardList: PokemonCardList) {
    this.damage = cardList.damage;
    this.specialConditions = cardList.specialConditions;
    this.boardEffect = cardList.boardEffect;

    // Get the Pokemon card and check if it's a BREAK card
    const pokemonCard = cardList.getPokemonCard();
    if (pokemonCard?.tags?.includes(CardTag.BREAK)) {
      // If it's a BREAK card, find the original Pokemon card
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

    if (pokemonCard?.tags?.includes(CardTag.LEGEND)) {
      // If it's a Legend card, find the original Pokemon card
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
    } else {
      this.mainCard = pokemonCard;
      this.legendTopCard = undefined;
      this.legendBottomCard = undefined;
    }

    if (pokemonCard?.tags?.includes(CardTag.POKEMON_VUNION)) {
      // If it's a Legend card, find the original Pokemon card
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
    } else {
      this.mainCard = pokemonCard;
      this.vunionTopLeftCard = undefined;
      this.vunionTopRightCard = undefined;
      this.vunionBottomLeftCard = undefined;
      this.vunionBottomRightCard = undefined;
    }

    this.trainerCard = cardList.tools[0];

    for (const card of cardList.cards) {
      // Add if it's a true energy card, or if it's attached as energy (in cardList.energyCards)
      if (card.superType === SuperType.ENERGY || cardList.energyCards.includes(card)) {
        if (this.energyCards.length < MAX_ENERGY_CARDS) {
          this.energyCards.push(card);
        } else {
          this.moreEnergies++;
        }
      }
    }

    // Check if this is a new card instance
    const newCardId = this.mainCard?.id;
    if (newCardId && newCardId !== this.currentCardId) {
      this.currentCardId = newCardId;
      this.hasPlayedTestAnimation = false;
      this.showTestAnimation = false;
      this.hasPlayedBasicAnimation = false;
      this.showBasicAnimation = false;
    }

    // Handle Evolution animation
    if (this.mainCard &&
      this.mainCard.superType === SuperType.POKEMON &&
      !this.hasPlayedTestAnimation &&
      cardList.triggerAnimation &&
      !this.showTestAnimation &&
      !this.isInPrompt) {

      // Check if Evolution animation is enabled
      let isTestAnimationEnabled = true;
      this.settingsService.testAnimation$.subscribe(enabled => {
        isTestAnimationEnabled = enabled;
      }).unsubscribe();

      if (isTestAnimationEnabled) {
        this.hasPlayedTestAnimation = true;
        this.showTestAnimation = true;

        // Wait for the next tick to ensure the element is in the DOM
        setTimeout(() => {
          this.animationElement = document.querySelector('.test-entrance');
          if (this.animationElement) {
            this.animationElement.addEventListener('animationend', this.animationEndHandler);
          }
        });
      }
    }

    // Handle Playing Basic Pokemon animation
    if (this.mainCard &&
      this.mainCard.superType === SuperType.POKEMON &&
      !this.hasPlayedBasicAnimation &&
      cardList.showBasicAnimation &&
      !this.showBasicAnimation &&
      !this.isInPrompt) {

      // Check if Basic Pokemon animation is enabled
      let isBasicAnimationEnabled = true;
      this.settingsService.testAnimation$.subscribe(enabled => {
        isBasicAnimationEnabled = enabled;
      }).unsubscribe();

      if (isBasicAnimationEnabled) {
        this.hasPlayedBasicAnimation = true;
        this.showBasicAnimation = true;

        // Wait for the next tick to ensure the element is in the DOM
        setTimeout(() => {
          this.animationElement = document.querySelector('.basic-entrance');
          if (this.animationElement) {
            this.animationElement.addEventListener('animationend', this.basicAnimationEndHandler);
          }
        });
      }
    }

    // Handle Attack animation
    if (this.mainCard &&
      this.mainCard.superType === SuperType.POKEMON &&
      cardList.triggerAttackAnimation &&
      !this.showAttackAnimation &&
      !this.isInPrompt) {
      this.showAttackAnimation = true;
      setTimeout(() => {
        this.showAttackAnimation = false;
        cardList.triggerAttackAnimation = false;
      }, 1000);
    }
  }

  getCustomImageUrl(card: Card, isAttachedAsEnergy: boolean = false): string {
    const customImageUrls = {
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
    // Return a custom image if the card is an Energy card, or if it's attached as energy and matches a custom image
    if ((card.superType === SuperType.ENERGY || isAttachedAsEnergy) && customImageUrls[card.name]) {
      return customImageUrls[card.name];
    }
    return '';
  }

  getCustomToolImageUrl(card: Card): string {
    const customToolImageUrls = {
      'Vitality Band': 'assets/tools/vitality-band.png',
      'Bravery Charm': 'assets/tools/bravery-charm.png',
      // Add more mappings as needed
    };
    if (
      card &&
      card.superType === SuperType.TRAINER &&
      customToolImageUrls[card.name]
    ) {
      return customToolImageUrls[card.name];
    }
    return '';
  }

  public onCardClick(card: Card) {
    // console.log('Card clicked:', {
    //   card,
    //   mainCard: this.mainCard,
    //   cardList: this._cardList,
    //   superType: this.mainCard?.superType
    // });

    // if (this.mainCard && this.mainCard.superType === SuperType.POKEMON) {
    //   const pokemonCardList = this._cardList as PokemonCardList;

    //   const dialogData: CardInfoDialogData = {
    //     cardList: pokemonCardList,
    //     facedown: this.isFaceDown,
    //     options: {
    //       enableAbility: {
    //         useWhenInPlay: true,
    //         useFromHand: false,
    //         useFromDiscard: false
    //       },
    //       enableAttack: true
    //     }
    //   };

    //   console.log('Opening dialog with data:', dialogData);

    //   const dialogRef = this.dialog.open(CardInfoDialogComponent, {
    //     data: dialogData,
    //     width: '850px',
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('Dialog closed with result:', result);
    //     if (result) {
    //       this.cardClick.emit(card);
    //     }
    //   });
    // } else {
    this.cardClick.emit(card);
  }

  /////////////////////// ANIMATIONS ///////////////////////

  public showTestAnimation = false;
  public showBasicAnimation = false;
  public showAttackAnimation = false;
  private isAnimating = false;

  @Input() set testEntrance(value: boolean) {
    if (value && !this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 3000);
    }
  }

  @Input() set basicEntrance(value: boolean) {
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
      this.showTestAnimation = false;
      this.showBasicAnimation = false;
      if (this._cardList instanceof PokemonCardList) {
        this._cardList.triggerAnimation = false;
        this._cardList.showBasicAnimation = false;
      }
    }
  }

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

