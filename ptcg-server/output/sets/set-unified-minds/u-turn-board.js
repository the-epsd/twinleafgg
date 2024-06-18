"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTurnBoard = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class UTurnBoard extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UNM';
        this.name = 'U-Turn Board';
        this.fullName = 'U-Turn Board UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '211';
        this.text = "The Retreat Cost of the Pokémon this card is attached to is [C] less. If this card is discarded from play, put it into your hand instead of the discard pile.";
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DiscardCardsEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            effect.target.moveCardTo(this, player.hand);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.tool === this) {
            const player = effect.player;
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (effect.cost.length === 0) {
                effect.cost = [];
            }
            else {
                effect.cost.splice(0, 1);
            }
        }
        return state;
    }
}
exports.UTurnBoard = UTurnBoard;
