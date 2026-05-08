import { Action } from '../store/actions/action';
import { AddPlayerAction } from '../store/actions/add-player-action';
import { AttackAction, PassTurnAction, RetreatAction, UseAbilityAction } from '../store/actions/game-actions';
import { PlayCardAction, CardTarget, PlayerType, SlotType } from '../store/actions/play-card-action';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
import { EnergyCard } from '../store/card/energy-card';
import { PokemonCard } from '../store/card/pokemon-card';
import { GameSettings } from '../core/game-settings';
import { State, GamePhase } from '../store/state/state';
import { CardList } from '../store/state/card-list';
import { Player } from '../store/state/player';
import { PokemonCardList } from '../store/state/pokemon-card-list';
import { Store } from '../store/store';
import { StoreHandler } from '../store/store-handler';
import { StateSerializer } from '../serializer/state-serializer';
import { CardManager } from '../cards/card-manager';
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

const DEFAULT_FILLER = 'Water Energy SVE';

class HeadlessStoreHandler implements StoreHandler {
  private isResolving = false;

  constructor(
    private resolver: HeadlessPromptResolver,
    private getStore: () => Store,
    private events: HeadlessEvent[],
    private promptMode: HeadlessPromptMode
  ) {}

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
          if (this.promptMode !== 'auto' && prompt.type !== 'WaitPrompt') {
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
    return this.dispatch(new ResolvePromptAction(id, decoded));
  }

  public overridePromptOnce(promptType: string, handler: HeadlessPromptOverride): void {
    this.resolver.overrideOnce(promptType, handler);
  }

  public snapshot(): HeadlessSnapshot {
    const serializer = new StateSerializer();
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
  cards.push(...(config.hand ?? []), ...(config.deck ?? []), ...(config.discard ?? []));
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
    slot.cards.push(tool);
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
  return {
    phase: state.phase,
    turn: state.turn,
    activePlayer: state.activePlayer,
    winner: state.winner,
    players: state.players.map(player => ({
      id: player.id,
      name: player.name,
      hand: player.hand.cards.map(card => card.fullName),
      deckCount: player.deck.cards.length,
      discard: player.discard.cards.map(card => card.fullName),
      prizesLeft: player.getPrizeLeft(),
      active: summarizePokemonList(player.active),
      bench: player.bench.map(summarizePokemonList),
      playableCardIds: player.playableCardIds
    })),
    logs: state.logs.map(log => ({
      id: log.id,
      message: log.message,
      params: log.params,
      client: log.client
    }))
  };
}

function summarizePokemonList(list: PokemonCardList): any {
  const pokemon = list.getPokemonCard();
  return {
    pokemon: pokemon?.fullName,
    cards: list.cards.map(card => card.fullName),
    damage: list.damage,
    hp: list.hp,
    energy: list.energies.cards.map(card => card.fullName),
    tools: list.tools.map(card => card.fullName),
    specialConditions: list.specialConditions
  };
}
