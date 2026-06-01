import { Action } from '../store/actions/action';
import { AddPlayerAction } from '../store/actions/add-player-action';
import { buildReplayActionPayload } from '../core/replay-actions';
import { ConcedeAction } from '../store/actions/concede-action';
import { AttackAction, PassTurnAction, RetreatAction, UseAbilityAction, UseStadiumAction } from '../store/actions/game-actions';
import { PlayCardAction, CardTarget, PlayerType, SlotType } from '../store/actions/play-card-action';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
import { EnergyCard } from '../store/card/energy-card';
import { PokemonCard } from '../store/card/pokemon-card';
import { BoardEffect } from '../store/card/card-types';
import { Attack, Power } from '../store/card/pokemon-types';
import { GameError } from '../game-error';
import { GameSettings } from '../core/game-settings';
import { State, GamePhase } from '../store/state/state';
import { CardList } from '../store/state/card-list';
import { Player } from '../store/state/player';
import { PokemonCardList } from '../store/state/pokemon-card-list';
import { Prompt } from '../store/prompts/prompt';
import { CoinFlipPrompt } from '../store/prompts/coin-flip-prompt';
import { ShuffleDeckPrompt } from '../store/prompts/shuffle-prompt';
import { ShuffleHandPrompt } from '../store/prompts/shuffle-hand-prompt';
import { ShufflePrizesPrompt } from '../store/prompts/shuffle-prizes-prompt';
import { WaitPrompt } from '../store/prompts/wait-prompt';
import { CheckHpEffect } from '../store/effects/check-effects';
import { Store } from '../store/store';
import { StoreHandler } from '../store/store-handler';
import { StateSerializer } from '../serializer/state-serializer';
import { CardManager } from '../cards/card-manager';
import { resolveCardImageUrl } from '../cards/card-image-resolver';
import { registerCardsForNames } from '../../sets/registry/card-registration';
import { HeadlessPromptResolver, HeadlessPromptOverride } from './prompt-resolution';
import { serializeHeadlessPrompt } from './prompt-adapters';

export type HeadlessPromptMode = 'auto' | 'manual';

export interface HeadlessPokemonSlotConfig {
  card: string;
  energy?: string[];
  damage?: number;
  tools?: string[];
}

export interface HeadlessPlayerScenarioConfig {
  name?: string;
  active: HeadlessPokemonSlotConfig;
  bench?: HeadlessPokemonSlotConfig[];
  hand?: string[];
  deck?: string[];
  discard?: string[];
  lostzone?: string[];
  stadium?: string[];
  supporter?: string[];
  prizeCount?: number;
}

export interface HeadlessScenarioConfig {
  player1: HeadlessPlayerScenarioConfig;
  player2: HeadlessPlayerScenarioConfig;
  turn?: number;
  activePlayer?: number;
  promptMode?: HeadlessPromptMode;
  gameSettings?: Partial<GameSettings>;
}

export interface HeadlessDeckPlayerConfig {
  id?: number;
  name: string;
  deck: string[];
}

export interface HeadlessDeckGameConfig {
  player1: HeadlessDeckPlayerConfig;
  player2: HeadlessDeckPlayerConfig;
  promptMode?: HeadlessPromptMode;
  gameSettings?: Partial<GameSettings>;
}

export interface HeadlessEvent {
  type: string;
  payload?: any;
}

export interface HeadlessSnapshot {
  summary: any;
  prompts: any[];
  events: HeadlessEvent[];
  serializedState: string;
}

export interface AvailableActionStatus {
  name: string;
  legal: boolean;
  reason?: string;
}

export interface AvailableAbilityStatus extends AvailableActionStatus {
  used?: boolean;
}

export interface AvailableRetreatStatus {
  legal: boolean;
  targets: number[];
  reason?: string;
}

export interface AvailableActionsView {
  active?: {
    attacks: AvailableActionStatus[];
    abilities: AvailableAbilityStatus[];
    retreat: AvailableRetreatStatus;
  };
  bench: Array<{
    index: number;
    abilities: AvailableAbilityStatus[];
  }>;
}

const DEFAULT_FILLER = 'Water Energy SVE';

