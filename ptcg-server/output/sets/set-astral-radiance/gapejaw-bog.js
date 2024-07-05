"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GapejawBog = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GapejawBog extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '142';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Gapejaw Bog';
        this.fullName = 'Gapejaw Bog ASR';
        this.text = 'Whenever either player puts a Basic Pokémon from their hand onto their Bench, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            if (effect.target.cards.length > 0) {
                return state;
            }
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            store.log(state, game_1.GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, { name: owner.name, damage: 20, target: effect.pokemonCard.name, effect: this.name });
            effect.target.damage += 20;
            return state;
        }
        return state;
    }
}
exports.GapejawBog = GapejawBog;
