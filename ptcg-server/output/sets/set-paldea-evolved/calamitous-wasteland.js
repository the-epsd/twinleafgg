"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalamitousWasteland = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CalamitousWasteland extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PAL';
        this.regulationMark = 'G';
        this.name = 'Calamitous Wasteland';
        this.fullName = 'Calamitous Wasteland PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '175';
        this.text = 'The Retreat Cost of each Basic non-[F] Pokémon in play (both yours and your opponent\'s) is [C] more.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (player.active.isStage(card_types_1.Stage.BASIC)) {
                const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
                store.reduceEffect(state, checkPokemonTypeEffect);
                if (!checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                    effect.cost.push(card_types_1.CardType.COLORLESS);
                }
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.CalamitousWasteland = CalamitousWasteland;
