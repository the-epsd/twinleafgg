import { Card } from '../../game/store/card/card';
import { CardManager } from '../../game/cards/card-manager';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { SuperType } from '../../game/store/card/card-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CardList } from '../../game/store/state/card-list';
import { Store } from '../../game/store/store';
import { StoreHandler } from '../../game/store/store-handler';
import { Prompt } from '../../game/store/prompts/prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { BotArbiter, BotFlipMode, BotShuffleMode } from '../../game/bots/bot-arbiter';
import { AlertPrompt } from '../../game/store/prompts/alert-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ConfirmCardsPrompt } from '../../game/store/prompts/confirm-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { ChoosePrizePrompt } from '../../game/store/prompts/choose-prize-prompt';
import { OrderCardsPrompt } from '../../game/store/prompts/order-cards-prompt';
import { PutDamagePrompt } from '../../game/store/prompts/put-damage-prompt';
import { MoveDamagePrompt } from '../../game/store/prompts/move-damage-prompt';
import { MoveEnergyPrompt } from '../../game/store/prompts/move-energy-prompt';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';
import { PlayerType, SlotType, CardTarget } from '../../game/store/actions/play-card-action';

// ── Config interfaces ──

export interface PokemonSlotConfig {
  card: string;
  energy?: string[];
  damage?: number;
  tools?: string[];
}

export interface PlayerConfig {
  active: PokemonSlotConfig;
  bench?: PokemonSlotConfig[];
  hand?: string[];
  deck?: string[];
  discard?: string[];
  prizeCount?: number;
}

export interface SetupGameConfig {
  player1: PlayerConfig;
  player2: PlayerConfig;
  /** Override the starting turn number (default 1) */
  turn?: number;
}

// ── Card registration ──

let cardsRegistered = false;

export function ensureCardsRegistered(): void {
  if (cardsRegistered) return;
  cardsRegistered = true;

  const fs = require('fs');
  const path = require('path');
  const cardManager = CardManager.getInstance();
  const setsDir = path.resolve(__dirname, '..');

  // Parse index.ts to find all set module paths
  const indexContent: string = fs.readFileSync(path.join(setsDir, 'index.ts'), 'utf8');
  const regex = /export \* from '\.\/([^']+)'/g;
  let match: RegExpExecArray | null;
  const modulePaths: string[] = [];
  while ((match = regex.exec(indexContent)) !== null) {
    modulePaths.push(match[1]);
  }

  // Import each set individually — skip sets that fail to load
  for (const moduleName of modulePaths) {
    try {
      const mod = require(path.join(setsDir, moduleName));
      for (const key of Object.keys(mod)) {
        const value = mod[key];
        if (Array.isArray(value) && value.length > 0 && value[0] instanceof Card) {
          try {
            cardManager.defineSet(value);
          } catch (e: any) {
            if (!e.message?.startsWith('Multiple cards with the same name')) {
              throw e;
            }
          }
        }
      }
    } catch (e: any) {
      // Log but don't fail — stale .js artifacts can cause benign load errors
      console.warn(`[test-helpers] Skipped set "${moduleName}": ${e.message}`);
    }
  }
}

// ── Convenience helpers ──

export function getCardByName(fullName: string): Card {
  const card = CardManager.getInstance().getCardByName(fullName);
  if (!card) {
    throw new Error(`Card not found: "${fullName}"`);
  }
  return card;
}

const DEFAULT_FILLER = 'Water Energy SVE';

export function padDeck(n: number, cardName?: string): string[] {
  return Array(n).fill(cardName ?? DEFAULT_FILLER);
}

// ── Prompt override map ──

type PromptHandler = (prompt: Prompt<any>, state: State) => any;

// ── TestStoreHandler ──

class TestStoreHandler implements StoreHandler {
  private arbiter = new BotArbiter({
    flipMode: BotFlipMode.ALL_HEADS,
    shuffleMode: BotShuffleMode.NO_SHUFFLE
  });
  private overrides = new Map<string, PromptHandler>();
  private store!: Store;

  setStore(store: Store): void {
    this.store = store;
  }

  overridePrompt(type: string, handler: PromptHandler): void {
    this.overrides.set(type, handler);
  }

  onStateChange(state: State): void {
    // Auto-resolve any pending prompts
    const pending = state.prompts.filter(p => p.result === undefined);
    for (const prompt of pending) {
      const action = this.resolvePrompt(state, prompt);
      if (action) {
        this.store.dispatch(action);
      }
    }
  }

