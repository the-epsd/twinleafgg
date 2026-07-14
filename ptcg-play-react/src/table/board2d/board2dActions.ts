import {
  PlayerType,
  SlotType,
  Stage,
  SuperType,
  TrainerType,
  type Card,
  type CardList,
  type CardTarget,
  type Player,
  type PokemonCard,
  type TrainerCard,
} from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import type { Board3dCardsAdapter } from '../board3d/board3dCardsAdapter';
import type { Board3dGameActions } from '../board3d/board3dGameActions';
import type { BoardInteractionService } from '../BoardInteractionService';

export type Board2dActionContext = {
  gameState: LocalGameState;
  topPlayer: Player;
  bottomPlayer: Player;
  clientId: number;
  cardsAdapter: Board3dCardsAdapter;
  gameActions: Board3dGameActions;
  boardInteraction: BoardInteractionService;
};

function players(ctx: Board2dActionContext): Player[] {
  return [ctx.topPlayer, ctx.bottomPlayer].filter(Boolean);
}

function isBottomOwner(ctx: Board2dActionContext): boolean {
  return !!ctx.bottomPlayer && ctx.bottomPlayer.id === ctx.clientId;
}

async function applyCardInfoResult(
  ctx: Board2dActionContext,
  result: Awaited<ReturnType<Board3dCardsAdapter['showCardInfo']>>,
  target: CardTarget,
  card?: Card,
): Promise<void> {
  if (!result) {
    return;
  }
  const gameId = ctx.gameState.gameId;
  if (result.ability) {
    if (result.card?.superType === SuperType.TRAINER) {
      await ctx.gameActions.trainerAbility(gameId, result.ability, target);
    } else if (result.card?.superType === SuperType.ENERGY) {
      await ctx.gameActions.energyAbility(gameId, result.ability, target);
    } else {
      await ctx.gameActions.ability(gameId, result.ability, target);
    }
  } else if (result.attack) {
    const attacks = (card as PokemonCard | undefined)?.attacks;
    const attack = attacks?.find((a) => a.name === result.attack);
    if (attack && (attack.useOnBench || target.slot !== SlotType.BENCH)) {
      await ctx.gameActions.attack(gameId, result.attack);
    } else if (!attacks) {
      await ctx.gameActions.attack(gameId, result.attack);
    }
  } else if (result.retreat) {
    await ctx.gameActions.retreatStart(gameId);
  } else if (result.trainer) {
    await ctx.gameActions.stadium(gameId);
  }
}

export async function handleBoard2dActiveClick(ctx: Board2dActionContext): Promise<void> {
  const list = ctx.bottomPlayer?.active;
  const card = list?.cards?.[list.cards.length - 1];
  if (!card || !list) {
    return;
  }

  if (ctx.boardInteraction.isSelectionActive()) {
    const target: CardTarget = {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.ACTIVE,
      index: 0,
    };
    if (ctx.boardInteraction.isTargetEligible(target)) {
      ctx.boardInteraction.toggleTarget(target);
    }
    return;
  }

  await handleBoard2dActiveInfo(ctx);
}

/** Always open card info (e.g. right-click), including during selection. */
export async function handleBoard2dActiveInfo(ctx: Board2dActionContext): Promise<void> {
  const list = ctx.bottomPlayer?.active;
  const card = list?.cards?.[list.cards.length - 1];
  if (!card || !list) {
    return;
  }

  if (!isBottomOwner(ctx) || ctx.gameState.deleted) {
    await ctx.cardsAdapter.showCardInfo({
      card,
      cardList: list,
      players: players(ctx),
    });
    return;
  }

  const target: CardTarget = {
    player: PlayerType.BOTTOM_PLAYER,
    slot: SlotType.ACTIVE,
    index: 0,
  };
  const canRetreat =
    !!ctx.bottomPlayer &&
    !!ctx.gameState.state &&
    ctx.bottomPlayer.retreatedTurn !== ctx.gameState.state.turn;
  const options = {
    enableAbility: { useWhenInPlay: true },
    enableAttack: true,
    enableRetreat: canRetreat,
  };
  const result = await ctx.cardsAdapter.showCardInfo({
    card,
    cardList: list,
    options,
    players: players(ctx),
  });
  await applyCardInfoResult(ctx, result, target, card);
}

export async function handleBoard2dBenchClick(
  ctx: Board2dActionContext,
  index: number,
  ownerPlayer: 'bottom' | 'top',
): Promise<void> {
  const player = ownerPlayer === 'bottom' ? ctx.bottomPlayer : ctx.topPlayer;
  const playerType =
    ownerPlayer === 'bottom' ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER;
  const list = player?.bench?.[index];
  const card = list?.getPokemonCard?.() ?? list?.cards?.[list.cards.length - 1];
  if (!card || !list) {
    return;
  }

  if (ctx.boardInteraction.isSelectionActive()) {
    const target: CardTarget = { player: playerType, slot: SlotType.BENCH, index };
    if (ctx.boardInteraction.isTargetEligible(target)) {
      ctx.boardInteraction.toggleTarget(target);
    }
    return;
  }

  await handleBoard2dBenchInfo(ctx, index, ownerPlayer);
}

