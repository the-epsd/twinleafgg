import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Card, CardTarget, FilterType, MoveEnergyPrompt, PokemonCardList } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';
import { CardsContainerComponent } from '../cards-container/cards-container.component';

interface DiscardEnergyResult {
  from: PokemonItem;
  card: Card;
  container: CardsContainerComponent;
}


@Component({
  selector: 'ptcg-prompt-discard-energy',
  templateUrl: './prompt-discard-energy.component.html',
  styleUrls: ['./prompt-discard-energy.component.scss']
})
export class PromptDiscardEnergyComponent implements OnChanges {

  @Input() prompt: MoveEnergyPrompt;
  @Input() gameState: LocalGameState;

  public pokemonData: PokemonData;
  public selectedItem: PokemonItem | undefined;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: FilterType;
  public isInvalid = false;
  public blocked: number[] = [];
  public results: DiscardEnergyResult[] = [];

  private min: number;
  private max: number | undefined;

  private blockedFrom: CardTarget[];
  private blockedTo: CardTarget[];
  private blockedCardList: Card[];

  constructor(
    private gameService: GameService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    const results = this.results.map(result => ({
      from: result.from.target,
      index: result.from.cardList.cards.indexOf(result.card),
      container: result.container
    }));

    this.gameService.resolvePrompt(gameId, id, results);
  }



  public onCardClick(item: PokemonItem) {
    if (this.pokemonData.matchesTarget(item, this.blockedFrom)) {
      return;
    }
    this.pokemonData.unselectAll();
    item.selected = true;
    this.selectedItem = item;
    this.blocked = this.buildBlocked(item);
  }

  // Assuming you have a reference to the ptcg-cards-container component
  @ViewChild('cardsContainer') cardsContainer: CardsContainerComponent;

  public onCardDrop(event: [PokemonItem, Card]) {
    const [item, card] = event;
    const index = item.cardList.cards.indexOf(card);
    if (index !== -1) {
      if (this.selectedItem) {
        // Move the card from the previously selected Pokemon
        this.moveCard(this.selectedItem, card);
        const result: DiscardEnergyResult = {
          from: this.selectedItem,
          card: card,
          container: this.cardsContainer
        };
        this.appendMoveResult(result);
      }

      // Select the new Pokemon and move the card
      this.pokemonData.unselectAll();
      item.selected = true;
      this.selectedItem = item;
      this.moveCard(item, card);
      const newResult: DiscardEnergyResult = {
        from: item,
        card: card,
        container: this.cardsContainer
      };
      this.appendMoveResult(newResult);
      this.blocked = this.buildBlocked(item);
    }
  }


  public onCardsDropped(indices: number[]) {
    if (this.selectedItem) {
      const cards = indices.map(index => this.selectedItem.cardList.cards[index]);
      this.results = []; // Initialize the results array
      cards.forEach(card => {
        const result: DiscardEnergyResult = {
          from: this.selectedItem,
          card: card,
          container: this.cardsContainer
        };
        this.appendMoveResult(result); // Add the result to the results array
      });
      this.updateIsInvalid(this.results);
    }
  }

  public reset() {
    this.results.forEach(r => {
      this.moveCardBack(r.from, r.card);
    });
    this.results = [];
    this.updateIsInvalid(this.results);
  }


  private moveCardBack(from: PokemonItem, card: Card) {
    const index = this.results.findIndex(r => r.card === card && r.from === from && r.container === this.cardsContainer);
    if (index !== -1) {
      this.results.splice(index, 1);
      from.cardList.cards.push(card);
    }
  }


  private moveCard(from: PokemonItem, card: Card) {
    const index = from.cardList.cards.indexOf(card);
    if (index !== -1) {
      from.cardList.cards.splice(index, 1);
    }
  }


  private appendMoveResult(result: DiscardEnergyResult) {
    const existingIndex = this.results.findIndex(r => r.card === result.card && r.from === result.from && r.container === result.container);
    if (existingIndex !== -1) {
      this.results.splice(existingIndex, 1);
    }
    this.results.push(result);
    this.updateIsInvalid(this.results);
  }



  private updateIsInvalid(results: DiscardEnergyResult[]) {
    let isInvalid = false;
    if (results.length === 0) {
      isInvalid = this.min > 0;
    } else {
      if (this.min > results.length) {
        isInvalid = true;
      }
      if (this.max !== undefined && this.max < results.length) {
        isInvalid = true;
      }
    }
    this.isInvalid = isInvalid;
  }


  private buildBlocked(item: PokemonItem) {
    const blocked: number[] = [];
    item.cardList.cards.forEach((c, index) => {
      if (this.blockedCardList.includes(c)) {
        blocked.push(index);
      }
    });
    return blocked;
  }

  private buildBlockedCardList(
    pokemonData: PokemonData,
    blockedMap: { source: CardTarget, blocked: number[] }[]
  ): Card[] {
    const cards: Card[] = [];

    const rows = pokemonData.getRows();
    for (const row of rows) {
      for (const item of row.items) {

        const blockedItem = blockedMap.find(bm => {
          return pokemonData.matchesTarget(item, [bm.source]);
        });

        if (blockedItem !== undefined) {
          blockedItem.blocked.forEach(b => {
            cards.push(item.cardList.cards[b]);
          });
        }

      }
    }

    return cards;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState && !this.promptId) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const playerId = prompt.playerId;
      const playerType = prompt.playerType;
      const slots = prompt.slots;

      this.pokemonData = new PokemonData(state, playerId, playerType, slots);
      this.blockedFrom = prompt.options.blockedFrom;
      this.blockedTo = prompt.options.blockedTo;
      this.blockedCardList = this.buildBlockedCardList(this.pokemonData, prompt.options.blockedMap);
      this.allowedCancel = prompt.options.allowCancel;
      this.filter = prompt.filter;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.selectedItem = undefined;
      this.results = [];
      this.min = prompt.options.min;
      this.max = prompt.options.max;
      this.updateIsInvalid(this.results);
    }
  }

}
