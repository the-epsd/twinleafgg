"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalCave = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class CrystalCave extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'EVS';
        this.name = 'Crystal Cave';
        this.fullName = 'Crystal Cave EVS';
        this.text = 'Once during each player\'s turn, that player may heal 30 damage from each of their [M] Pokémon and [N] Pokémon.';
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        // Heal each Pokemon by 10 damage
        player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
            const pokemonCard = cardList;
            if (pokemonCard.cardType === card_types_1.CardType.METAL || card_types_1.CardType.DRAGON) {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
            }
            return state;
        });
        return state;
    }
}
exports.CrystalCave = CrystalCave;
