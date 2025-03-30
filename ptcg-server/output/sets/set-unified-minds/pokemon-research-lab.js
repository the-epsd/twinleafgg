"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonResearchLab = void 0;
const state_utils_1 = require("../../game/store/state-utils");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class PokemonResearchLab extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '205';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'UNM';
        this.name = 'Pokémon Research Lab';
        this.fullName = 'Pokémon Research Lab UNM';
        this.text = 'Once during each player\'s turn, that player may search their deck for up to 2 Pokémon that evolve from Unidentified Fossil, put those Pokémon onto their Bench, and shuffle their deck. If a player searches their deck in this way, their turn ends.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const slots = prefabs_1.GET_PLAYER_BENCH_SLOTS(player);
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { evolvesFrom: "Unidentified Fossil" }, { min: 0, max: Math.min(2, slots.length), allowCancel: true });
            store.log(state, game_1.GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
            return store.reduceEffect(state, new game_phase_effects_1.EndTurnEffect(player));
        }
        return state;
    }
}
exports.PokemonResearchLab = PokemonResearchLab;
