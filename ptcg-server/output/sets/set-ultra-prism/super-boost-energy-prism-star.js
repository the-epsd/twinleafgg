"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperBoostEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SuperBoostEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'UPR';
        this.setNumber = '136';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Super Boost Energy';
        this.fullName = 'Super Boost Energy UPR';
        this.text = 'This card provides [C] Energy.\nWhile this card is attached to a Stage 2 Pokémon, it provides every type of Energy but provides only 1 Energy at a time. If you have 3 or more Stage 2 Pokémon in play, it provides every type of Energy but provides 4 Energy at a time.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            // Check for Stage 2
            if (((_a = effect.source.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2) {
                // Check for 3 or more Stage 2s
                const player = effect.player;
                let numStage2s = 0;
                if (((_b = player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) === card_types_1.Stage.STAGE_2) {
                    numStage2s++;
                }
                player.bench.forEach((benchSpot) => {
                    var _a;
                    if (((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_2) {
                        numStage2s++;
                    }
                });
                // If 3 or more Stage 2s, provide 4 Rainbow; otherwise provide 1 Rainbow
                if (numStage2s >= 3) {
                    effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY, card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
                    return state;
                }
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY] });
                return state;
            }
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.COLORLESS] });
            return state;
        }
        return state;
    }
}
exports.SuperBoostEnergy = SuperBoostEnergy;