class HeadlessStoreHandler implements StoreHandler {
  private isResolving = false;

  constructor(
    private resolver: HeadlessPromptResolver,
    private getStore: () => Store,
    private events: HeadlessEvent[],
    private promptMode: HeadlessPromptMode
  ) {}

  public onAction(action: Action, state: State): void {
    this.events.push({
      type: 'action',
      payload: {
        type: action.type,
        turn: state.turn,
        phase: state.phase,
        activePlayer: state.activePlayer,
        payload: buildReplayActionPayload(action)
      }
    });
  }

  public onStateChange(state: State): void {
    this.events.push({ type: 'stateChange' });
    if (this.isResolving) {
      return;
    }

    this.isResolving = true;
    try {
      let resolved = true;
      let guard = 0;
      while (resolved && guard < 100) {
        guard += 1;
        resolved = false;
        const pending = state.prompts.filter(prompt => prompt.result === undefined);
        for (const prompt of pending) {
          if (this.promptMode !== 'auto' && !isMechanicalPrompt(prompt)) {
            continue;
          }
          this.getStore().dispatch(this.resolver.resolve(state, prompt));
          resolved = true;
          break;
        }
      }
      if (guard >= 100) {
        throw new Error('[headless] Prompt auto-resolution guard exceeded');
      }
    } finally {
      this.isResolving = false;
    }
  }
}

class DryRunStoreHandler implements StoreHandler {
  public onAction(_action: Action, _state: State): void {}
  public onStateChange(_state: State): void {}
}

function isMechanicalPrompt(prompt: Prompt<any>): boolean {
  return prompt instanceof CoinFlipPrompt
    || prompt instanceof ShuffleDeckPrompt
    || prompt instanceof ShuffleHandPrompt
    || prompt instanceof ShufflePrizesPrompt
    || prompt instanceof WaitPrompt;
}

export class HeadlessGameSession {
  public readonly store: Store;
  private readonly resolver = new HeadlessPromptResolver();
  private readonly events: HeadlessEvent[] = [];

  private constructor(public readonly promptMode: HeadlessPromptMode) {
    const handler = new HeadlessStoreHandler(
      this.resolver,
      () => this.store,
      this.events,
      promptMode
    );
    this.store = new Store(handler);
  }

  public static fromScenario(config: HeadlessScenarioConfig): HeadlessGameSession {
    registerCardsForNames(collectScenarioCardNames(config));
    const session = new HeadlessGameSession(config.promptMode ?? 'auto');
    session.store.state = buildScenarioState(config);
    return session;
  }

  public static fromDecks(config: HeadlessDeckGameConfig): HeadlessGameSession {
    registerCardsForNames([...config.player1.deck, ...config.player2.deck]);
    const session = new HeadlessGameSession(config.promptMode ?? 'auto');
    session.applyGameSettings(config.gameSettings);
    session.store.dispatch(new AddPlayerAction(config.player1.id ?? 1, config.player1.name, config.player1.deck));
    session.store.dispatch(new AddPlayerAction(config.player2.id ?? 2, config.player2.name, config.player2.deck));
    return session;
  }

  public get state(): State {
    return this.store.state;
  }

  public dispatch(action: Action): State {
    return this.store.dispatch(action);
  }

  public playCard(playerIndex: number, handIndex: number, target?: CardTarget): State {
    const player = this.getPlayer(playerIndex);
    return this.dispatch(new PlayCardAction(player.id, handIndex, target ?? activeTarget()));
  }

  public attack(playerIndex: number, name: string): State {
    const player = this.getPlayer(playerIndex);
    return this.dispatch(new AttackAction(player.id, name));
  }

  public useAbility(playerIndex: number, name: string, target: CardTarget): State {
    const player = this.getPlayer(playerIndex);
    return this.dispatch(new UseAbilityAction(player.id, name, target));
  }

  public useStadium(playerIndex: number): State {
    const player = this.getPlayer(playerIndex);
    return this.dispatch(new UseStadiumAction(player.id));
  }

  public concede(playerIndex: number): State {
    const player = this.getPlayer(playerIndex);
    return this.dispatch(new ConcedeAction(player.id));
  }

