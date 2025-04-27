import { Component, EventEmitter, Input, Output, Inject, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Card, CardList, PokemonCardList, Power, BoardEffect, SpecialCondition, StadiumDirection, SuperType, EnergyCard, CardType, PlayerType, SlotType, CardTag } from 'ptcg-server';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardInteractionService } from '../../../shared/services/board-interaction.service';
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
    console.log('Dialog Data:', data);
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
    private elementRef: ElementRef
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

    // Subscribe to game logs to catch Pokemon played events
    // this.subscriptions.push(
    //   this.boardInteractionService.gameLogs$.subscribe(logs => {
    //     const lastLog = logs[logs.length - 1];
    //     if (lastLog?.params?.isFrontendEvent === 'true' &&
    //       lastLog?.params?.eventType === 'POKEMON_PLAYED' &&
    //       lastLog?.params?.pokemonId === this.mainCard?.id) {
    //       this.pokemonPlayed.emit({ pokemonId: lastLog.params.pokemonId });
    //     }
    //   })
    // );

    // Create animation end handler
    this.animationEndHandler = () => {
      if (this.animationElement) {
        this.animationElement.removeEventListener('animationend', this.animationEndHandler);
        this.showTestAnimation = false;
      }
    };
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Clean up animation handler
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.animationEndHandler);
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
  private currentCardId: number | string;
  private animationElement: HTMLElement;

  private animationEndHandler = () => {
    if (this.animationElement) {
      this.animationElement.removeEventListener('animationend', this.animationEndHandler);
      this.showTestAnimation = false;
      this.hasPlayedTestAnimation = true;
      this.animationElement = null;
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

    this.trainerCard = cardList.tool;

    // Check if this is a new card instance
    const newCardId = this.mainCard?.id;
    if (newCardId && newCardId !== this.currentCardId) {
      this.currentCardId = newCardId;
      this.hasPlayedTestAnimation = false;
      this.showTestAnimation = false;
    }

    // Check for evolution animation
    if (this.mainCard &&
      this.mainCard.superType === SuperType.POKEMON &&
      !this.hasPlayedTestAnimation &&
      cardList.triggerAnimation &&
      !this.showTestAnimation) {
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

    for (const card of cardList.cards) {
      // Check if card is an energy card or has a custom energy image
      if (card.superType === SuperType.ENERGY || this.getCustomImageUrl(card)) {
        if (this.energyCards.length < MAX_ENERGY_CARDS) {
          this.energyCards.push(card);
        } else {
          this.moreEnergies++;
        }
      }
    }
  }

  getCustomImageUrl(card: Card): string {
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
    };
    return customImageUrls[card.name] || '';
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

  public showTestAnimation = false;
  private isAnimating = false;

  @Input() set testEntrance(value: boolean) {
    if (value && !this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 3000);
    }
  }
}

