"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const choose_pokemon_prompt_resolver_1 = require("./choose-pokemon-prompt-resolver");
const simple_bot_definitions_1 = require("../simple-bot-definitions");
class TestPokemon extends game_1.PokemonCard {
    constructor(name) {
        super();
        this.name = 'energy';
        this.fullName = 'energy';
        this.set = 'test';
        this.hp = 100;
        this.name = name;
    }
}
describe('ChoosePokemonPromptResolver', () => {
    let resolver;
    let prompt;
    let state;
    let player;
    let opponent;
    function createSlot() {
        const slot = new game_1.PokemonCardList();
        slot.cards = [new TestPokemon('Test')];
        return slot;
    }
    function setHp(cardList, hp) {
        const pokemonCard = cardList.cards[0];
        pokemonCard.hp = hp;
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
        resolver = new choose_pokemon_prompt_resolver_1.ChoosePokemonPromptResolver(simpleBotOptions);
        state = createState();
        player = state.players[0];
        opponent = state.players[1];
        prompt = new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH]);
    });
    it('Should return undefined when other prompt type', () => {
        // given
        const other = {};
        // when
        const action = resolver.resolvePrompt(state, player, other);
        // then
        expect(action).toBeUndefined();
    });
    it('Should choose the strongest Pokemon', () => {
        // given
        setHp(player.bench[2], 150);
        prompt.options.min = 1;
        prompt.options.max = 1;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([player.bench[2]]);
    });
    it('Should choose the weakest Pokemon for the opponent', () => {
        // given
        setHp(opponent.bench[2], 50);
        prompt.playerType = game_1.PlayerType.TOP_PLAYER;
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.options.allowCancel = false;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([opponent.bench[2]]);
    });
    it('Should choose the weakest Pokemon to deal damage', () => {
        // given
        setHp(player.bench[2], 50);
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.options.allowCancel = false;
        prompt.message = game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([player.bench[2]]);
    });
    it('Should choose the strongest opponent\'s Pokemon to deal damage', () => {
        // given
        setHp(player.bench[2], 200);
        setHp(player.bench[3], 50);
        setHp(opponent.bench[2], 150);
        prompt.playerType = game_1.PlayerType.ANY;
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.message = game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([opponent.bench[2]]);
    });
    it('Should cancel instead of dealing damage to own Pokemon', () => {
        // given
        setHp(player.bench[2], 50);
        prompt.options.min = 1;
        prompt.options.max = 1;
        prompt.message = game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toBeNull();
    });
    it('Should not choose blocked Pokemon', () => {
        // given
        setHp(player.bench[0], 250);
        setHp(player.bench[1], 200);
        setHp(player.bench[2], 150);
        prompt.options.min = 1;
        prompt.options.max = 2;
        prompt.options.blocked = [{ player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 1 }];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result.length).toEqual(2);
        expect(result.includes(player.bench[0])).toBeTruthy();
        expect(result.includes(player.bench[2])).toBeTruthy();
    });
});
