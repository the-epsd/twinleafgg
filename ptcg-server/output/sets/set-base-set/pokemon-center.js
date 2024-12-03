"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCenter = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
class PokemonCenter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Pokémon Center';
        this.fullName = 'Pokémon Center BS';
        this.text = 'Remove all damage counters from all of your own Pokémon with damage counters on them, then discard all Energy cards attached to those Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.damage > 0) {
                    const healAmount = cardList.damage;
                    const healEffect = new game_effects_1.HealEffect(player, cardList, healAmount);
                    state = store.reduceEffect(state, healEffect);
                    // Only discard energy if healing occurred
                    if (healAmount > 0) {
                        const cards = cardList.cards.filter(c => c instanceof __1.EnergyCard);
                        cardList.moveCardsTo(cards, player.discard);
                    }
                }
            });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.PokemonCenter = PokemonCenter;