/** Always open card info (e.g. right-click), including during selection. */
export async function handleBoard2dBenchInfo(
  ctx: Board2dActionContext,
  index: number,
  ownerPlayer: 'bottom' | 'top',
): Promise<void> {
  const player = ownerPlayer === 'bottom' ? ctx.bottomPlayer : ctx.topPlayer;
  const list = player?.bench?.[index];
  const card = list?.getPokemonCard?.() ?? list?.cards?.[list.cards.length - 1];
  if (!card || !list) {
    return;
  }

  if (ownerPlayer !== 'bottom' || !isBottomOwner(ctx) || ctx.gameState.deleted) {
    await ctx.cardsAdapter.showCardInfo({
      card,
      cardList: list,
      players: players(ctx),
    });
    return;
  }

  const target: CardTarget = {
    player: PlayerType.BOTTOM_PLAYER,
    slot: SlotType.BENCH,
    index,
  };
  const hasUseOnBenchAttack = (card as PokemonCard).attacks?.some((a) => a.useOnBench);
  const options = {
    enableAbility: { useWhenInPlay: true },
    enableAttack: !!hasUseOnBenchAttack,
    enableBenchAttack: !!hasUseOnBenchAttack,
  };
  const result = await ctx.cardsAdapter.showCardInfo({
    card,
    cardList: list,
    options,
    players: players(ctx),
  });
  await applyCardInfoResult(ctx, result, target, card);
}

export async function handleBoard2dStadiumClick(
  ctx: Board2dActionContext,
  stadiumCard: CardList | null | undefined,
): Promise<void> {
  const card = stadiumCard?.cards?.[stadiumCard.cards.length - 1];
  if (!card || !stadiumCard) {
    return;
  }
  if (!isBottomOwner(ctx) || ctx.gameState.deleted) {
    await ctx.cardsAdapter.showCardInfo({
      card,
      cardList: stadiumCard,
      players: players(ctx),
    });
    return;
  }
  const result = await ctx.cardsAdapter.showCardInfo({
    card,
    cardList: stadiumCard,
    options: { enableTrainer: true },
    players: players(ctx),
  });
  if (result?.trainer) {
    await ctx.gameActions.stadium(ctx.gameState.gameId);
  }
}

export async function handleBoard2dDiscardClick(
  ctx: Board2dActionContext,
  which: 'bottom' | 'top',
): Promise<void> {
  const player = which === 'bottom' ? ctx.bottomPlayer : ctx.topPlayer;
  const list = player?.discard;
  const card = list?.cards?.[list.cards.length - 1];
  if (!card || !list) {
    return;
  }

  const isOwner = which === 'bottom' && isBottomOwner(ctx);
  if (!isOwner || ctx.gameState.deleted) {
    await ctx.cardsAdapter.showCardInfoList({
      card,
      cardList: list,
      players: players(ctx),
    });
    return;
  }

  const result = await ctx.cardsAdapter.showCardInfoList({
    card,
    cardList: list,
    options: { enableAbility: { useFromDiscard: true }, enableAttack: false },
    players: players(ctx),
  });
  if (!result?.ability || !result.card) {
    return;
  }
  const index = list.cards.indexOf(result.card);
  const target: CardTarget = {
    player: PlayerType.BOTTOM_PLAYER,
    slot: SlotType.DISCARD,
    index,
  };
  await applyCardInfoResult(ctx, result, target, result.card);
}

export async function handleBoard2dDeckClick(
  ctx: Board2dActionContext,
  which: 'bottom' | 'top',
): Promise<void> {
  const player = which === 'bottom' ? ctx.bottomPlayer : ctx.topPlayer;
  const list = player?.deck;
  const card = list?.cards?.[list.cards.length - 1];
  if (!list) {
    return;
  }
  await ctx.cardsAdapter.showCardInfoList({
    card,
    cardList: list,
    allowReveal: !!ctx.gameState.replay,
    facedown: true,
    players: players(ctx),
  });
}

export async function handleBoard2dLostZoneClick(
  ctx: Board2dActionContext,
  which: 'bottom' | 'top',
): Promise<void> {
  const player = which === 'bottom' ? ctx.bottomPlayer : ctx.topPlayer;
  const list = player?.lostzone;
  const card = list?.cards?.[list.cards.length - 1];
  if (!list) {
    return;
  }
  await ctx.cardsAdapter.showCardInfoList({
    card,
    cardList: list,
    players: players(ctx),
  });
}

export async function handleBoard2dPrizeClick(
  ctx: Board2dActionContext,
  player: Player,
  prize: CardList,
): Promise<void> {
  if (!prize.cards.length) {
    return;
  }
  const owner = player.id === ctx.clientId;
  const facedown = prize.isSecret || (!prize.isPublic && !owner);
  await ctx.cardsAdapter.showCardInfo({
    card: prize.cards[0],
    allowReveal: facedown && !!ctx.gameState.replay,
    facedown,
    players: players(ctx),
  });
}

