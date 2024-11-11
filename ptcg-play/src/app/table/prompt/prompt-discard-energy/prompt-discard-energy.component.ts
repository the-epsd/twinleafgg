import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Card, CardTarget, DiscardEnergyPrompt, FilterType, MoveEnergyPrompt, PokemonCardList, SuperType } from 'ptcg-server';

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

  @Input() prompt: DiscardEnergyPrompt;
  @Input() gameState: LocalGameState;
  @ViewChild('cardsContainer') cardsContainer: CardsContainerComponent;

  public pokemonData: PokemonData;
  public selectedItem: PokemonItem | undefined;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: FilterType;
  public isInvalid = false;
  public blocked: number[] = [];
  public results: DiscardEnergyResult[] = [];
  public selectedCardsByPokemon: Map<PokemonItem, Card[]> = new Map();
  public currentPokemonCards: Card[] = [];

  public min: number;
  public max: number | undefined;

  private blockedFrom: CardTarget[];
  private blockedTo: CardTarget[];
  private blockedCardList: Card[];

  constructor(
    private gameService: GameService
  ) { }

  getSlotArray(): number[] {
    return Array(this.max || this.min).fill(0).map((_, i) => i);
  }

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

    // Use the existing results array which is already in the correct format
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

    // Deselect previous item
    if (this.selectedItem) {
      this.selectedItem.selected = false;
    }

    // Select new item and update cards
    this.selectedItem = item;
    this.selectedItem.selected = true;
    this.currentPokemonCards = item.cardList.cards;
    this.blocked = this.buildBlocked(item);

    // Get previously selected indices and update container
    const previouslySelected = this.selectedCardsByPokemon.get(item) || [];
    const indices = previouslySelected.map(card =>
      item.cardList.cards.indexOf(card)
    );

    // Update validation state
    this.updateIsInvalid(this.results);
  }


  public getAllCards(): Card[] {
    return this.selectedItem ? this.selectedItem.cardList.cards : [];
  }

  public onChange(indices: number[]) {
    if (this.selectedItem) {
      const allCards = this.getAllCards();
      const availableEnergies = allCards.filter(card => card.superType === SuperType.ENERGY);


      // Limit selections to actual available energies
      const selectedCards = indices
        .slice(0, availableEnergies.length)
        .map(index => allCards[index]);

      if (indices.length === 0) {
        this.selectedCardsByPokemon.delete(this.selectedItem);
      } else {
        this.selectedCardsByPokemon.set(this.selectedItem, selectedCards);
      }

      // Update the selected cards for this Pokemon
      // this.selectedCardsByPokemon.set(this.selectedItem, selectedCards);

      // Update PokemonData to reflect selected cards
      this.selectedItem.cardList.cards = allCards.filter(card =>
        !selectedCards.includes(card)
      );

      // Reset and rebuild results
      this.results = [];
      let totalEnergyCount = 0;

      this.selectedCardsByPokemon.forEach((cards, pokemon) => {
        // Count actual energy cards selected
        const energyCards = cards.filter(card => card.superType === SuperType.ENERGY);
        totalEnergyCount += energyCards.length;

        energyCards.forEach(card => {
          this.results.push({
            from: pokemon,
            card,
            container: this.cardsContainer
          });
        });
      });

      console.log('Actual energy count:', totalEnergyCount);

      this.isInvalid = totalEnergyCount === 0 ||
        totalEnergyCount < this.min ||
        (this.max !== undefined && totalEnergyCount > this.max);
    }
  }

  public reset() {
    this.selectedCardsByPokemon.clear();
    this.results = [];
    this.selectedItem = undefined;
    this.updateIsInvalid(this.results);
    this.pokemonData.getRows().forEach(row => {
      row.items.forEach(item => {
        item.selected = false;
      });
    });
  }

  private updateIsInvalid(results: DiscardEnergyResult[]) {
    console.log('Validating results:', results);
    console.log('Current min:', this.min);
    console.log('Current max:', this.max);

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
    console.log('Final validation state:', isInvalid);
    this.isInvalid = isInvalid;
  }

  private updateSelectedCards(pokemonItem: PokemonItem, selectedCards: Card[]) {
    this.selectedCardsByPokemon.set(pokemonItem, selectedCards);
    this.updateResults();
  }

  private updateResults() {
    this.results = [];
    for (const [pokemonItem, cards] of this.selectedCardsByPokemon.entries()) {
      cards.forEach(card => {
        this.results.push({
          from: pokemonItem,
          card: card,
          container: this.cardsContainer
        });
      });
    }
    this.updateIsInvalid(this.results);
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
      this.pokemonData.getRows().forEach(row => {
        row.items.forEach(item => {
          item.selected = false;
        });
      });
    }
  }
}
