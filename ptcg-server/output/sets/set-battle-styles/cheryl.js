"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cheryl = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cheryl extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.regulationMark = 'E';
        this.name = 'Cheryl';
        this.fullName = 'Cheryl BST';
        this.text = 'Heal all damage from each of your Evolution Pokémon. If you do, discard all Energy from the Pokémon that were healed in this way.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if ((pokemon === null || pokemon === void 0 ? void 0 : pokemon.stage) === card_types_1.Stage.BASIC) {
                    return state;
                }
                if (cardList.damage > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, cardList.damage);
                    state = store.reduceEffect(state, healEffect);
                    const cards = cardList.cards.filter(c => c instanceof __1.EnergyCard);
                    cardList.moveCardsTo(cards, player.discard);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Cheryl = Cheryl;
