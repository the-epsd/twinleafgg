"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeDew = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LifeDew extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.TOOL;
        this.tags = [game_1.CardTag.ACE_SPEC];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Life Dew';
        this.fullName = 'Life Dew PLF';
        this.text = 'If the Pokémon this card is attached to is Knocked Out, your opponent takes 1 fewer Prize card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
            effect.prizeCount -= 1;
        }
        return state;
    }
}
exports.LifeDew = LifeDew;
