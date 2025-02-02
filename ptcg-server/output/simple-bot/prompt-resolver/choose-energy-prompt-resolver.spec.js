"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
const choose_energy_prompt_resolver_1 = require("./choose-energy-prompt-resolver");
const simple_bot_definitions_1 = require("../simple-bot-definitions");
describe('ChooseEnergyPromptResolver', () => {
    let resolver;
    let prompt;
    let state;
    let player;
    function createEnergy(name, provides) {
        const card = { name, superType: game_1.SuperType.ENERGY, provides };
        return { card, provides };
    }
    beforeEach(() => {
        const simpleBotOptions = {
            tactics: simple_bot_definitions_1.allSimpleTactics,
            promptResolvers: simple_bot_definitions_1.allPromptResolvers,
            scores: simple_bot_definitions_1.defaultStateScores,
            arbiter: simple_bot_definitions_1.defaultArbiterOptions
        };
        resolver = new choose_energy_prompt_resolver_1.ChooseEnergyPromptResolver(simpleBotOptions);
        prompt = new choose_energy_prompt_1.ChooseEnergyPrompt(1, game_1.GameMessage.CHOOSE_CARD_TO_HAND, [], []);
        state = new game_1.State();
        player = new game_1.Player();
    });
    it('Should choose valid energy cost for [R]', () => {
        // given
        const fire = [game_1.CardType.FIRE];
        const dce = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.cost = [game_1.CardType.FIRE];
        prompt.energy = [
            createEnergy('fire', fire),
            createEnergy('fire', fire),
            createEnergy('dce', dce)
        ];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toEqual([createEnergy('fire', fire)]);
    });
    it('Should choose valid energy cost for [R] when dce is first', () => {
        // given
        const fire = [game_1.CardType.FIRE];
        const dce = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.cost = [game_1.CardType.FIRE];
        prompt.energy = [
            createEnergy('dce', dce),
            createEnergy('fire', fire),
            createEnergy('fire', fire)
        ];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toEqual([createEnergy('fire', fire)]);
    });
    it('Should choose valid energy cost for [RRC]', () => {
        // given
        const rainbow = [game_1.CardType.ANY];
        const fire = [game_1.CardType.FIRE];
        const dce = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.cost = [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.COLORLESS];
        prompt.energy = [
            createEnergy('dce', dce),
            createEnergy('fire', fire),
            createEnergy('rainbow', rainbow),
            createEnergy('rainbow', rainbow)
        ];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toEqual([
            createEnergy('fire', fire),
            createEnergy('rainbow', rainbow),
            createEnergy('dce', dce)
        ]);
    });
    it('Should choose valid energy cost for [C]', () => {
        // given
        const rainbow = [game_1.CardType.ANY];
        const fire = [game_1.CardType.FIRE];
        const dce = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.cost = [game_1.CardType.COLORLESS];
        prompt.energy = [
            createEnergy('dce', dce),
            createEnergy('fire', fire),
            createEnergy('rainbow', rainbow),
            createEnergy('rainbow', rainbow)
        ];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toEqual([
            createEnergy('fire', fire)
        ]);
    });
    it('Should choose valid energy cost for [CC]', () => {
        // given
        const rainbow = [game_1.CardType.ANY];
        const fire = [game_1.CardType.FIRE];
        const dce = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.cost = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.energy = [
            createEnergy('dce', dce),
            createEnergy('fire', fire),
            createEnergy('rainbow', rainbow),
            createEnergy('rainbow', rainbow)
        ];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toEqual([
            createEnergy('dce', dce)
        ]);
    });
    it('Should choose valid energy cost for [WCC]', () => {
        // given
        const rainbow = [game_1.CardType.ANY];
        const fire = [game_1.CardType.FIRE];
        const dce = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.cost = [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.energy = [
            createEnergy('dce', dce),
            createEnergy('fire', fire),
            createEnergy('rainbow', rainbow),
            createEnergy('rainbow', rainbow)
        ];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toEqual([
            createEnergy('rainbow', rainbow),
            createEnergy('dce', dce)
        ]);
    });
    it('Should choose valid energy cost for [WCC] (impossible to pay)', () => {
        // given
        const fire = [game_1.CardType.FIRE];
        const dce = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.cost = [game_1.CardType.WATER, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        prompt.energy = [
            createEnergy('dce', dce),
            createEnergy('fire', fire)
        ];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(action.result).toEqual(null);
    });
});
