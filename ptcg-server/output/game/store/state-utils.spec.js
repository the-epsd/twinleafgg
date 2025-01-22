"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_types_1 = require("./card/card-types");
const state_utils_1 = require("./state-utils");
describe('StateUtils', () => {
    // let playerId: number;
    let fire;
    let fighting;
    let lightning;
    let water;
    let unitFdy;
    let blendWLFM;
    let unitLPM;
    let unitGRW;
    let rainbow;
    let blendGRPD;
    // let dark: CardType[];
    // let colorless: CardType[];
    // let dce: CardType[];
    function createEnergy(name, provides) {
        const card = { name, superType: card_types_1.SuperType.ENERGY, provides };
        return { card, provides };
    }
    beforeEach(() => {
        // playerId = 1;
        fire = [card_types_1.CardType.FIRE];
        fighting = [card_types_1.CardType.FIGHTING];
        lightning = [card_types_1.CardType.LIGHTNING];
        water = [card_types_1.CardType.WATER];
        unitFdy = [card_types_1.CardType.FDY];
        blendWLFM = [card_types_1.CardType.WLFM];
        unitLPM = [card_types_1.CardType.LPM];
        unitGRW = [card_types_1.CardType.GRW];
        rainbow = [card_types_1.CardType.ANY];
        blendGRPD = [card_types_1.CardType.GRPD];
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
    it('Should handle two Unit LPM for {L}{L} cost', () => {
        // given
        const cost = [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING];
        const energy = [
            createEnergy('unitLPM1', unitLPM),
            createEnergy('unitLPM2', unitLPM)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle two Unit GRW for {R}{R} cost', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('unitGRW1', unitGRW),
            createEnergy('unitGRW2', unitGRW)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle different multi-energies for same type cost', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE];
        const energy = [
            createEnergy('unitGRW', unitGRW),
            createEnergy('blendGRPD', blendGRPD)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle Unit LPM + Blend WLFM for {L}{M} cost', () => {
        // given
        const cost = [card_types_1.CardType.LIGHTNING, card_types_1.CardType.METAL];
        const energy = [
            createEnergy('unitLPM', unitLPM),
            createEnergy('blendWLFM', blendWLFM)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle Unit GRW + Blend GRPD for {R}{W} cost', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.WATER];
        const energy = [
            createEnergy('unitGRW', unitGRW),
            createEnergy('blendGRPD', blendGRPD)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle two different Blend energies for {L}{P} cost', () => {
        // given
        const cost = [card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC];
        const energy = [
            createEnergy('blendWLFM', blendWLFM),
            createEnergy('blendGRPD', blendGRPD)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle same Blend energy twice for {W}{F} cost', () => {
        // given
        const cost = [card_types_1.CardType.WATER, card_types_1.CardType.FIGHTING];
        const energy = [
            createEnergy('blendWLFM1', blendWLFM),
            createEnergy('blendWLFM2', blendWLFM)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should fail when one multi-energy provides a cost but not the other', () => {
        // given
        const cost = [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC];
        const energy = [
            createEnergy('unitLPM', unitLPM),
            createEnergy('blendWLFM', blendWLFM)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeFalsy();
    });
    it('Should handle complex mix of basic and multi-energies', () => {
        // given
        const cost = [
            card_types_1.CardType.LIGHTNING,
            card_types_1.CardType.PSYCHIC,
            card_types_1.CardType.WATER,
            card_types_1.CardType.COLORLESS
        ];
        const energy = [
            createEnergy('unitLPM', unitLPM),
            createEnergy('blendWLFM', blendWLFM),
            createEnergy('lightning', lightning),
            createEnergy('water', water)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle ANY type from rainbow with multi-energies', () => {
        const cost = [
            card_types_1.CardType.LIGHTNING,
            card_types_1.CardType.PSYCHIC,
            card_types_1.CardType.WATER
        ];
        const energy = [
            createEnergy('unitLPM', unitLPM),
            createEnergy('rainbow', rainbow),
            createEnergy('blendWLFM', blendWLFM)
        ];
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy, cost)).toBeTruthy();
    });
    it('Should handle energy assignment regardless of energy card order', () => {
        // given
        const cost = [card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC];
        const energy1 = [
            createEnergy('blendGRPD', blendGRPD),
            createEnergy('unitLPM', unitLPM)
        ];
        const energy2 = [
            createEnergy('unitLPM', unitLPM),
            createEnergy('blendGRPD', blendGRPD)
        ];
        // then
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy1, cost)).toBeTruthy();
        expect(state_utils_1.StateUtils.checkEnoughEnergy(energy2, cost)).toBeTruthy();
    });
});
