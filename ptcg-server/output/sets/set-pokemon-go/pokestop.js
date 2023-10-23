"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokestop = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    // Discard top 3 cards from player's deck
    player.deck.moveTo(player.discard, 3);
    // Check if any discarded cards are Items
    const itemCards = player.discard.cards.filter((card) => card.type === 'Item');
    if (itemCards.length > 0) {
        itemCards.forEach(card => {
            itemCards.forEach(item => player.discard.moveCardTo(item, player.hand));
        });
    }
    yield state;
}
class Pokestop extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.set2 = 'pokemongo';
        this.setNumber = '68';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PGO';
        this.name = 'Pokéstop';
        this.fullName = 'Pokéstop PGO';
        this.text = 'Once during each player\'s turn, that player may discard 3 cards from the top of their deck. If a player discarded any Item cards in this way, they put those Item cards into their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Pokestop = Pokestop;
