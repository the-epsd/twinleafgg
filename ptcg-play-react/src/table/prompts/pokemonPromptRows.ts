import type { CardTarget, State } from 'ptcg-server';
import { PlayerType, PokemonCardList, SlotType } from 'ptcg-server';

export type PokemonItem = {
  cardList: PokemonCardList;
  selected: boolean;
  target: CardTarget;
};

export type PokemonRow = {
  items: PokemonItem[];
  playerType: PlayerType;
};

export function clonePokemonCardList(source: PokemonCardList): PokemonCardList {
  return Object.assign(new PokemonCardList(), source);
}

function buildRow(cardLists: PokemonCardList[], player: PlayerType, slot: SlotType): PokemonRow {
  const base: CardTarget = { player, slot, index: 0 };
  const items = cardLists.map((cardList, index) => ({
    cardList: clonePokemonCardList(cardList),
    selected: false,
    target: { ...base, index },
  }));
  return { items, playerType: player };
}

/** Row order for prompt panes: opponent bench/active, then player active/bench. */
export function buildPokemonPromptRows(
  state: State,
  playerId: number,
  playerType: PlayerType,
  slots: SlotType[],
): PokemonRow[] {
  const player = state.players.find((p) => p.id === playerId);
  const opponent = state.players.find((p) => p.id !== playerId);
  if (player === undefined || opponent === undefined) {
    return [];
  }

  const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(playerType);
  const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(playerType);
  const hasBench = slots.includes(SlotType.BENCH);
  const hasActive = slots.includes(SlotType.ACTIVE);

  const rows: PokemonRow[] = [];
  if (hasOpponent && hasBench) {
    rows.push(buildRow(opponent.bench, PlayerType.TOP_PLAYER, SlotType.BENCH));
  }
  if (hasOpponent && hasActive) {
    rows.push(buildRow([opponent.active], PlayerType.TOP_PLAYER, SlotType.ACTIVE));
  }
  if (hasPlayer && hasActive) {
    rows.push(buildRow([player.active], PlayerType.BOTTOM_PLAYER, SlotType.ACTIVE));
  }
  if (hasPlayer && hasBench) {
    rows.push(buildRow(player.bench, PlayerType.BOTTOM_PLAYER, SlotType.BENCH));
  }
  return rows;
}

export function matchesPokemonTarget(item: PokemonItem, targets: CardTarget[]): boolean {
  return targets.some(
    (t) =>
      t.player === item.target.player && t.slot === item.target.slot && t.index === item.target.index,
  );
}

export function mapPokemonItems(rows: PokemonRow[], fn: (item: PokemonItem) => PokemonItem): PokemonRow[] {
  return rows.map((row) => ({
    ...row,
    items: row.items.map(fn),
  }));
}

/** Live state: your Pokémon in this prompt with 0 damage cannot be selected. */
export function scanBlockedOwnZeroDamageFromState(
  state: State,
  playerId: number,
  playerType: PlayerType,
  slots: SlotType[],
): CardTarget[] {
  const player = state.players.find((p) => p.id === playerId);
  const opponent = state.players.find((p) => p.id !== playerId);
  if (player === undefined || opponent === undefined) {
    return [];
  }

  const hasOpponent = [PlayerType.TOP_PLAYER, PlayerType.ANY].includes(playerType);
  const hasPlayer = [PlayerType.BOTTOM_PLAYER, PlayerType.ANY].includes(playerType);
  const hasBench = slots.includes(SlotType.BENCH);
  const hasActive = slots.includes(SlotType.ACTIVE);

  const out: CardTarget[] = [];
  const pushIfBlocked = (cardList: PokemonCardList, target: CardTarget) => {
    if (cardList.cards.length === 0) {
      return;
    }
    if (target.player === PlayerType.BOTTOM_PLAYER && cardList.damage === 0) {
      out.push({ ...target });
    }
  };

  if (hasOpponent && hasBench) {
    opponent.bench.forEach((cl, i) =>
      pushIfBlocked(cl, { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: i }),
    );
  }
  if (hasOpponent && hasActive) {
    pushIfBlocked(opponent.active, { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 });
  }
  if (hasPlayer && hasActive) {
    pushIfBlocked(player.active, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 });
  }
  if (hasPlayer && hasBench) {
    player.bench.forEach((cl, i) =>
      pushIfBlocked(cl, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: i }),
    );
  }
  return out;
}

/** After local edits: recompute blocked slots for the board overlay. */
export function scanBlockedOwnZeroDamageFromRows(rows: PokemonRow[]): CardTarget[] {
  const out: CardTarget[] = [];
  for (const row of rows) {
    for (const item of row.items) {
      if (item.cardList.cards.length === 0) {
        continue;
      }
      if (item.target.player === PlayerType.BOTTOM_PLAYER && item.cardList.damage === 0) {
        out.push({ ...item.target });
      }
    }
  }
  return out;
}
