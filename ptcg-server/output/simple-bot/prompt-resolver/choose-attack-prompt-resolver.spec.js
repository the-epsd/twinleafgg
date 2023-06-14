"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const choose_attack_prompt_resolver_1 = require("./choose-attack-prompt-resolver");
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
describe('ChooseAttackPromptResolver', () => {
    let resolver;
    let prompt;
    let state;
    let player;
    beforeEach(() => {
        const simpleBotOptions = {
            tactics: simple_bot_definitions_1.allSimpleTactics,
            promptResolvers: simple_bot_definitions_1.allPromptResolvers,
            scores: simple_bot_definitions_1.defaultStateScores,
            arbiter: simple_bot_definitions_1.defaultArbiterOptions
        };
        resolver = new choose_attack_prompt_resolver_1.ChooseAttackPromptResolver(simpleBotOptions);
        player = new game_1.Player();
        state = new game_1.State();
        prompt = new game_1.ChooseAttackPrompt(1, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [new TestPokemon()]);
    });
    it('Should return undefined when other prompt type', () => {
        // given
        const other = {};
        // when
        const action = resolver.resolvePrompt(state, player, other);
        // then
        expect(action).toBeUndefined();
    });
    it('Should choose damage with the most damage and cost', () => {
        // given
        prompt.cards[0].attacks = [{
                name: 'Attack 1',
                damage: 10,
                cost: [],
                text: ''
            }, {
                name: 'Attack 2',
                damage: 30,
                cost: [game_1.CardType.COLORLESS],
                text: ''
            }, {
                name: 'Attack 3',
                damage: 30,
                cost: [],
                text: ''
            }];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual({
            name: 'Attack 2',
            damage: 30,
            cost: [game_1.CardType.COLORLESS],
            text: ''
        });
    });
    it('Should not select blocked attacks', () => {
        // given
        prompt.cards[0].attacks = [{
                name: 'Attack 1',
                damage: 100,
                cost: [],
                text: ''
            }, {
                name: 'Attack 2',
                damage: 0,
                cost: [],
                text: ''
            }];
        prompt.options.blocked = [{ index: 0, attack: 'Attack 1' }];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual({
            name: 'Attack 2',
            damage: 0,
            cost: [],
            text: ''
        });
    });
    it('Should cancel if all attacks are blocked', () => {
        // given
        prompt.cards[0].attacks = [{
                name: 'Attack 1',
                damage: 10,
                cost: [],
                text: ''
            }];
        prompt.options.blocked = [{ index: 0, attack: 'Attack 1' }];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toBeNull();
    });
});
