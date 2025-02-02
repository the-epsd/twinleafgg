"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amarys = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Amarys extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.regulationMark = 'H';
        this.name = 'Amarys';
        this.fullName = 'Amarys PRE';
        this.AMARYS_USED_MARKER = 'AMARYS_USED_MARKER';
        this.text = 'Shuffle your hand into your deck. Then, draw 4 cards. If your opponent has 3 or fewer Prize cards remaining, draw 8 cards instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            prefabs_1.DRAW_CARDS(effect.player, 4);
            prefabs_1.ADD_MARKER(this.AMARYS_USED_MARKER, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.AMARYS_USED_MARKER, effect.player, this)) {
            const hand = effect.player.hand;
            const discard = effect.player.discard;
            if (hand.cards.length >= 5)
                hand.moveCardsTo(hand.cards, discard);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.AMARYS_USED_MARKER, this);
        return state;
    }
}
exports.Amarys = Amarys;
