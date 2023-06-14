"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const choose_energy_prompt_1 = require("./choose-energy-prompt");
const game_message_1 = require("../../game-message");
const card_types_1 = require("../card/card-types");
describe('ChooseEnergyPrompt', () => {
    let playerId;
    let fire;
    let dark;
    let colorless;
    let rainbow;
    let dce;
    function createEnergy(name, provides) {
        const card = { name, superType: card_types_1.SuperType.ENERGY, provides };
        return { card, provides };
    }
    beforeEach(() => {
        playerId = 1;
        fire = [card_types_1.CardType.FIRE];
        dark = [card_types_1.CardType.DARK];
        colorless = [card_types_1.CardType.COLORLESS];
        rainbow = [card_types_1.CardType.ANY];
        dce = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
    });
    it('Should not change the cost (because possible to cancel)', () => {
        // given
        const cost = [card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('dce', dce)
        ];
        // when
        const prompt = new choose_energy_prompt_1.ChooseEnergyPrompt(playerId, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, energy, cost, { allowCancel: true });
        // then
        expect(prompt.cost).toEqual([card_types_1.CardType.FIRE]);
        expect(prompt.result).toBeUndefined();
    });
    it('Should remove all fire energies', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('dark', dark),
            createEnergy('colorless', colorless)
        ];
        // when
        const prompt = new choose_energy_prompt_1.ChooseEnergyPrompt(playerId, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, energy, cost, { allowCancel: false });
        // then
        expect(prompt.cost).toEqual([]);
        expect(prompt.result).toBeUndefined();
    });
    it('Should remove one fire energy', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('dark', dark),
            createEnergy('fire', fire)
        ];
        // when
        const prompt = new choose_energy_prompt_1.ChooseEnergyPrompt(playerId, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, energy, cost, { allowCancel: false });
        // then
        expect(prompt.cost).toEqual([card_types_1.CardType.FIRE]);
        expect(prompt.result).toBeUndefined();
    });
    it('Should remove one fire energy paid by rainbow', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('dark', dark),
            createEnergy('rainbow', rainbow)
        ];
        // when
        const prompt = new choose_energy_prompt_1.ChooseEnergyPrompt(playerId, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, energy, cost, { allowCancel: false });
        // then
        expect(prompt.cost).toEqual([card_types_1.CardType.FIRE]);
        expect(prompt.result).toBeUndefined();
    });
    it('Should remove one colorless energy', () => {
        // given
        const cost = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        const energy = [
            createEnergy('dce', dce)
        ];
        // when
        const prompt = new choose_energy_prompt_1.ChooseEnergyPrompt(playerId, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, energy, cost, { allowCancel: false });
        // then
        expect(prompt.cost).toEqual([card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS]);
        expect(prompt.result).toBeUndefined();
    });
});
