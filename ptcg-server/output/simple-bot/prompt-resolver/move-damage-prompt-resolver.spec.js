"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const move_damage_prompt_resolver_1 = require("./move-damage-prompt-resolver");
const simple_bot_definitions_1 = require("../simple-bot-definitions");
class TestPokemon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'pokemon';
        this.fullName = 'pokemon';
        this.set = 'test';
        this.hp = 100;
    }
}
describe('MoveDamagePromptResolver', () => {
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
        resolver = new move_damage_prompt_resolver_1.MoveDamagePromptResolver(simpleBotOptions);
        state = createState();
        player = state.players[0];
        opponent = state.players[1];
        const damageMap = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            damageMap.push({ target, damage: 100 });
        });
        opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
            damageMap.push({ target, damage: 100 });
        });
        prompt = new game_1.MoveDamagePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damageMap);
    });
    it('Should move damage to Active', () => {
        // given
        opponent.bench.length = 1;
        setHp(opponent.active, 110);
        opponent.bench[0].damage = 20;
        prompt.options.allowCancel = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }
            }, {
                from: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }
            }]);
    });
    it('Should move damage to Bench, because we can\'t cancel prompt', () => {
        // given
        opponent.bench.length = 1;
        setHp(opponent.active, 110);
        opponent.active.damage = 20;
        prompt.options.min = 1;
        prompt.options.allowCancel = false;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index: 0 }
            }]);
    });
    it('Should cancel prompt, because damage position is correct', () => {
        // given
        opponent.bench.length = 1;
        setHp(opponent.active, 110);
        opponent.active.damage = 20;
        prompt.options.min = 1;
        prompt.options.allowCancel = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toBeNull();
    });
    it('Should move damage from Player to Opponent', () => {
        // given
        prompt.playerType = game_1.PlayerType.ANY;
        player.bench.length = 0;
        opponent.bench.length = 0;
        player.active.damage = 80;
        prompt.options.min = 0;
        prompt.options.max = 3;
        prompt.options.allowCancel = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }
            }, {
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }
            }, {
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }
            }]);
    });
    it('Should KO opponent\'s Active and put damage to opponent\'s Bench', () => {
        // given
        prompt.playerType = game_1.PlayerType.ANY;
        player.bench.length = 0;
        opponent.bench.length = 1;
        player.active.damage = 60;
        opponent.active.damage = 80;
        prompt.options.min = 0;
        prompt.options.max = 3;
        prompt.options.allowCancel = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }
            }, {
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 }
            }, {
                from: { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                to: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index: 0 }
            }]);
    });
});
