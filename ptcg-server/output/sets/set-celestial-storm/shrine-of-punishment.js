"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShrineOfPunishment = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_2 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ShrineOfPunishment extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_2.TrainerType.STADIUM;
        this.set = 'CES';
        this.setNumber = '143';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shrine of Punishment';
        this.fullName = 'Shrine of Punishment CES';
        this.text = 'Between turns, put 1 damage counter on each Pokémon-GX and Pokémon-EX (both yours and your opponent\'s).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            // idk why this hits both player's pokemon, it might be getting confused as to what the player specified is so it defaults to both, but hey, it works, so i don't care.
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && ((pokemon === null || pokemon === void 0 ? void 0 : pokemon.tags.includes(card_types_1.CardTag.POKEMON_GX)) || pokemon.tags.includes(card_types_1.CardTag.POKEMON_EX))) {
                    cardList.damage += 10;
                }
            });
            if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
            }
        }
        return state;
    }
}
exports.ShrineOfPunishment = ShrineOfPunishment;
