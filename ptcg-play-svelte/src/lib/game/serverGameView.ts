import type { CardsInfo, GameState, State } from 'ptcg-server';
import { Base64, CardManager, StateSerializer } from 'ptcg-server';
import { resolveCardImageUrl } from './cardImages';
import { SlotType, targetFor, type CardView, type GameView, type LogView, type PlayerView, type PokemonSlotView, type PromptView } from './types';

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

const promptSchemas: Record<string, string> = {
  AlertPrompt: 'true',
  AttachEnergyPrompt: '{ to: CardTarget, index: number }[] | null',
  ChooseAttackPrompt: '{ index: number, attack: string } | null',
  ChooseCardsPrompt: 'number[] | null',
  ChooseEnergyPrompt: 'number[] | null',
  ChoosePokemonPrompt: 'CardTarget[] | null',
  ChoosePrizePrompt: 'number[] | null',
  CoinFlipPrompt: 'boolean',
  ConfirmCardsPrompt: 'true',
  ConfirmPrompt: 'boolean',
  DiscardEnergyPrompt: '{ from: CardTarget, index: number }[] | null',
  InvitePlayerPrompt: 'string[] | { deck: string[] } | null',
  MoveDamagePrompt: '{ from: CardTarget, to: CardTarget }[] | null',
  MoveEnergyPrompt: '{ from: CardTarget, to: CardTarget, index: number }[] | null',
  OrderCardsPrompt: 'number[] | null',
  PutDamagePrompt: '{ target: CardTarget, damage: number }[] | null',
  RemoveDamagePrompt: '{ from: CardTarget, to: CardTarget }[] | null',
  SelectOptionPrompt: 'number | null',
  SelectPrompt: 'number | null',
  ShowCardsPrompt: 'true',
  ShowMulliganPrompt: 'true',
  ShuffleDeckPrompt: 'number[]',
  ShufflePrizesPrompt: 'number[]',
  WaitPrompt: 'null',
};

export function applyCardsInfoToSerializer(cardsInfo: CardsInfo): void {
  const cardManager = CardManager.getInstance();
  cardManager.loadCardsInfo(cardsInfo);
  StateSerializer.setKnownCards(cardManager.getAllCards().slice());
}

export function decodeServerState(stateData: string): State {
  const serializedState = new Base64().decode(stateData);
  return new StateSerializer().deserialize(serializedState);
}

export function gameStateToGameView(
  gameState: Pick<GameState, 'stateData'>,
  clientId: number,
  previousLogs: LogView[] = [],
): GameView {
  return stateToGameView(decodeServerState(gameState.stateData), clientId, previousLogs);
}

export function stateToGameView(state: State, clientId: number, previousLogs: LogView[] = []): GameView {
  const rawPlayers = Array.isArray((state as any).players) ? (state as any).players : [];
  const activePlayerIndex = Number((state as any).activePlayer ?? 0);
  const players = rawPlayers.map((player: any, index: number) => buildPlayerView(player, index, activePlayerIndex));
  const incomingLogs = Array.isArray((state as any).logs) ? (state as any).logs.map(normalizeLog) : [];
  const logs = mergeLogs(previousLogs, incomingLogs);

  return {
    ready: true,
    phase: Number((state as any).phase ?? 0),
    phaseLabel: phaseLabels[Number((state as any).phase ?? 0)] ?? String((state as any).phase ?? 'Unknown'),
    turn: Number((state as any).turn ?? 0),
    activePlayerIndex,
    activePlayerId: players[activePlayerIndex]?.id,
    winner: (state as any).winner,
    players,
    prompts: Array.isArray((state as any).prompts)
      ? (state as any).prompts
          .filter((prompt: any) => prompt?.result === undefined && Number(prompt?.playerId) === clientId)
          .map((prompt: any) => buildPromptView(state, prompt, players))
      : [],
    logs,
    events: [],
  };
}

function buildPlayerView(player: any, index: number, activePlayerIndex: number): PlayerView {
  return {
    index,
    id: Number(player?.id ?? index),
    name: String(player?.name ?? `Player ${index + 1}`),
    hand: normalizeCards(player?.hand?.cards),
    deckCount: normalizeCards(player?.deck?.cards).length,
    discard: normalizeCards(player?.discard?.cards),
    lostZone: normalizeCards(player?.lostzone?.cards ?? player?.lostZone?.cards),
    stadium: normalizeCards(player?.stadium?.cards),
    playZone: normalizeCards(player?.supporter?.cards ?? player?.playZone?.cards),
    prizesLeft: Array.isArray(player?.prizes)
      ? player.prizes.reduce((sum: number, prize: any) => sum + normalizeCards(prize?.cards).length, 0)
      : 0,
    active: buildPokemonSlot(player?.active, index, 'active', 0, activePlayerIndex),
    bench: Array.isArray(player?.bench)
      ? player.bench.map((slot: any, slotIndex: number) =>
          buildPokemonSlot(slot, index, 'bench', slotIndex, activePlayerIndex),
        )
      : [],
    playableCardIds: Array.isArray(player?.playableCardIds) ? player.playableCardIds : [],
  };
}