  private resolvePrompt(state: State, prompt: Prompt<any>): ResolvePromptAction | undefined {
    // Check one-shot overrides first
    const override = this.overrides.get(prompt.type);
    if (override) {
      this.overrides.delete(prompt.type);
      const result = override(prompt, state);
      return new ResolvePromptAction(prompt.id, result);
    }

    // Try BotArbiter for coin flips and shuffles
    const arbiterResult = this.arbiter.resolvePrompt(state, prompt);
    if (arbiterResult) {
      // BotArbiter already encodes results correctly for CoinFlip and Shuffle
      return arbiterResult;
    }

    // Auto-resolve by prompt type — get raw result, then decode
    let rawResult: any;

    if (prompt instanceof AlertPrompt) {
      rawResult = true;
    } else if (prompt instanceof ShowCardsPrompt) {
      rawResult = true;
    } else if (prompt instanceof ConfirmPrompt) {
      rawResult = true;
    } else if (prompt instanceof ConfirmCardsPrompt) {
      rawResult = true;
    } else if (prompt instanceof ChooseCardsPrompt) {
      rawResult = this.resolveChooseCardsRaw(prompt);
    } else if (prompt instanceof ChoosePokemonPrompt) {
      rawResult = this.resolveChoosePokemonRaw(state, prompt);
    } else if (prompt instanceof AttachEnergyPrompt) {
      rawResult = this.resolveAttachEnergyRaw(state, prompt);
    } else if (prompt instanceof ChooseEnergyPrompt) {
      rawResult = this.resolveChooseEnergyRaw(prompt);
    } else if (prompt instanceof SelectPrompt) {
      rawResult = 0;
    } else if (prompt instanceof SelectOptionPrompt) {
      rawResult = 0;
    } else if (prompt instanceof ChoosePrizePrompt) {
      rawResult = this.resolveChoosePrizeRaw(state, prompt);
    } else if (prompt instanceof OrderCardsPrompt) {
      rawResult = prompt.cards.cards.map((_: any, i: number) => i);
    } else if (prompt instanceof PutDamagePrompt) {
      rawResult = this.resolvePutDamageRaw(state, prompt);
    } else if (prompt instanceof MoveDamagePrompt) {
      rawResult = prompt.options.allowCancel ? null : [];
    } else if (prompt instanceof MoveEnergyPrompt) {
      rawResult = prompt.options.allowCancel ? null : [];
    } else if (prompt instanceof DiscardEnergyPrompt) {
      rawResult = this.resolveDiscardEnergyRaw(state, prompt);
    } else {
      rawResult = true;
    }

    // Decode the raw result (converts indices to card references, etc.)
    const decoded = prompt.decode(rawResult, state);
    return new ResolvePromptAction(prompt.id, decoded);
  }

  private resolveChooseCardsRaw(prompt: ChooseCardsPrompt): any {
    const blocked = new Set(prompt.options.blocked);
    const indices: number[] = [];
    const max = prompt.options.max;
    for (let i = 0; i < prompt.cards.cards.length && indices.length < max; i++) {
      if (!blocked.has(i)) {
        indices.push(i);
      }
    }
    if (indices.length < prompt.options.min && prompt.options.allowCancel) {
      return null;
    }
    return indices;
  }

  private resolveChoosePokemonRaw(state: State, prompt: ChoosePokemonPrompt): any {
    const player = state.players.find(p => p.id === prompt.playerId);
    if (!player) return null;
    const opponent = state.players.find(p => p.id !== prompt.playerId);
    if (!opponent) return null;

    const blockedSet = new Set(prompt.options.blocked.map(b => `${b.player}-${b.slot}-${b.index}`));
    const targets: CardTarget[] = [];

    for (const pt of [PlayerType.BOTTOM_PLAYER, PlayerType.TOP_PLAYER]) {
      const p = pt === PlayerType.BOTTOM_PLAYER ? player : opponent;
      if (prompt.playerType !== PlayerType.ANY && prompt.playerType !== pt) continue;

      if (prompt.slots.includes(SlotType.ACTIVE) && p.active.cards.length > 0) {
        const t: CardTarget = { player: pt, slot: SlotType.ACTIVE, index: 0 };
        if (!blockedSet.has(`${t.player}-${t.slot}-${t.index}`)) {
          targets.push(t);
        }
      }
      if (prompt.slots.includes(SlotType.BENCH)) {
        for (let i = 0; i < p.bench.length; i++) {
          if (p.bench[i].cards.length > 0) {
            const t: CardTarget = { player: pt, slot: SlotType.BENCH, index: i };
            if (!blockedSet.has(`${t.player}-${t.slot}-${t.index}`)) {
              targets.push(t);
            }
          }
        }
      }
    }

    const max = prompt.options.max;
    const result = targets.slice(0, max);
    if (result.length < prompt.options.min) {
      return null;
    }
    return result;
  }

