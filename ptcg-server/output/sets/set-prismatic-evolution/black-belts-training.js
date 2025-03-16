"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackBeltsTraining = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
class BlackBeltsTraining extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'PRE';
        this.name = 'Black Belt\'s Training';
        this.fullName = 'Black Belt\'s Training PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.regulationMark = 'H';
        this.text = 'During this turn, attacks used by your Pokémon do 40 more damage to your opponent\'s Active Pokémon ex (before applying Weakness and Resistance).';
        this.BLACK_BELTS_TRAINING_MARKER = 'BLACK_BELTS_TRAINING_MARKER';
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
            prefabs_1.ADD_MARKER(this.BLACK_BELTS_TRAINING_MARKER, player, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (prefabs_1.PUT_DAMAGE(effect) && prefabs_1.HAS_MARKER(this.BLACK_BELTS_TRAINING_MARKER, effect.player, this) && effect.damage > 0) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActiveCard = effect.target.getPokemonCard();
            if (oppActiveCard && oppActiveCard.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                if (effect.target !== player.active && effect.target !== opponent.active) {
                    return state;
                }
                effect.damage += 40;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.BLACK_BELTS_TRAINING_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.BLACK_BELTS_TRAINING_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.BlackBeltsTraining = BlackBeltsTraining;