  public passTurn(playerIndex?: number): State {
    const player = playerIndex === undefined
      ? this.state.players[this.state.activePlayer]
      : this.getPlayer(playerIndex);
    return this.dispatch(new PassTurnAction(player.id));
  }

  public retreat(playerIndex: number, benchIndex: number): State {
    const player = this.getPlayer(playerIndex);
    return this.dispatch(new RetreatAction(player.id, benchIndex));
  }

  public resolvePrompt(id: number, rawResult: any): State {
    const prompt = this.state.prompts.find(item => item.id === id);
    if (!prompt) {
      throw new Error(`[headless] Prompt not found: ${id}`);
    }
    const decoded = prompt.decode(rawResult, this.state);
    if (prompt.validate(decoded, this.state) === false) {
      throw new Error(`[headless] Invalid prompt result for "${prompt.type}"`);
    }
    return this.dispatch(new ResolvePromptAction(id, decoded, undefined, rawResult));
  }

  public overridePromptOnce(promptType: string, handler: HeadlessPromptOverride): void {
    this.resolver.overrideOnce(promptType, handler);
  }

  public snapshot(): HeadlessSnapshot {
    const serializer = new StateSerializer();
    setBonusHps(this.store, this.state);
    return {
      summary: summarizeState(this.state),
      prompts: this.state.prompts
        .filter(prompt => prompt.result === undefined)
        .map(prompt => serializeHeadlessPrompt(this.state, prompt)),
      events: this.drainEvents(),
      serializedState: serializer.serialize(this.state)
    };
  }

  public drainEvents(): HeadlessEvent[] {
    const drained = this.events.slice();
    this.events.length = 0;
    return drained;
  }

  private getPlayer(playerIndex: number): Player {
    const player = this.state.players[playerIndex];
    if (!player) {
      throw new Error(`[headless] Player index not found: ${playerIndex}`);
    }
    return player;
  }

  private applyGameSettings(settings?: Partial<GameSettings>): void {
    const gameSettings = Object.assign(new GameSettings(), settings ?? {});
    this.store.state.gameSettings = gameSettings;
    this.store.state.rules = gameSettings.rules;
  }
}

export function createHeadlessGame(config: HeadlessScenarioConfig | HeadlessDeckGameConfig): HeadlessGameSession {
  return 'active' in config.player1
    ? HeadlessGameSession.fromScenario(config as HeadlessScenarioConfig)
    : HeadlessGameSession.fromDecks(config as HeadlessDeckGameConfig);
}

export function activeTarget(): CardTarget {
  return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
}

function collectScenarioCardNames(config: HeadlessScenarioConfig): string[] {
  return [
    DEFAULT_FILLER,
    ...collectPlayerCardNames(config.player1),
    ...collectPlayerCardNames(config.player2)
  ];
}

function collectPlayerCardNames(config: HeadlessPlayerScenarioConfig): string[] {
  const cards = collectPokemonSlotCardNames(config.active);
  config.bench?.forEach(slot => cards.push(...collectPokemonSlotCardNames(slot)));
  cards.push(
    ...(config.hand ?? []),
    ...(config.deck ?? []),
    ...(config.discard ?? []),
    ...(config.lostzone ?? []),
    ...(config.stadium ?? []),
    ...(config.supporter ?? [])
  );
  return cards;
}

function collectPokemonSlotCardNames(config: HeadlessPokemonSlotConfig): string[] {
  return [config.card, ...(config.energy ?? []), ...(config.tools ?? [])];
}

function buildScenarioState(config: HeadlessScenarioConfig): State {
  const state = new State();
  const gameSettings = Object.assign(new GameSettings(), config.gameSettings ?? {});
  state.gameSettings = gameSettings;
  state.rules = gameSettings.rules;
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = config.turn ?? 1;
  state.activePlayer = config.activePlayer ?? 0;
  state.players = [
    buildScenarioPlayer(state, 1, config.player1),
    buildScenarioPlayer(state, 2, config.player2)
  ];
  return state;
}

