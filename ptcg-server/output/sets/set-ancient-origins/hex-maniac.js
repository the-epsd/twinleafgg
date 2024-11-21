"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexManiac = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HexManiac extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'AOR';
        this.setNumber = '75';
        this.name = 'Hex Maniac';
        this.fullName = 'Hex Maniac AOR';
        this.cardImage = 'assets/cardback.png';
        this.text = 'Until the end of your opponent\'s next turn, each Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities. (This includes cards that come into play on that turn.)';
        this.HEX_MANIAC_MARKER = 'HEX_MANIAC_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            player.supporterTurn = 1;
            player.marker.addMarker(this.HEX_MANIAC_MARKER, this);
            opponent.marker.addMarker(this.HEX_MANIAC_MARKER, this);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (effect instanceof game_effects_1.PowerEffect && (effect.player.marker.hasMarker(this.HEX_MANIAC_MARKER, this) ||
            game_1.StateUtils.getOpponent(state, effect.player).marker.hasMarker(this.HEX_MANIAC_MARKER, this))) {
            throw new game_1.GameError(game_1.GameMessage.ABILITY_BLOCKED);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.HEX_MANIAC_MARKER)) {
            effect.player.marker.removeMarker(this.HEX_MANIAC_MARKER, this);
        }
        return state;
    }
}
exports.HexManiac = HexManiac;
