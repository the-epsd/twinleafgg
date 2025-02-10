"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leon = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
class Leon extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'VIV';
        this.name = 'Leon';
        this.fullName = 'Leon VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.text = 'During this turn, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
        this.LEON_MARKER = 'LEON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            supporterTurn == 1;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            prefabs_1.ADD_MARKER(this.LEON_MARKER, player, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (prefabs_1.PUT_DAMAGE(effect) && prefabs_1.HAS_MARKER(this.LEON_MARKER, effect.player, this) && effect.damage > 0) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            effect.damage += 30;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.LEON_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.LEON_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.Leon = Leon;