export async function handleBoard2dHandClick(
  ctx: Board2dActionContext,
  card: Card,
  index: number,
): Promise<void> {
  if (ctx.boardInteraction.isSelectionActive()) {
    const target: CardTarget = {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.HAND,
      index,
    };
    if (ctx.boardInteraction.isTargetEligible(target)) {
      ctx.boardInteraction.toggleTarget(target);
    }
    return;
  }

  const list = ctx.bottomPlayer?.hand;
  if (!isBottomOwner(ctx) || ctx.gameState.deleted || !list) {
    await ctx.cardsAdapter.showCardInfo({
      card,
      cardList: list,
      players: players(ctx),
    });
    return;
  }

  const target: CardTarget = {
    player: PlayerType.BOTTOM_PLAYER,
    slot: SlotType.HAND,
    index,
  };
  const result = await ctx.cardsAdapter.showCardInfo({
    card,
    cardList: list,
    options: { enableAbility: { useFromHand: true }, enableAttack: false },
    players: players(ctx),
  });
  await applyCardInfoResult(ctx, result, target, card);
}

export async function handleBoard2dPlayFromHand(
  ctx: Board2dActionContext,
  handIndex: number,
  target: CardTarget,
): Promise<void> {
  await ctx.gameActions.playCardAction(ctx.gameState.gameId, handIndex, target);
}

export async function handleBoard2dRetreat(
  ctx: Board2dActionContext,
  benchIndex: number,
): Promise<void> {
  await ctx.gameActions.retreatAction(ctx.gameState.gameId, benchIndex);
}

/** Find legal attach/evolve targets for click-to-play when multiple hosts exist. */
export function findAttachTargets(
  bottomPlayer: Player,
  card: Card,
): CardTarget[] {
  const targets: CardTarget[] = [];
  const isEnergy = card.superType === SuperType.ENERGY;
  const isTool = card.superType === SuperType.TRAINER;
  const isEvo =
    card.superType === SuperType.POKEMON &&
    !!(card as PokemonCard).evolvesFrom;

  const consider = (list: CardList | undefined, index: number, slot: SlotType) => {
    if (!list?.cards?.length) {
      return;
    }
    const pokemon = (list as { getPokemonCard?: () => Card | undefined }).getPokemonCard?.();
    if (!pokemon && (isEnergy || isTool || isEvo)) {
      return;
    }
    if (isEvo) {
      const evo = card as PokemonCard;
      const host = pokemon as PokemonCard;
      if (
        evo.evolvesFrom === host.name ||
        host.evolvesTo?.includes(evo.name) ||
        (evo.evolvesFrom && host.name?.startsWith(`${evo.evolvesFrom} `))
      ) {
        targets.push({ player: PlayerType.BOTTOM_PLAYER, slot, index });
      }
      return;
    }
    if (isEnergy || isTool) {
      targets.push({ player: PlayerType.BOTTOM_PLAYER, slot, index });
    }
  };

  consider(bottomPlayer.active, 0, SlotType.ACTIVE);
  bottomPlayer.bench?.forEach((b, i) => consider(b, i, SlotType.BENCH));
  return targets;
}

export function resolveClickToPlayTarget(
  bottomPlayer: Player,
  card: Card,
): CardTarget | CardTarget[] | null {
  const isPokemon = card.superType === SuperType.POKEMON;
  const trainer = card.superType === SuperType.TRAINER ? (card as TrainerCard) : null;

  if (isEnergyOrToolOrEvo(card)) {
    const targets = findAttachTargets(bottomPlayer, card);
    if (targets.length === 0) {
      return null;
    }
    if (targets.length === 1) {
      return targets[0];
    }
    return targets;
  }

  if (
    trainer &&
    (trainer.trainerType === TrainerType.STADIUM ||
      trainer.trainerType === TrainerType.SUPPORTER ||
      trainer.trainerType === TrainerType.ITEM)
  ) {
    return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
  }

  if (isPokemon) {
    const stage = (card as PokemonCard).stage;
    const activeEmpty = !bottomPlayer.active?.cards?.length;
    if (activeEmpty && stage === Stage.BASIC) {
      return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
    }
    const emptyBench =
      bottomPlayer.bench?.findIndex((b) => (b?.cards?.length ?? 0) === 0) ?? -1;
    if (emptyBench >= 0 && stage === Stage.BASIC) {
      return {
        player: PlayerType.BOTTOM_PLAYER,
        slot: SlotType.BENCH,
        index: emptyBench,
      };
    }
    return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
  }

  return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
}

function isEnergyOrToolOrEvo(card: Card): boolean {
  if (card.superType === SuperType.ENERGY) {
    return true;
  }
  if (
    card.superType === SuperType.TRAINER &&
    (card as TrainerCard).trainerType === TrainerType.TOOL
  ) {
    return true;
  }
  if (card.superType === SuperType.POKEMON && !!(card as PokemonCard).evolvesFrom) {
    return true;
  }
  return false;
}
