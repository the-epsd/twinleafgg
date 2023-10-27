"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokestop = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_list_1 = require("../../game/store/state/card-list");
class Pokestop extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.set2 = 'pokemongo';
        this.setNumber = '68';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PGO';
        this.name = 'PokéStop';
        this.fullName = 'Pokéstop PGO';
        this.text = 'Once during each player\'s turn, that player may discard 3 cards from the top of their deck. If a player discarded any Item cards in this way, they put those Item cards into their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        const deckTop = new card_list_1.CardList();
        player.deck.moveTo(deckTop, 3);
        // Filter for item cards
        const itemCards = deckTop.cards.filter(c => c instanceof trainer_card_1.TrainerCard &&
            c.trainerType === card_types_1.TrainerType.ITEM);
        // Move all item cards to hand
        deckTop.moveCardsTo(itemCards, player.hand);
        // Move remaining cards back to deck
        const remainingCards = deckTop.cards;
        deckTop.moveTo(player.discard, remainingCards.length);
        return state;
    }
}
exports.Pokestop = Pokestop;
