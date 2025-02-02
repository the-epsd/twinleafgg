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
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.name = 'Grabber';
        this.fullName = 'Grabber MEW';
        this.text = 'Your opponent reveals their hand, and you put a Pokémon you find there on the bottom of their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const deckBottom = new game_1.CardList();
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, { superType: card_types_1.SuperType.POKEMON }, { allowCancel: false, min: 0, max: 1 }), selectedCard => {
                const selected = selectedCard || [];
                if (selectedCard === null || selected.length === 0) {
                    player.supporter.moveCardTo(this, player.discard);
                    return;
                }
                opponent.hand.moveCardTo(selected[0], deckBottom);
                deckBottom.moveTo(opponent.deck);
                player.supporter.moveCardTo(this, player.discard);
            });
        }
        return state;
    }
}
exports.Grabber = Grabber;