  private resolveAttachEnergyRaw(state: State, prompt: AttachEnergyPrompt): any {
    const player = state.players.find(p => p.id === prompt.playerId);
    if (!player) return null;

    const blocked = new Set(prompt.options.blocked);
    const blockedToSet = new Set(prompt.options.blockedTo.map(b => `${b.player}-${b.slot}-${b.index}`));

    // Find first valid energy card
    let energyIndex = -1;
    for (let i = 0; i < prompt.cardList.cards.length; i++) {
      if (!blocked.has(i) && prompt.cardList.cards[i].superType === SuperType.ENERGY) {
        energyIndex = i;
        break;
      }
    }
    if (energyIndex === -1) {
      return prompt.options.allowCancel ? null : [];
    }

    // Find first valid target
    let target: CardTarget | undefined;
    if (prompt.slots.includes(SlotType.ACTIVE)) {
      const t: CardTarget = { player: prompt.playerType, slot: SlotType.ACTIVE, index: 0 };
      if (!blockedToSet.has(`${t.player}-${t.slot}-${t.index}`) && player.active.cards.length > 0) {
        target = t;
      }
    }
    if (!target && prompt.slots.includes(SlotType.BENCH)) {
      for (let i = 0; i < player.bench.length; i++) {
        if (player.bench[i].cards.length > 0) {
          const t: CardTarget = { player: prompt.playerType, slot: SlotType.BENCH, index: i };
          if (!blockedToSet.has(`${t.player}-${t.slot}-${t.index}`)) {
            target = t;
            break;
          }
        }
      }
    }

    if (!target) {
      return prompt.options.allowCancel ? null : [];
    }

    // Build result: attach up to max energy cards to the first valid target
    const result: { to: CardTarget; index: number }[] = [];
    const max = prompt.options.max;
    for (let i = 0; i < prompt.cardList.cards.length && result.length < max; i++) {
      if (!blocked.has(i) && prompt.cardList.cards[i].superType === SuperType.ENERGY) {
        result.push({ to: target, index: i });
      }
    }

    return result;
  }

  private resolveChooseEnergyRaw(prompt: ChooseEnergyPrompt): any {
    return prompt.energy.map((_: any, i: number) => i);
  }

  private resolveChoosePrizeRaw(state: State, prompt: ChoosePrizePrompt): any {
    const player = state.players.find(p => p.id === prompt.playerId);
    if (!player) return null;
    const nonEmpty: number[] = [];
    const prizes = player.prizes.filter(p => p.cards.length > 0);
    for (let i = 0; i < prizes.length && nonEmpty.length < prompt.options.count; i++) {
      if (!prompt.options.blocked.includes(i)) {
        nonEmpty.push(i);
      }
    }
    return nonEmpty;
  }

  private resolvePutDamageRaw(state: State, prompt: PutDamagePrompt): any {
    const player = state.players.find(p => p.id === prompt.playerId);
    if (!player) return null;

    const blockedSet = new Set(prompt.options.blocked.map(b => `${b.player}-${b.slot}-${b.index}`));

    for (const dm of prompt.maxAllowedDamage) {
      if (dm.damage > 0 && !blockedSet.has(`${dm.target.player}-${dm.target.slot}-${dm.target.index}`)) {
        return [{ target: dm.target, damage: prompt.damage }];
      }
    }

    return prompt.options.allowCancel ? null : [];
  }

  private resolveDiscardEnergyRaw(state: State, prompt: DiscardEnergyPrompt): any {
    const player = state.players.find(p => p.id === prompt.playerId);
    if (!player) return null;

    const blockedFromSet = new Set(prompt.options.blockedFrom.map(
      b => `${b.player}-${b.slot}-${b.index}`
    ));

    const result: { from: CardTarget; index: number }[] = [];
    const max = prompt.options.max ?? Infinity;

    const scanSlots = (pt: PlayerType, p: Player) => {
      if (prompt.playerType !== PlayerType.ANY && prompt.playerType !== pt) return;

      const slots: Array<{ cardList: PokemonCardList; target: CardTarget }> = [];
      if (prompt.slots.includes(SlotType.ACTIVE) && p.active.cards.length > 0) {
        slots.push({ cardList: p.active, target: { player: pt, slot: SlotType.ACTIVE, index: 0 } });
      }
      if (prompt.slots.includes(SlotType.BENCH)) {
        for (let i = 0; i < p.bench.length; i++) {
          if (p.bench[i].cards.length > 0) {
            slots.push({ cardList: p.bench[i], target: { player: pt, slot: SlotType.BENCH, index: i } });
          }
        }
      }

      for (const { cardList, target } of slots) {
        if (blockedFromSet.has(`${target.player}-${target.slot}-${target.index}`)) continue;
        for (let i = 0; i < cardList.cards.length && result.length < max; i++) {
          if (cardList.cards[i].superType === SuperType.ENERGY) {
            result.push({ from: target, index: i });
          }
        }
      }
    };

    scanSlots(PlayerType.BOTTOM_PLAYER, player);
    const opponent = state.players.find(p => p.id !== player.id);
    if (opponent) {
      scanSlots(PlayerType.TOP_PLAYER, opponent);
    }

    const min = prompt.options.min;
    if (result.length < min && prompt.options.allowCancel) {
      return null;
    }
    return result.slice(0, max);
  }
}

