"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eri = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class Eri extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Eri';
        this.fullName = 'Eri SV5';
        this.text = 'Your opponent reveals their hand. Discard up to 2 Item cards you find there.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const deckBottom = game_1.StateUtils.findCardList(state, this);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { allowCancel: false, min: 0, max: 2 }), cards => {
                if (cards === null || cards.length === 0) {
                    return;
                }
                const trainerCard = cards[0];
                opponent.hand.moveCardTo(trainerCard, opponent.discard);
                deckBottom.moveTo(opponent.deck);
                player.supporter.moveCardTo(this, player.discard);
            });
        }
        return state;
    }
}
exports.Eri = Eri;
