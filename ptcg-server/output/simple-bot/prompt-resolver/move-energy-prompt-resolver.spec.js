"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const move_energy_prompt_resolver_1 = require("./move-energy-prompt-resolver");
const simple_bot_definitions_1 = require("../simple-bot-definitions");
class TestEnergy extends game_1.EnergyCard {
    constructor(name, provides) {
        super();
        this.name = 'energy';
        this.fullName = 'energy';
        this.set = 'test';
        this.name = name;
        this.provides = provides;
    }
}
class TestPokemon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'pokemon';
        this.fullName = 'pokemon';
        this.set = 'test';
    }
}
describe('MoveEnergyPromptResolver', () => {
    let resolver;
    let prompt;
    let state;
    let player;
    let opponent;
    function createSlot() {
        const slot = new game_1.PokemonCardList();
        slot.cards = [new TestPokemon()];
        return slot;
    }
    function setRetreatCost(cardList, cost) {
        const pokemonCard = cardList.cards[0];
        pokemonCard.retreat = cost;
    }
    function createState() {
        const s = new game_1.State();
        for (let i = 0; i < 2; i++) {
            const p = new game_1.Player();
            p.id = i;
            p.active = createSlot();
            for (let j = 0; j < 5; j++) {
                p.bench.push(createSlot());
            }
            s.players.push(p);
        }
        return s;
    }
    beforeEach(() => {
        const simpleBotOptions = {
            tactics: simple_bot_definitions_1.allSimpleTactics,
            promptResolvers: simple_bot_definitions_1.allPromptResolvers,
            scores: simple_bot_definitions_1.defaultStateScores,
            arbiter: simple_bot_definitions_1.defaultArbiterOptions
        };
        resolver = new move_energy_prompt_resolver_1.MoveEnergyPromptResolver(simpleBotOptions);
        state = createState();
        player = state.players[0];
        opponent = state.players[1];
        prompt = new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY });
    });
    it('Should move card to Bench, because we can\'t cancel it', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        player.active.cards.push(fire);
        setRetreatCost(player.active, [game_1.CardType.COLORLESS]);
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.options.allowCancel = false;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result.length).toEqual(1);
        expect(result[0].from.player).toEqual(game_1.PlayerType.BOTTOM_PLAYER);
        expect(result[0].from.slot).toEqual(game_1.SlotType.ACTIVE);
        expect(result[0].from.index).toEqual(0);
        expect(result[0].to.player).toEqual(game_1.PlayerType.BOTTOM_PLAYER);
        expect(result[0].to.slot).toEqual(game_1.SlotType.BENCH);
        expect(result[0].card).toBe(fire);
    });
    it('Should return null, moving energy to Bench gives negative score', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        player.active.cards.push(fire);
        setRetreatCost(player.active, [game_1.CardType.COLORLESS]);
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.options.allowCancel = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toBeNull();
    });
    it('Should move energy to Active', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        player.bench[0].cards.push(fire);
        setRetreatCost(player.active, [game_1.CardType.COLORLESS]);
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.options.allowCancel = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                to: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                card: fire
            }]);
        expect(result[0].card).toBe(fire);
    });
    it('Should move two cards', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        const water = new TestEnergy('water', [game_1.CardType.WATER]);
        player.bench[0].cards.push(fire);
        player.bench[1].cards.push(water);
        setRetreatCost(player.active, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS]);
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                to: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                card: fire
            }, {
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 1 },
                to: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                card: water
            }]);
        expect(result[0].card).toBe(fire);
        expect(result[1].card).toBe(water);
    });
    it('Should move two cards of three available', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        const water = new TestEnergy('water', [game_1.CardType.WATER]);
        const psychic = new TestEnergy('psychic', [game_1.CardType.PSYCHIC]);
        player.bench[0].cards.push(fire);
        player.bench[1].cards.push(water);
        player.bench[2].cards.push(psychic);
        setRetreatCost(player.active, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS]);
        setRetreatCost(player.bench[2], [game_1.CardType.COLORLESS]);
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                to: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                card: fire
            }, {
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 1 },
                to: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                card: water
            }]);
        expect(result[0].card).toBe(fire);
        expect(result[1].card).toBe(water);
    });
    it('Should move one card, because one bench slot is blocked', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        const water = new TestEnergy('water', [game_1.CardType.WATER]);
        player.bench[0].cards.push(fire);
        player.bench[1].cards.push(water);
        setRetreatCost(player.active, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS]);
        prompt.options.blockedFrom = [{ player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 1 }];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                to: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                card: fire
            }]);
        expect(result[0].card).toBe(fire);
    });
    it('Should move one card, because one card blocked', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        const water = new TestEnergy('water', [game_1.CardType.WATER]);
        player.bench[0].cards.push(fire);
        player.bench[1].cards.push(water);
        setRetreatCost(player.active, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS]);
        prompt.options.blockedMap = [{
                source: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 1 },
                blocked: [1]
            }];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                to: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                card: fire
            }]);
        expect(result[0].card).toBe(fire);
    });
    it('Should move energy of the opponent', () => {
        // given
        const fire = new TestEnergy('fire', [game_1.CardType.FIRE]);
        opponent.bench[0].cards.push(fire);
        setRetreatCost(opponent.active, [game_1.CardType.COLORLESS]);
        prompt.playerType = game_1.PlayerType.TOP_PLAYER;
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.options.allowCancel = false;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result.length).toEqual(1);
        expect(result[0].from.player).toEqual(game_1.PlayerType.TOP_PLAYER);
        expect(result[0].from.slot).toEqual(game_1.SlotType.BENCH);
        expect(result[0].from.index).toEqual(0);
        expect(result[0].to.player).toEqual(game_1.PlayerType.TOP_PLAYER);
        expect(result[0].to.slot).toEqual(game_1.SlotType.BENCH);
        expect(result[0].card).toBe(fire);
    });
});