// ── Main setup function ──

let nextCardId = 1000;

export interface SetupGameResult {
  store: Store;
  state: State;
  player1: Player;
  player2: Player;
  overridePrompt: (type: string, handler: PromptHandler) => void;
}

export function setupGame(config: SetupGameConfig): SetupGameResult {
  ensureCardsRegistered();
  nextCardId = 1000;

  const handler = new TestStoreHandler();
  const store = new Store(handler);
  handler.setStore(store);

  const state = new State();
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = config.turn ?? 1;
  state.activePlayer = 0;

  const player1 = buildPlayer(0, config.player1);
  const player2 = buildPlayer(1, config.player2);

  state.players = [player1, player2];
  store.state = state;

  return {
    store,
    state,
    player1,
    player2,
    overridePrompt: (type: string, h: PromptHandler) => handler.overridePrompt(type, h)
  };
}

function buildPlayer(index: number, config: PlayerConfig): Player {
  const player = new Player();
  player.id = index + 1;

  // Initialize bench slots
  player.bench = [];
  for (let i = 0; i < 5; i++) {
    const bench = new PokemonCardList();
    bench.isPublic = true;
    player.bench.push(bench);
  }

  // Initialize prizes with filler energy cards
  const prizeCount = config.prizeCount ?? 6;
  player.prizes = [];
  for (let i = 0; i < prizeCount; i++) {
    const prizeList = new CardList();
    prizeList.isSecret = true;
    const filler = getCardByName(DEFAULT_FILLER);
    filler.id = nextCardId++;
    prizeList.cards.push(filler);
    player.prizes.push(prizeList);
  }

  // Set public zones (matching production setup-reducer.ts)
  player.active.isPublic = true;
  player.discard.isPublic = true;
  player.lostzone.isPublic = true;
  player.stadium.isPublic = true;
  player.supporter.isPublic = true;

  // Build active Pokemon
  buildPokemonSlot(player.active, config.active);

  // Build bench Pokemon
  if (config.bench) {
    for (let i = 0; i < config.bench.length && i < player.bench.length; i++) {
      buildPokemonSlot(player.bench[i], config.bench[i]);
    }
  }

  // Build hand
  if (config.hand) {
    for (const cardName of config.hand) {
      const card = getCardByName(cardName);
      card.id = nextCardId++;
      player.hand.cards.push(card);
    }
  }

  // Build deck
  if (config.deck) {
    for (const cardName of config.deck) {
      const card = getCardByName(cardName);
      card.id = nextCardId++;
      player.deck.cards.push(card);
    }
  }

  // Build discard
  if (config.discard) {
    for (const cardName of config.discard) {
      const card = getCardByName(cardName);
      card.id = nextCardId++;
      player.discard.cards.push(card);
    }
  }

  return player;
}

function buildPokemonSlot(slot: PokemonCardList, config: PokemonSlotConfig): void {
  const pokemon = getCardByName(config.card);
  pokemon.id = nextCardId++;
  slot.cards.push(pokemon);

  // Set HP from the PokemonCard
  if (pokemon instanceof PokemonCard) {
    slot.hp = pokemon.hp;
  }

  // Apply damage
  if (config.damage) {
    slot.damage = config.damage;
  }

  // Attach energy — placed in both .cards and .energies.cards
  if (config.energy) {
    for (const energyName of config.energy) {
      const energy = getCardByName(energyName);
      energy.id = nextCardId++;
      slot.cards.push(energy);
      if (energy instanceof EnergyCard) {
        slot.energies.cards.push(energy);
      }
    }
  }

  // Attach tools
  if (config.tools) {
    for (const toolName of config.tools) {
      const tool = getCardByName(toolName);
      tool.id = nextCardId++;
      slot.cards.push(tool);
      slot.tools.push(tool);
    }
  }
}
