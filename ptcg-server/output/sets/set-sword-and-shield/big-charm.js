"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigCharm = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BigCharm extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Big Charm';
        this.fullName = 'Big Charm SSH';
        this.text = 'The Pokémon this card is attached to gets +30 HP.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            effect.hp += 30;
        }
        return state;
    }
}
exports.BigCharm = BigCharm;
