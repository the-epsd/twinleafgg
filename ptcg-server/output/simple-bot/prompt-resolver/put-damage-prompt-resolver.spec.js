"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const put_damage_prompt_resolver_1 = require("./put-damage-prompt-resolver");
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
describe('PutDamagePromptResolver', () => {
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
        resolver = new put_damage_prompt_resolver_1.PutDamagePromptResolver(simpleBotOptions);
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
        prompt = new game_1.PutDamagePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], 20, damageMap);
    });
    it('Should put two damage counters', () => {
        // given
        opponent.active.damage = 80;
        prompt.damage = 20;
        prompt.options.allowCancel = false;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                target: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                damage: 20
            }]);
    });
    it('Should put two damage counters on two different targets', () => {
        // given
        opponent.active.damage = 90;
        opponent.bench.length = 1;
        opponent.bench[0].damage = 90;
        prompt.damage = 20;
        prompt.options.allowCancel = false;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([{
                target: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 },
                damage: 10
            }, {
                target: { player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index: 0 },
                damage: 10
            }]);
    });
    it('Should put damage on Bench, because Active is blocked', () => {
        // given
        prompt.damage = 20;
        prompt.options.blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 });
        prompt.options.allowCancel = false;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result[0].target.player).toEqual(game_1.PlayerType.TOP_PLAYER);
        expect(result[0].target.slot).toEqual(game_1.SlotType.BENCH);
        expect(result[0].damage).toEqual(20);
    });
    it('Should put damage counters on our Pokemons, but we cancel', () => {
        // given
        prompt.playerType = game_1.PlayerType.BOTTOM_PLAYER;
        prompt.options.allowCancel = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toBeNull();
    });
});
