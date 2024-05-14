"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostCity = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LostCity extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '161';
        this.name = 'Lost City';
        this.fullName = 'Lost City LOR';
        this.text = 'Whenever a Pokémon (either yours or your opponent\'s) is Knocked Out, put that Pokémon in the Lost Zone instead of the discard pile. (Discard all attached cards.)';
        this.LOST_CITY_MARKER = 'LOST_CITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const target = effect.target;
            const cards = target.getPokemons();
            const pokemonIndices = effect.target.cards.map((card, index) => index);
            for (let i = pokemonIndices.length; i >= 0; i--) {
                target.cards.splice(pokemonIndices[i], 1);
            }
            const lostZoned = new game_1.CardList();
            lostZoned.cards = cards;
            lostZoned.moveTo(player.lostzone);
        }
        return state;
    }
}
exports.LostCity = LostCity;