function buildPokemonSlot(
  slot: any,
  ownerIndex: number,
  kind: 'active' | 'bench',
  index: number,
  activePlayerIndex: number,
): PokemonSlotView {
  const cards = normalizeCards(slot?.cards);
  const pokemon = normalizeCard(callMaybe(slot, 'getPokemonCard') ?? slot?.pokemonCard ?? slot?.pokemon) ?? cards[0];
  return {
    ownerIndex,
    slot: kind,
    index,
    target: targetFor(activePlayerIndex, ownerIndex, kind === 'active' ? SlotType.ACTIVE : SlotType.BENCH, index),
    empty: cards.length === 0 && !pokemon,
    pokemon,
    cards,
    damage: Number(slot?.damage ?? 0),
    hp: Number(slot?.hp ?? pokemon?.hp ?? 0),
    retreat: Array.isArray(pokemon?.retreat) ? pokemon.retreat : [],
    energy: normalizeCards(slot?.energies?.cards ?? slot?.energy?.cards ?? slot?.energy),
    tools: normalizeCards(slot?.tools),
    specialConditions: Array.isArray(slot?.specialConditions) ? slot.specialConditions : [],
  };
}

function buildPromptView(state: State, prompt: any, players: PlayerView[]): PromptView {
  const className = prompt?.constructor?.name && prompt.constructor.name !== 'Object'
    ? prompt.constructor.name
    : String(prompt?._type ?? 'Prompt');
  return {
    id: Number(prompt.id ?? 0),
    className,
    type: String(prompt.type ?? className),
    playerId: Number(prompt.playerId ?? 0),
    playerIndex: players.findIndex((player) => player.id === Number(prompt.playerId ?? 0)),
    supported: className !== 'ShuffleHandPrompt',
    unsupportedReason: className === 'ShuffleHandPrompt' ? 'ShuffleHandPrompt is not supported in this UI.' : undefined,
    message: prompt.message === undefined ? undefined : String(prompt.message),
    resultSchema: promptSchemas[className] ?? 'unknown',
    fields: serializePromptFields(state, prompt, className),
  };
}

function serializePromptFields(state: State, prompt: any, className: string): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  copyIfPresent(fields, prompt, 'duration');
  copyIfPresent(fields, prompt, 'playerType');
  copyIfPresent(fields, prompt, 'slots');
  copyIfPresent(fields, prompt, 'filter');
  copyIfPresent(fields, prompt, 'options');
  copyIfPresent(fields, prompt, 'values');
  copyIfPresent(fields, prompt, 'damage');
  copyIfPresent(fields, prompt, 'cost');

  if (Array.isArray(prompt?.cards)) {
    fields.cards = normalizeCards(prompt.cards).map((card, index) => ({ index, ...card }));
  } else if (Array.isArray(prompt?.cards?.cards)) {
    fields.cardList = normalizeCards(prompt.cards.cards).map((card, index) => ({ index, ...card }));
  }
  if (Array.isArray(prompt?.cardList?.cards)) {
    fields.cardList = normalizeCards(prompt.cardList.cards).map((card, index) => ({ index, ...card }));
  }
  if (Array.isArray(prompt?.energy)) {
    fields.energy = prompt.energy.map((item: any, index: number) => ({
      index,
      card: normalizeCard(item?.card),
      provides: item?.provides,
    }));
  }
  if (Array.isArray(prompt?.maxAllowedDamage)) {
    fields.maxAllowedDamage = prompt.maxAllowedDamage;
  }
  if (Array.isArray(prompt?.hands)) {
    fields.hands = prompt.hands.map((cards: any[]) => normalizeCards(cards));
  }
  if (className === 'ChoosePrizePrompt') {
    fields.prizes = prizeChoicesForPrompt(state, prompt);
  }
  return fields;
}

function prizeChoicesForPrompt(state: State, prompt: any) {
  const player = (state as any).players?.find((item: any) => item.id === prompt.playerId);
  const targetPlayer = prompt?.options?.useOpponentPrizes
    ? (state as any).players?.find((item: any) => item.id !== prompt.playerId)
    : player;
  return (targetPlayer?.prizes ?? [])
    .map((prize: any, index: number) => ({
      index,
      empty: normalizeCards(prize?.cards).length === 0,
      cards: prompt?.options?.isSecret ? [] : normalizeCards(prize?.cards),
    }))
    .filter((prize: any) => !prize.empty);
}

function normalizeCards(cards: unknown): CardView[] {
  return Array.isArray(cards) ? cards.map(normalizeCard).filter((card): card is CardView => !!card) : [];
}

function normalizeCard(card: any): CardView | undefined {
  if (!card) {
    return undefined;
  }
  if (typeof card === 'string') {
    return { name: card, fullName: card };
  }
  return {
    id: typeof card.id === 'number' ? card.id : undefined,
    name: String(card.name ?? card.fullName ?? 'Unknown'),
    fullName: String(card.fullName ?? card.name ?? 'Unknown'),
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
    retreat: Array.isArray(card.retreat) ? card.retreat : undefined,
    attacks: Array.isArray(card.attacks)
      ? card.attacks.map((attack: any) => ({
          name: String(attack.name ?? ''),
          cost: attack.cost,
          damage: attack.damage,
          text: attack.text,
        }))
      : undefined,
    powers: Array.isArray(card.powers)
      ? card.powers.map((power: any) => ({
          name: String(power.name ?? ''),
          powerType: power.powerType,
          text: power.text,
        }))
      : undefined,
  };
}

function normalizeLog(log: any): LogView {
  return {
    id: Number(log?.id ?? 0),
    message: String(log?.message ?? ''),
    params: log?.params,
    client: log?.client,
  };
}

function mergeLogs(previousLogs: LogView[], incomingLogs: LogView[]): LogView[] {
  const seen = new Set(previousLogs.map((log) => log.id));
  return [...previousLogs, ...incomingLogs.filter((log) => !seen.has(log.id))];
}

function copyIfPresent(target: Record<string, unknown>, source: Record<string, unknown>, key: string): void {
  if (source?.[key] !== undefined) {
    target[key] = source[key];
  }
}

function callMaybe(target: any, method: string): unknown {
  return typeof target?.[method] === 'function' ? target[method]() : undefined;
}
