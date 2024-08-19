"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperBell = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HelperBell extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SV7a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.regulationMark = 'H';
        this.name = 'Helper Bell';
        this.fullName = 'Helper Bell SV7a';
        this.text = 'You can use this card only if you go second, and only on your first turn.' +
            '' +
            'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            // Get current turn
            const turn = state.turn;
            // Check if it is player's first turn
            if (turn !== 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            else {
                const player = effect.player;
                effect.preventDefault = true;
                player.hand.moveCardTo(effect.trainerCard, player.supporter);
                if (player.deck.cards.length === 0) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                // We will discard this card after prompt confirmation
                effect.preventDefault = true;
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), selectedCards => {
                    cards = selectedCards || [];
                    cards.forEach((card, index) => {
                        player.deck.moveCardTo(card, player.hand);
                    });
                    player.supporter.moveCardTo(this, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            }
        }
        return state;
    }
}
exports.HelperBell = HelperBell;
