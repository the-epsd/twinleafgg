"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurvivalCast = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SurvivalCast extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Survival Cast';
        this.fullName = 'Survival Cast SV5';
        this.text = 'If the Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            if (player.active.damage == 0 && effect.damage >= player.active.hp) {
                effect.damage = player.active.hp - 10;
                player.active.hp = 10;
                (_a = player.active.tool) === null || _a === void 0 ? void 0 : _a.cards.moveTo(player.discard);
            }
            return state;
        }
        return state;
    }
}
exports.SurvivalCast = SurvivalCast;
