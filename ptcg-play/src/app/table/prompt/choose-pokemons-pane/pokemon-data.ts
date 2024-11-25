import { State, PlayerType, SlotType, PokemonCardList, CardTarget, Card } from 'ptcg-server';

export interface PokemonItem {
  cardList: PokemonCardList;
  selected: boolean;
  target: CardTarget;
}

export interface PokemonRow {
  items: PokemonItem[];
  playerType: PlayerType;
}

interface CardIndex {
  card: Card;
  index: number;
}

export class PokemonData {

  private rows: PokemonRow[];
  private cardIndexes: CardIndex[] = [];
  private selectedEnergyState = new Map<CardTarget, Card[]>();

  constructor(
    state: State,
    playerId: number,
    playerType: PlayerType,
    slots: SlotType[]
  ) {
    this.rows = this.buildPokemonRows(state, playerId, playerType, slots);
  }

  public updatePokemonCardList(target: CardTarget, remainingCards: Card[]): void {
    const item = this.getItemByTarget(target);
    if (item) {
      item.cardList.cards = remainingCards;
      this.selectedEnergyState.set(target, remainingCards);
    }
  }

  private buildRow(cardLists: PokemonCardList[], player: PlayerType, slot: SlotType): PokemonRow {
    const target = { player, slot, index: 0 };
    const items = cardLists.map((cardList, index) => (
      { cardList, selected: false, target: { ...target, index } }
    ));
    items.forEach(item => item.cardList.cards.forEach((card, index) => {
      this.cardIndexes.push({ card, index });
    }));
    return { items, playerType: player };
  }

  private buildPokemonRows(state: State, playerId: number, playerType: PlayerType, slots: SlotType[]): PokemonRow[] {
    const player = state.players.find(p => p.id === playerId);
    const opponent = state.players.find(p => p.id !== playerId);
    if (player === undefined || opponent === undefined) {
      return;
    }

    const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(playerType);
    const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(playerType);
    const hasBench = slots.includes(SlotType.BENCH);
    const hasActive = slots.includes(SlotType.ACTIVE);

    const rows: PokemonRow[] = [];
    if (hasOpponent && hasBench) {
      rows.push(this.buildRow(opponent.bench, PlayerType.TOP_PLAYER, SlotType.BENCH));
    }
    if (hasOpponent && hasActive) {
      rows.push(this.buildRow([opponent.active], PlayerType.TOP_PLAYER, SlotType.ACTIVE));
    }
    if (hasPlayer && hasActive) {
      rows.push(this.buildRow([player.active], PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE));
    }
    if (hasPlayer && hasBench) {
      rows.push(this.buildRow(player.bench, PlayerType.BOTTOM_PLAYER, SlotType.BENCH));
    }

    return rows;
  }

  public getRows(): PokemonRow[] {
    return this.rows;
  }

  public getSelectedTargets(): CardTarget[] {
    const result: CardTarget[] = [];
    this.rows.forEach(row => row.items.forEach((item, index) => {
      if (item.selected) {
        result.push(item.target);
      }
    }));
    return result;
  }

  public unselectAll(): void {
    this.rows.forEach(row => row.items.forEach(i => i.selected = false));
  }

  public countSelected(): number {
    let selected = 0;
    this.rows.forEach(r => r.items.forEach(i => selected += i.selected ? 1 : 0));
    return selected;
  }

  public matchesTarget(item: PokemonItem, targets: CardTarget[]): boolean {
    return targets.some(t => {
      return t.player === item.target.player
        && t.slot === item.target.slot
        && t.index === item.target.index;
    });
  }

  public getItemByTarget(target: CardTarget): PokemonItem | undefined {
    const rows = this.getRows();
    for (const row of rows) {
      for (const item of row.items) {
        if (this.matchesTarget(item, [target])) {
          // Restore saved state if it exists
          if (this.selectedEnergyState.has(target)) {
            item.cardList.cards = this.selectedEnergyState.get(target) || [];
          }
          return item;
        }
      }
    }
    return undefined;
  }

  public getCardIndex(card: Card): number {
    const cardIndex = this.cardIndexes.find(c => c.card === card);
    if (cardIndex === undefined) {
      return -1;
    }
    return cardIndex.index;
  }

}
