"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerilousJungle = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
class PerilousJungle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'H';
        this.set = 'TEF';
        this.name = 'Perilous Jungle';
        this.fullName = 'Perilous Jungle TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.text = 'During Pokémon Checkup, put 2 more damage counters on each Poisoned non-[D] Pokémon (both yours and your opponent\'s).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.player.active);
            store.reduceEffect(state, checkPokemonType);
            if ((checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK))) {
                return state;
            }
            effect.poisonDamage += 20;
            return state;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.PerilousJungle = PerilousJungle;
