"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IrisFightingSpirit = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class IrisFightingSpirit extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Iris\'s Fighting Spirit';
        this.fullName = 'Iris\'s Fighting Spirit SV9';
        this.text = 'Discard a card from your hand. If you do, draw cards until you have 6 cards in your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 0, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                if (player.hand.cards.length >= 6) {
                    return;
                }
                prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
            });
            return state;
        }
        return state;
    }
}
exports.IrisFightingSpirit = IrisFightingSpirit;
