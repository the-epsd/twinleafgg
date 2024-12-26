"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarMine = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class GalarMine extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.regulationMark = 'D';
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '160';
        this.name = 'Galar Mine';
        this.fullName = 'Galar Mine RCL';
        this.text = 'The Retreat Cost of both Active Pokémon is [C][C] more.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            const playerActive = player.active.getPokemonCard();
            if (opponentActive) {
                effect.cost.push(C, C);
            }
            if (playerActive) {
                effect.cost.push(C, C);
            }
            return state;
        }
        return state;
    }
}
exports.GalarMine = GalarMine;