function buildScenarioPlayer(state: State, id: number, config: HeadlessPlayerScenarioConfig): Player {
  const player = new Player();
  player.id = id;
  player.name = config.name ?? `Player ${id}`;

  player.bench = [];
  for (let i = 0; i < 5; i++) {
    const bench = new PokemonCardList();
    bench.isPublic = true;
    player.bench.push(bench);
  }

  const prizeCount = config.prizeCount ?? 6;
  for (let i = 0; i < prizeCount; i++) {
    const prize = new CardList();
    prize.isSecret = true;
    prize.cards.push(createCard(state, DEFAULT_FILLER));
    player.prizes.push(prize);
  }

  player.active.isPublic = true;
  player.discard.isPublic = true;
  player.lostzone.isPublic = true;
  player.stadium.isPublic = true;
  player.supporter.isPublic = true;

  buildPokemonSlot(state, player.active, config.active);
  config.bench?.forEach((slot, index) => {
    if (index < player.bench.length) {
      buildPokemonSlot(state, player.bench[index], slot);
    }
  });
  addCardsToList(state, player.hand, config.hand);
  addCardsToList(state, player.deck, config.deck);
  addCardsToList(state, player.discard, config.discard);
  addCardsToList(state, player.lostzone, config.lostzone);
  addCardsToList(state, player.stadium, config.stadium);
  addCardsToList(state, player.supporter, config.supporter);

  return player;
}

function addCardsToList(state: State, list: CardList, cardNames?: string[]): void {
  cardNames?.forEach(cardName => list.cards.push(createCard(state, cardName)));
}

function buildPokemonSlot(state: State, slot: PokemonCardList, config: HeadlessPokemonSlotConfig): void {
  const pokemon = createCard(state, config.card);
  slot.cards.push(pokemon);
  if (pokemon instanceof PokemonCard) {
    slot.hp = pokemon.hp;
  }
  slot.damage = config.damage ?? 0;
  config.energy?.forEach(cardName => {
    const energy = createCard(state, cardName);
    slot.cards.push(energy);
    if (energy instanceof EnergyCard) {
      slot.energies.cards.push(energy);
    }
  });
  config.tools?.forEach(cardName => {
    const tool = createCard(state, cardName);
    slot.tools.push(tool);
  });
}

function createCard(state: State, fullName: string) {
  const card = CardManager.getInstance().getCardByName(fullName);
  if (!card) {
    throw new Error(`[headless] Card not found: ${fullName}`);
  }
  card.id = state.cardNames.length;
  state.cardNames.push(card.fullName);
  return card;
}

function summarizeState(state: State): any {
  const serializer = new StateSerializer();
  const serializedState = serializer.serialize(state);
  return {
    phase: state.phase,
    turn: state.turn,
    activePlayer: state.activePlayer,
    winner: state.winner,
    players: state.players.map((player, index) => ({
      id: player.id,
      name: player.name,
      hand: player.hand.cards.map(summarizeCard),
      deckCount: player.deck.cards.length,
      discard: player.discard.cards.map(summarizeCard),
      lostZone: player.lostzone.cards.map(summarizeCard),
      stadium: player.stadium.cards.map(summarizeCard),
      playZone: player.supporter.cards.map(summarizeCard),
      prizesLeft: player.getPrizeLeft(),
      active: summarizePokemonList(player.active),
      bench: player.bench.map(summarizePokemonList),
      playableCardIds: player.playableCardIds,
      availableActions: buildAvailableActions(state, serializedState, index)
    })),
    logs: state.logs.map(log => ({
      id: log.id,
      message: log.message,
      params: log.params,
      client: log.client
    }))
  };
}

