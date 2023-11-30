"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grabber = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class Grabber extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = '151';
        this.set2 = '151';
        this.setNumber = '162';
        this.name = 'Grabber';
        this.fullName = 'Grabber 151';
        this.text = 'Your opponent reveals their hand, and you put a Pokémon you find there on the bottom of their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const deckBottom = game_1.StateUtils.findCardList(state, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, { superType: card_types_1.SuperType.POKEMON }, { allowCancel: true, min: 0, max: 1 }), cards => {
                if (cards === null || cards.length === 0) {
                    return;
                }
                const trainerCard = cards[0];
                opponent.hand.moveCardTo(trainerCard, deckBottom);
                deckBottom.moveTo(opponent.deck);
            });
        }
        return state;
    }
}
exports.Grabber = Grabber;
