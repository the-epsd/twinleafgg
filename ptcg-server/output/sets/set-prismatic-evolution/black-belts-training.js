"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackBeltsTraining = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
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
        this.text = 'During this turn, attacks used by your Pokémon do 40 more damage to your opponent\'s Active Pokémon ex(before applying Weakness and Resistance).';
        this.BLACK_BELTS_TRAINING_MARKER = 'BLACK_BELTS_TRAINING_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            supporterTurn == 1;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            player.marker.addMarker(this.BLACK_BELTS_TRAINING_MARKER, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && prefabs_1.HAS_MARKER(this.BLACK_BELTS_TRAINING_MARKER, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target !== opponent.active || effect.damage <= 0 || ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                return state;
            }
            effect.damage += 40;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BLACK_BELTS_TRAINING_MARKER, this)) {
            effect.player.marker.removeMarker(this.BLACK_BELTS_TRAINING_MARKER, this);
            return state;
        }
        return state;
    }
}
exports.BlackBeltsTraining = BlackBeltsTraining;