function buildAvailableActions(state: State, serializedState: string, playerIndex: number): AvailableActionsView {
  const player = state.players[playerIndex];
  const activePokemon = player.active.getPokemonCard();
  const active = activePokemon === undefined
    ? undefined
    : {
      attacks: activePokemon.attacks.map(attack =>
        actionStatus(attack, () => new AttackAction(player.id, attack.name), serializedState)
      ),
      abilities: activePokemon.powers.map(power =>
        abilityStatus(player.active, power, () => new UseAbilityAction(player.id, power.name, ownTarget(SlotType.ACTIVE)), serializedState)
      ),
      retreat: retreatStatus(player, serializedState)
    };

  return {
    active,
    bench: player.bench.map((bench, index) => {
      const pokemon = bench.getPokemonCard();
      return {
        index,
        abilities: pokemon?.powers.map(power =>
          abilityStatus(bench, power, () => new UseAbilityAction(player.id, power.name, ownTarget(SlotType.BENCH, index)), serializedState)
        ) ?? []
      };
    })
  };
}

function actionStatus(attack: Attack, action: () => Action, serializedState: string): AvailableActionStatus {
  const result = dryRun(serializedState, action);
  return {
    name: attack.name,
    legal: result.legal,
    reason: result.reason
  };
}

function abilityStatus(
  list: PokemonCardList,
  power: Power,
  action: () => Action,
  serializedState: string
): AvailableAbilityStatus {
  const result = dryRun(serializedState, action);
  const used = list.boardEffect.includes(BoardEffect.ABILITY_USED);
  return {
    name: power.name,
    legal: result.legal,
    used,
    reason: result.reason ?? (used && !result.legal ? 'POWER_ALREADY_USED' : undefined)
  };
}

function retreatStatus(player: Player, serializedState: string): AvailableRetreatStatus {
  const reasons: string[] = [];
  const targets: number[] = [];

  player.bench.forEach((bench, index) => {
    if (bench.getPokemonCard() === undefined) {
      return;
    }
    const result = dryRun(serializedState, () => new RetreatAction(player.id, index));
    if (result.legal) {
      targets.push(index);
      return;
    }
    if (result.reason) {
      reasons.push(result.reason);
    }
  });

  return {
    legal: targets.length > 0,
    targets,
    reason: targets.length > 0 ? undefined : reasons[0]
  };
}

function dryRun(serializedState: string, action: () => Action): { legal: boolean; reason?: string } {
  const serializer = new StateSerializer();
  const store = new Store(new DryRunStoreHandler());
  store.state = serializer.deserialize(serializedState);

  try {
    store.dispatch(action());
    return { legal: true };
  } catch (error) {
    return {
      legal: false,
      reason: error instanceof GameError ? error.message : error instanceof Error ? error.message : String(error)
    };
  }
}

function ownTarget(slot: SlotType, index = 0): CardTarget {
  return {
    player: PlayerType.BOTTOM_PLAYER,
    slot,
    index
  };
}

function summarizePokemonList(list: PokemonCardList): any {
  const pokemon = list.getPokemonCard();
  return {
    pokemon: pokemon?.fullName,
    pokemonCard: summarizeCard(pokemon),
    cards: list.cards.map(summarizeCard),
    damage: list.damage,
    hp: list.hp,
    retreat: pokemon?.retreat ?? [],
    energy: list.energies.cards.map(summarizeCard),
    tools: list.tools.map(summarizeCard),
    specialConditions: list.specialConditions
  };
}

function setBonusHps(store: Store, state: State): void {
  for (const player of state.players) {
    if (player.active.getPokemonCard() !== undefined) {
      const checkHp = new CheckHpEffect(player, player.active);
      store.reduceEffect(state, checkHp);
      player.active.hp = checkHp.hp;
    }
    for (const bench of player.bench) {
      if (bench.getPokemonCard() !== undefined) {
        const checkHp = new CheckHpEffect(player, bench);
        store.reduceEffect(state, checkHp);
        bench.hp = checkHp.hp;
      }
    }
  }
}

function summarizeCard(card: any): any {
  if (!card) {
    return undefined;
  }
  return {
    id: card.id,
    name: card.name,
    fullName: card.fullName,
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
    attacks: Array.isArray(card.attacks)
      ? card.attacks.map((attack: any) => ({
        name: attack.name,
        cost: attack.cost,
        damage: attack.damage,
        text: attack.text
      }))
      : undefined,
    powers: Array.isArray(card.powers)
      ? card.powers.map((power: any) => ({
        name: power.name,
        powerType: power.powerType,
        text: power.text
      }))
      : undefined
  };
}
