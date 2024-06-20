<<<<<<< Updated upstream
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card, CardList, Direction, PokemonCardList, Power, SpecialCondition, SuperType } from 'ptcg-server';
=======
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PokemonCardList, Card, CardList, SuperType, SpecialCondition, Power, Player, PokemonCard } from 'ptcg-server';
>>>>>>> Stashed changes

const MAX_ENERGY_CARDS = 4;

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

this.isEmpty = !value || !value.cards.length;
if (this.isEmpty) {
return;
}

const cards: Card[] = value.cards;
this.cardCount = cards.length;
this.isSecret = value.isSecret;
this.isPublic = value.isPublic;
this.isFaceDown = value.isSecret || (!value.isPublic && !this.isOwner);

// Pokemon slot, init energies, tool, special conditions, etc.
if (value instanceof PokemonCardList) {
this.initPokemonCardList(value);
return;
}

// Normal card list, display top-card only
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
<<<<<<< Updated upstream
  public cardDirection: Direction[] = [];

=======
>>>>>>> Stashed changes

  private isSecret = false;
  private isPublic = false;
  private isOwner = false;

  constructor() { }

  private initPokemonCardList(cardList: PokemonCardList) {
    this.damage = cardList.damage;
    this.specialConditions = cardList.specialConditions;
    this.trainerCard = undefined;
    this.mainCard = cardList.getPokemonCard();
    this.trainerCard = cardList.tool;

    for (const card of cardList.cards) {
      switch (card.superType) {
        case SuperType.ENERGY:
          if (this.energyCards.length < MAX_ENERGY_CARDS) {
            this.energyCards.push(card);
          } else {
            this.moreEnergies++;
          }
          break;
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
      // Add more custom image URLs for other energy cards
    };

    return customImageUrls[card.name] || '';
  }
  
  public onCardClick(card: Card) {
    this.cardClick.next(card);
  }

}
