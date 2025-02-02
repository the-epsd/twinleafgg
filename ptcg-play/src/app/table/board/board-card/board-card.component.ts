import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, CardList, PokemonCardList, Power, BoardEffect, SpecialCondition, StadiumDirection, SuperType, EnergyCard, CardType } from 'ptcg-server';

const MAX_ENERGY_CARDS = 8;

@Component({
  selector: 'ptcg-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss']
})
export class BoardCardComponent {

  @Input() showCardCount = false;
  @Output() cardClick = new EventEmitter<Card>();

  @Input() set cardList(value: CardList | PokemonCardList) {
    this.mainCard = undefined;
    this.energyCards = [];
    this.trainerCard = undefined;
    this.moreEnergies = 0;
    this.cardCount = 0;
    this.damage = 0;
    this.specialConditions = [];
    this.isFaceDown = false;
    this.isUpsideDown = value.stadiumDirection === StadiumDirection.DOWN;
    this.boardEffect = [];

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

  constructor() { }

  private initPokemonCardList(cardList: PokemonCardList) {
    this.damage = cardList.damage;
    this.specialConditions = cardList.specialConditions;
    this.boardEffect = cardList.boardEffect;
    this.trainerCard = undefined;
    this.mainCard = cardList.getPokemonCard();
    this.trainerCard = cardList.tool;

    for (const card of cardList.cards) {
      if (card.superType === SuperType.ENERGY) {
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
      'Electrode': 'assets/energy/neo-upper.png',
    };

    return customImageUrls[card.name] || '';
  }


  public onCardClick(card: Card) {
    this.cardClick.next(card);
  }
}
