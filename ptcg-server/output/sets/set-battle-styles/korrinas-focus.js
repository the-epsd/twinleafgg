"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KorrinasFocus = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class KorrinasFocus extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.name = 'Korrina\'s Focus';
        this.fullName = 'Korrina\'s Focus BST';
        this.text = 'Draw cards until you have 6 cards in your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            while (player.hand.cards.length < 6) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
            return state;
        }
        return state;
    }
}
exports.KorrinasFocus = KorrinasFocus;
