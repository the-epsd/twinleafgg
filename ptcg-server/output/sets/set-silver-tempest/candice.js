"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candice = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Candice extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '152';
        this.regulationMark = 'F';
        this.name = 'Candice';
        this.fullName = 'Candice SIT';
        this.text = 'Look at the top 7 cards of your deck. You may reveal any number of [W] Pokémon and [W] Energy cards you find there and put them into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 7);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.WATER } ||
                { superType: card_types_1.SuperType.ENERGY, name: 'Water Energy' }, { min: 0, max: 7, allowCancel: true }), selected => {
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Candice = Candice;
