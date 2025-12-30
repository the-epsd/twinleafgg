import { Component, Input, OnChanges } from '@angular/core';
import { Card, MoveEnergyPrompt, CardTarget, FilterType, PokemonCardList } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PokemonData, PokemonItem } from '../choose-pokemons-pane/pokemon-data';

interface MoveEnergyResult {
  from: PokemonItem;
  to: PokemonItem;
  card: Card;
}

@Component({
  selector: 'ptcg-prompt-move-energy',
  templateUrl: './prompt-move-energy.component.html',
  styleUrls: ['./prompt-move-energy.component.scss']
})
export class PromptMoveEnergyComponent implements OnChanges {

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
  public results: MoveEnergyResult[] = [];
  public dragSpec = {
    beginDrag: (item: Card) => ({ card: item }),
    canDrag: () => true
  };

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
    const results = this.results.map(r => ({
      from: r.from.target,
      to: r.to.target,
      index: this.pokemonData.getCardIndex(r.card)
    }));
    this.gameService.resolvePrompt(gameId, id, results);
  }

  public dropSpec = {
    drop: (item: PokemonItem, monitor) => {
      const draggedCard = monitor.getItem().card;
      this.onCardDrop([item, draggedCard]);
    },
    canDrop: (item: PokemonItem) => {
      return !this.pokemonData.matchesTarget(item, this.blockedTo);
    }
  };

  // Add collect functions
  public dragCollect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  });

  public dropCollect = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  });

  // Pass the drag configuration to choose-cards-panes
  public getCardsPanesConfig() {
    return {
      dragEnabled: true,
      dragType: 'ENERGY_CARD'
    };
  }

  public getSelectedCards(): Card[] {
    if (!this.selectedItem) {
      return [];
    }
    // PokemonItem.cardList is always PokemonCardList
    const cardList = this.selectedItem.cardList as PokemonCardList;
    return cardList.energies.cards;
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

  public onCardDrop([item, card]: [PokemonItem, Card]) {
    if (item === this.selectedItem) {
      return;
    }
    if (this.pokemonData.matchesTarget(item, this.blockedTo)) {
      return;
    }
    // Check energies.cards first, then fall back to cards for backwards compatibility
    const pokemonCardList = this.selectedItem.cardList instanceof PokemonCardList 
      ? this.selectedItem.cardList 
      : null;
    const energyIndex = pokemonCardList ? pokemonCardList.energies.cards.indexOf(card) : -1;
    const index = energyIndex !== -1 ? energyIndex : this.selectedItem.cardList.cards.indexOf(card);
    if (index === -1) {
      return;
    }
    const result: MoveEnergyResult = {
      from: this.selectedItem,
      to: item,
      card
    };
    this.moveCard(result.from, result.to, card);
    this.appendMoveResult(result);
    this.updateIsInvalid(this.results);
  }

  public reset() {
    this.results.forEach(r => {
      this.moveCard(r.to, r.from, r.card);
    });
    this.results = [];
    this.updateIsInvalid(this.results);
  }

  private moveCard(from: PokemonItem, to: PokemonItem, card: Card) {
    const fromIsPokemon = from.cardList instanceof PokemonCardList;
    const toIsPokemon = to.cardList instanceof PokemonCardList;

    from.cardList = Object.assign(new PokemonCardList(), from.cardList) as PokemonCardList;
    from.cardList.cards = [...from.cardList.cards];
    if (fromIsPokemon) {
      const fromPkm = from.cardList as PokemonCardList;
      fromPkm.energies = Object.assign(new (fromPkm.energies.constructor as any)(), fromPkm.energies);
      fromPkm.energies.cards = [...fromPkm.energies.cards];
    }

    to.cardList = Object.assign(new PokemonCardList(), to.cardList) as PokemonCardList;
    to.cardList.cards = [...to.cardList.cards];
    if (toIsPokemon) {
      const toPkm = to.cardList as PokemonCardList;
      toPkm.energies = Object.assign(new (toPkm.energies.constructor as any)(), toPkm.energies);
      toPkm.energies.cards = [...toPkm.energies.cards];
    }

    // Move from energies.cards if it's a PokemonCardList, otherwise use cards
    if (fromIsPokemon) {
      const fromPkm = from.cardList as PokemonCardList;
      const energyIndex = fromPkm.energies.cards.indexOf(card);
      if (energyIndex !== -1) {
        fromPkm.energies.cards.splice(energyIndex, 1);
        // Also remove from main cards array
        const cardIndex = fromPkm.cards.indexOf(card);
        if (cardIndex !== -1) {
          fromPkm.cards.splice(cardIndex, 1);
        }
      }
    } else {
      const index = from.cardList.cards.indexOf(card);
      if (index !== -1) {
        from.cardList.cards.splice(index, 1);
      }
    }

    // Add to energies.cards if it's a PokemonCardList, otherwise use cards
    if (toIsPokemon) {
      const toPkm = to.cardList as PokemonCardList;
      toPkm.energies.cards.push(card);
      // Also ensure it's in the main cards array for serialization
      if (!toPkm.cards.includes(card)) {
        toPkm.cards.push(card);
      }
    } else {
      to.cardList.cards.push(card);
    }
  }

  private appendMoveResult(result: MoveEnergyResult) {
    const index = this.results.findIndex(r => r.card === result.card);
    if (index === -1) {
      this.results.push(result);
      return;
    }
    const prevResult = this.results[index];
    if (prevResult.from === result.to) {
      this.results.splice(index, 1);
      return;
    }
    prevResult.to = result.to;
  }

  private updateIsInvalid(results: MoveEnergyResult[]) {
    let isInvalid = false;
    if (this.min > results.length) {
      isInvalid = true;
    }
    if (this.max !== undefined && this.max < results.length) {
      isInvalid = true;
    }
    this.isInvalid = isInvalid;
  }

  private buildBlocked(item: PokemonItem) {
    const blocked: number[] = [];
    // PokemonItem.cardList is always PokemonCardList
    const cardList = item.cardList as PokemonCardList;
    cardList.energies.cards.forEach((c, index) => {
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
            // Check energies.cards first for PokemonCardList
            if (item.cardList instanceof PokemonCardList && b < item.cardList.energies.cards.length) {
              cards.push(item.cardList.energies.cards[b]);
            } else if (b < item.cardList.cards.length) {
              cards.push(item.cardList.cards[b]);
            }
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
