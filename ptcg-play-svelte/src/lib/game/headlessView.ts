import { resolveCardImageUrl } from './cardImages';
import {
  SlotType,
  targetFor,
  type AvailableActionsView,
  type CardView,
  type GameView,
  type PlayerView,
  type PokemonSlotView,
  type PromptView,
} from './types';

const phaseLabels: Record<number, string> = {
  0: 'Waiting',
  1: 'Setup',
  2: 'Player turn',
  3: 'Attack',
  4: 'After attack',
  5: 'Choose prizes',
  6: 'Between turns',
  7: 'Finished',
};

export function buildHeadlessGameView(snapshot: any): GameView {
  const summary = snapshot.summary;
  const activePlayerIndex = summary?.activePlayer ?? 0;
  const players = Array.isArray(summary?.players)
    ? summary.players.map((player: any, index: number) => buildPlayerView(player, index, activePlayerIndex))
    : [];
  return {
    ready: true,
    phase: summary?.phase ?? 0,
    phaseLabel: phaseLabels[summary?.phase] ?? String(summary?.phase ?? 'Unknown'),
    turn: summary?.turn ?? 0,
    activePlayerIndex,
    activePlayerId: players[activePlayerIndex]?.id,
    winner: summary?.winner,
    players,
    prompts: Array.isArray(snapshot.prompts)
      ? snapshot.prompts.map((prompt: any) => ({
          ...prompt,
          playerIndex: players.findIndex((player: PlayerView) => player.id === prompt.playerId),
        })) satisfies PromptView[]
      : [],
    logs: Array.isArray(summary?.logs) ? summary.logs : [],
    events: Array.isArray(snapshot.events) ? snapshot.events : [],
  };
}

function buildPlayerView(player: any, index: number, activePlayerIndex: number): PlayerView {
  return {
    index,
    id: player.id,
    name: player.name,
    hand: normalizeCards(player.hand),
    deckCount: player.deckCount ?? 0,
    discard: normalizeCards(player.discard),
    lostZone: normalizeCards(player.lostZone),
    stadium: normalizeCards(player.stadium),
    playZone: normalizeCards(player.playZone),
    prizesLeft: player.prizesLeft ?? 0,
    active: buildPokemonSlot(player.active, index, 'active', 0, activePlayerIndex),
    bench: Array.isArray(player.bench)
      ? player.bench.map((slot: any, slotIndex: number) =>
          buildPokemonSlot(slot, index, 'bench', slotIndex, activePlayerIndex),
        )
      : [],
    playableCardIds: Array.isArray(player.playableCardIds) ? player.playableCardIds : [],
    availableActions: normalizeAvailableActions(player.availableActions),
  };
}

function buildPokemonSlot(
  slot: any,
  ownerIndex: number,
  kind: 'active' | 'bench',
  index: number,
  activePlayerIndex: number,
): PokemonSlotView {
  const slotType = kind === 'active' ? SlotType.ACTIVE : SlotType.BENCH;
  const cards = normalizeCards(slot?.cards);
  const pokemon = normalizeCard(slot?.pokemonCard ?? slot?.pokemon) ?? cards[0];
  return {
    ownerIndex,
    slot: kind,
    index,
    target: targetFor(activePlayerIndex, ownerIndex, slotType, index),
    empty: cards.length === 0 && !pokemon,
    pokemon,
    cards,
    damage: slot?.damage ?? 0,
    hp: slot?.hp ?? 0,
    retreat: Array.isArray(slot?.retreat) ? slot.retreat : [],
    energy: normalizeCards(slot?.energy),
    tools: normalizeCards(slot?.tools),
    specialConditions: Array.isArray(slot?.specialConditions) ? slot.specialConditions : [],
  };
}

function normalizeCards(cards: unknown): CardView[] {
  if (!Array.isArray(cards)) {
    return [];
  }
  return cards.map(normalizeCard).filter((card): card is CardView => card != null);
}

function normalizeCard(card: any): CardView | undefined {
  if (!card) {
    return undefined;
  }
  if (typeof card === 'string') {
    return {
      name: card.replace(/\s+[A-Z0-9-]{2,8}(?:\s+\d+)?$/, ''),
      fullName: card,
    };
  }
  return {
    id: card.id,
    name: card.name ?? card.fullName ?? 'Unknown',
    fullName: card.fullName ?? card.name ?? 'Unknown',
    set: card.set,
    setNumber: card.setNumber,
    cardImage: card.cardImage,
    imageUrl: resolveCardImageUrl(card),
    superType: card.superType,
    cardType: card.cardType,
    trainerType: card.trainerType,
    energyType: card.energyType,
    stage: card.stage,
    evolvesFrom: card.evolvesFrom,
    hp: typeof card.hp === 'number' ? card.hp : undefined,
    attacks: card.attacks,
    powers: card.powers,
  };
}

function normalizeAvailableActions(value: any): AvailableActionsView | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }
  return {
    active: value.active
      ? {
          attacks: normalizeActionStatuses(value.active.attacks),
          abilities: normalizeAbilityStatuses(value.active.abilities),
          retreat: {
            legal: value.active.retreat?.legal === true,
            targets: Array.isArray(value.active.retreat?.targets) ? value.active.retreat.targets.filter(Number.isInteger) : [],
            reason: typeof value.active.retreat?.reason === 'string' ? value.active.retreat.reason : undefined,
          },
        }
      : undefined,
    bench: Array.isArray(value.bench)
      ? value.bench.map((item: any) => ({
          index: Number.isInteger(item?.index) ? item.index : 0,
          abilities: normalizeAbilityStatuses(item?.abilities),
        }))
      : [],
  };
}

function normalizeActionStatuses(value: any): NonNullable<AvailableActionsView['active']>['attacks'] {
  return Array.isArray(value)
    ? value
        .filter((item: any) => typeof item?.name === 'string')
        .map((item: any) => ({
          name: item.name,
          legal: item.legal === true,
          reason: typeof item.reason === 'string' ? item.reason : undefined,
        }))
    : [];
}

function normalizeAbilityStatuses(value: any): NonNullable<AvailableActionsView['active']>['abilities'] {
  return normalizeActionStatuses(value).map((item, index) => ({
    ...item,
    used: value?.[index]?.used === true,
  }));
}
