import { AddPlayerAction } from '../store/actions/add-player-action';
import { AttackAction, PassTurnAction, RetreatAction, UseAbilityAction } from '../store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../store/actions/play-card-action';
import { ResolvePromptAction } from '../store/actions/resolve-prompt-action';
import { EnergyCard } from '../store/card/energy-card';
import { PokemonCard } from '../store/card/pokemon-card';
import { GameSettings } from '../core/game-settings';
import { State, GamePhase } from '../store/state/state';
import { CardList } from '../store/state/card-list';
import { Player } from '../store/state/player';
import { PokemonCardList } from '../store/state/pokemon-card-list';
import { Store } from '../store/store';
import { StateSerializer } from '../serializer/state-serializer';
import { CardManager } from '../cards/card-manager';
import { registerCardsForNames } from '../../sets/registry/card-registration';
import { HeadlessPromptResolver } from './prompt-resolution';
const DEFAULT_FILLER = 'Water Energy SVE';
class HeadlessStoreHandler {
    constructor(resolver, getStore, events, promptMode) {
        this.resolver = resolver;
        this.getStore = getStore;
        this.events = events;
        this.promptMode = promptMode;
        this.isResolving = false;
    }
    onStateChange(state) {
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
        }
        finally {
            this.isResolving = false;
        }
    }
}
export class HeadlessGameSession {
    constructor(promptMode) {
        this.promptMode = promptMode;
        this.resolver = new HeadlessPromptResolver();
        this.events = [];
        const handler = new HeadlessStoreHandler(this.resolver, () => this.store, this.events, promptMode);
        this.store = new Store(handler);
    }
    static fromScenario(config) {
        var _a;
        registerCardsForNames(collectScenarioCardNames(config));
        const session = new HeadlessGameSession((_a = config.promptMode) !== null && _a !== void 0 ? _a : 'auto');
        session.store.state = buildScenarioState(config);
        return session;
    }
    static fromDecks(config) {
        var _a, _b, _c;
        registerCardsForNames([...config.player1.deck, ...config.player2.deck]);
        const session = new HeadlessGameSession((_a = config.promptMode) !== null && _a !== void 0 ? _a : 'auto');
        session.applyGameSettings(config.gameSettings);
        session.store.dispatch(new AddPlayerAction((_b = config.player1.id) !== null && _b !== void 0 ? _b : 1, config.player1.name, config.player1.deck));
        session.store.dispatch(new AddPlayerAction((_c = config.player2.id) !== null && _c !== void 0 ? _c : 2, config.player2.name, config.player2.deck));
        return session;
    }
    get state() {
        return this.store.state;
    }
    dispatch(action) {
        return this.store.dispatch(action);
    }
    playCard(playerIndex, handIndex, target) {
        const player = this.getPlayer(playerIndex);
        return this.dispatch(new PlayCardAction(player.id, handIndex, target !== null && target !== void 0 ? target : activeTarget()));
    }
    attack(playerIndex, name) {
        const player = this.getPlayer(playerIndex);
        return this.dispatch(new AttackAction(player.id, name));
    }
    useAbility(playerIndex, name, target) {
        const player = this.getPlayer(playerIndex);
        return this.dispatch(new UseAbilityAction(player.id, name, target));
    }
    passTurn(playerIndex) {
        const player = playerIndex === undefined
            ? this.state.players[this.state.activePlayer]
            : this.getPlayer(playerIndex);
        return this.dispatch(new PassTurnAction(player.id));
    }
    retreat(playerIndex, benchIndex) {
        const player = this.getPlayer(playerIndex);
        return this.dispatch(new RetreatAction(player.id, benchIndex));
    }
    resolvePrompt(id, rawResult) {
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
    overridePromptOnce(promptType, handler) {
        this.resolver.overrideOnce(promptType, handler);
    }
    snapshot() {
        const serializer = new StateSerializer();
        return {
            summary: summarizeState(this.state),
            prompts: this.state.prompts
                .filter(prompt => prompt.result === undefined)
                .map(prompt => summarizePrompt(prompt)),
            events: this.drainEvents(),
            serializedState: serializer.serialize(this.state)
        };
    }
    drainEvents() {
        const drained = this.events.slice();
        this.events.length = 0;
        return drained;
    }
    getPlayer(playerIndex) {
        const player = this.state.players[playerIndex];
        if (!player) {
            throw new Error(`[headless] Player index not found: ${playerIndex}`);
        }
        return player;
    }
    applyGameSettings(settings) {
        const gameSettings = Object.assign(new GameSettings(), settings !== null && settings !== void 0 ? settings : {});
        this.store.state.gameSettings = gameSettings;
        this.store.state.rules = gameSettings.rules;
    }
}
export function createHeadlessGame(config) {
    return 'active' in config.player1
        ? HeadlessGameSession.fromScenario(config)
        : HeadlessGameSession.fromDecks(config);
}
export function activeTarget() {
    return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
}
function collectScenarioCardNames(config) {
    return [
        DEFAULT_FILLER,
        ...collectPlayerCardNames(config.player1),
        ...collectPlayerCardNames(config.player2)
    ];
}
function collectPlayerCardNames(config) {
    var _a, _b, _c, _d;
    const cards = collectPokemonSlotCardNames(config.active);
    (_a = config.bench) === null || _a === void 0 ? void 0 : _a.forEach(slot => cards.push(...collectPokemonSlotCardNames(slot)));
    cards.push(...((_b = config.hand) !== null && _b !== void 0 ? _b : []), ...((_c = config.deck) !== null && _c !== void 0 ? _c : []), ...((_d = config.discard) !== null && _d !== void 0 ? _d : []));
    return cards;
}
function collectPokemonSlotCardNames(config) {
    var _a, _b;
    return [config.card, ...((_a = config.energy) !== null && _a !== void 0 ? _a : []), ...((_b = config.tools) !== null && _b !== void 0 ? _b : [])];
}
function buildScenarioState(config) {
    var _a, _b, _c;
    const state = new State();
    const gameSettings = Object.assign(new GameSettings(), (_a = config.gameSettings) !== null && _a !== void 0 ? _a : {});
    state.gameSettings = gameSettings;
    state.rules = gameSettings.rules;
    state.phase = GamePhase.PLAYER_TURN;
    state.turn = (_b = config.turn) !== null && _b !== void 0 ? _b : 1;
    state.activePlayer = (_c = config.activePlayer) !== null && _c !== void 0 ? _c : 0;
    state.players = [
        buildScenarioPlayer(state, 1, config.player1),
        buildScenarioPlayer(state, 2, config.player2)
    ];
    return state;
}
function buildScenarioPlayer(state, id, config) {
    var _a, _b, _c;
    const player = new Player();
    player.id = id;
    player.name = (_a = config.name) !== null && _a !== void 0 ? _a : `Player ${id}`;
    player.bench = [];
    for (let i = 0; i < 5; i++) {
        const bench = new PokemonCardList();
        bench.isPublic = true;
        player.bench.push(bench);
    }
    const prizeCount = (_b = config.prizeCount) !== null && _b !== void 0 ? _b : 6;
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
    (_c = config.bench) === null || _c === void 0 ? void 0 : _c.forEach((slot, index) => {
        if (index < player.bench.length) {
            buildPokemonSlot(state, player.bench[index], slot);
        }
    });
    addCardsToList(state, player.hand, config.hand);
    addCardsToList(state, player.deck, config.deck);
    addCardsToList(state, player.discard, config.discard);
    return player;
}
function addCardsToList(state, list, cardNames) {
    cardNames === null || cardNames === void 0 ? void 0 : cardNames.forEach(cardName => list.cards.push(createCard(state, cardName)));
}
function buildPokemonSlot(state, slot, config) {
    var _a, _b, _c;
    const pokemon = createCard(state, config.card);
    slot.cards.push(pokemon);
    if (pokemon instanceof PokemonCard) {
        slot.hp = pokemon.hp;
    }
    slot.damage = (_a = config.damage) !== null && _a !== void 0 ? _a : 0;
    (_b = config.energy) === null || _b === void 0 ? void 0 : _b.forEach(cardName => {
        const energy = createCard(state, cardName);
        slot.cards.push(energy);
        if (energy instanceof EnergyCard) {
            slot.energies.cards.push(energy);
        }
    });
    (_c = config.tools) === null || _c === void 0 ? void 0 : _c.forEach(cardName => {
        const tool = createCard(state, cardName);
        slot.cards.push(tool);
        slot.tools.push(tool);
    });
}
function createCard(state, fullName) {
    const card = CardManager.getInstance().getCardByName(fullName);
    if (!card) {
        throw new Error(`[headless] Card not found: ${fullName}`);
    }
    card.id = state.cardNames.length;
    state.cardNames.push(card.fullName);
    return card;
}
function summarizeState(state) {
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
function summarizePokemonList(list) {
    const pokemon = list.getPokemonCard();
    return {
        pokemon: pokemon === null || pokemon === void 0 ? void 0 : pokemon.fullName,
        cards: list.cards.map(card => card.fullName),
        damage: list.damage,
        hp: list.hp,
        energy: list.energies.cards.map(card => card.fullName),
        tools: list.tools.map(card => card.fullName),
        specialConditions: list.specialConditions
    };
}
function summarizePrompt(prompt) {
    var _a, _b;
    const result = {
        id: prompt.id,
        type: prompt.type,
        playerId: prompt.playerId
    };
    const promptAny = prompt;
    if (promptAny.message !== undefined) {
        result.message = promptAny.message;
    }
    if (promptAny.options !== undefined) {
        result.options = promptAny.options;
    }
    if ((_a = promptAny.cards) === null || _a === void 0 ? void 0 : _a.cards) {
        result.cards = promptAny.cards.cards.map((card) => card.fullName);
    }
    if ((_b = promptAny.cardList) === null || _b === void 0 ? void 0 : _b.cards) {
        result.cardList = promptAny.cardList.cards.map((card) => card.fullName);
    }
    return result;
}
