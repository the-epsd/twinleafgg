"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafyCamoPoncho = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class LeafyCamoPoncho extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.name = 'Leafy Camo Poncho';
        this.fullName = 'Leafy Camo Poncho SIT';
        this.set = 'SIT';
        this.setNumber = '160';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c;
        // If this is a supporter effect from the opponent
        if (effect instanceof play_card_effects_1.TrainerTargetEffect &&
            ((_a = effect.trainerCard) === null || _a === void 0 ? void 0 : _a.trainerType) === card_types_1.TrainerType.SUPPORTER &&
            effect.target &&
            effect.target.cards.includes(this) &&
            (((_b = effect.target.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) || ((_c = effect.target.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.tags.includes(card_types_1.CardTag.POKEMON_VMAX)))) {
            effect.target = undefined;
        }
        return state;
    }
}
exports.LeafyCamoPoncho = LeafyCamoPoncho;
