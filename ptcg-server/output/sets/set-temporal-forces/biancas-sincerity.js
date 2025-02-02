"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiancasSincerity = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
class BiancasSincerity extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '69';
        this.regulationMark = 'H';
        this.name = 'Bianca\'s Sincerity';
        this.fullName = 'Bianca\'s Sincerity SV5';
        this.text = 'Heal all damage from 1 of your Pokémon that has 30 HP or less remaining.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.hp <= 30) {
                    return state;
                }
                const healEffect = new game_effects_1.HealEffect(player, cardList, cardList.damage);
                state = store.reduceEffect(state, healEffect);
                const cards = cardList.cards.filter(c => c instanceof __1.EnergyCard);
                cardList.moveCardsTo(cards, player.discard);
            });
            return state;
        }
        return state;
    }
}
exports.BiancasSincerity = BiancasSincerity;
