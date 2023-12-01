"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GapejawBog = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GapejawBog extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.set2 = 'astralradiance';
        this.setNumber = '142';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.name = 'Gapejaw Bog';
        this.fullName = 'Gapejaw Bog ASR';
        this.text = 'Whenever either player puts a Basic Pokémon from their hand onto their Bench, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
            damageEffect.target = effect.target;
            store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.GapejawBog = GapejawBog;
