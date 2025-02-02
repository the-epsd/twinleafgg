"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TownMap = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TownMap extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BKT';
        this.name = 'Town Map';
        this.fullName = 'Town Map BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '150';
        this.text = 'Turn all of your Prize cards face up. (Those Prize cards remain ' +
            'face up for the rest of the game.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.prizes.forEach(p => {
                p.isPublic = true;
                p.faceUpPrize = true;
                p.isSecret = false;
            });
            effect.player.hand.moveCardTo(effect.trainerCard, effect.player.supporter);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.TownMap = TownMap;
