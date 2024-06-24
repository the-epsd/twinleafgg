"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_types_1 = require("./card/card-types");
const state_utils_1 = require("./state-utils");
describe('StateUtils', () => {
    // let playerId: number;
    let fire;
    let fighting;
    let unitFdy;
    let blendWLFM;
    let unitLPM;
    // let dark: CardType[];
    // let colorless: CardType[];
    let rainbow;
    // let dce: CardType[];
    function createEnergy(name, provides) {
        const card = { name, superType: card_types_1.SuperType.ENERGY, provides };
        return { card, provides };
    }
    beforeEach(() => {
        // playerId = 1;
        fire = [card_types_1.CardType.FIRE];
        fighting = [card_types_1.CardType.FIGHTING];
        // dark = [ CardType.DARK ];
        unitFdy = [card_types_1.CardType.FDY];
        blendWLFM = [card_types_1.CardType.WLFM];
        unitLPM = [card_types_1.CardType.LPM];
        // colorless = [ CardType.COLORLESS ];
        rainbow = [card_types_1.CardType.ANY];
        // dce = [ CardType.COLORLESS, CardType.COLORLESS ];
    });
    it('Should return true, when provided the correct energy', () => {
        // given
        const cost = [card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('fire', fire)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return false when provided too few energy', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('fire', fire)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
    });
    it('Should return true when provided rainbow energy', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('fire', fire),
            createEnergy('rainbow', rainbow)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided fdy', () => {
        // given
        const cost = [card_types_1.CardType.FIGHTING, card_types_1.CardType.FAIRY];
        const energy = [
            createEnergy('fighting', fighting),
            createEnergy('unitFdy', unitFdy)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with multiple blends that match out of order energy cost', () => {
        // given
        const cost = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING];
        const energy = [
            createEnergy('unitLPM', unitLPM),
            createEnergy('blendWLFM', blendWLFM),
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with multiple blends and a rainbow that match out of order energy cost', () => {
        // given
        const cost = [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.GRASS];
        const energy = [
            createEnergy('unitLPM', unitLPM),
            createEnergy('rainbow', rainbow),
            createEnergy('blendWLFM', blendWLFM),
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with too much energy', () => {
        // given
        const cost = [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING];
        const energy = [
            createEnergy('fighting', fighting),
            createEnergy('fighting', fighting),
            createEnergy('unitFdy', unitFdy)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should return true when provided with all rainbows', () => {
        // given
        const cost = [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING];
        const energy = [
            createEnergy('rainbow', rainbow),
            createEnergy('rainbow', rainbow),
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
});
