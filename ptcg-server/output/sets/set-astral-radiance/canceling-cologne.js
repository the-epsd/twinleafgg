"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelingCologne = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class CancelingCologne extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.name = 'Canceling Cologne';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.fullName = 'Canceling Cologne ASR';
        this.text = 'Until the end of your turn, your opponent\'s Active Pokémon has no Abilities. (This includes Pokémon that come into play during that turn.)';
        this.CANCELING_COLOGNE_MARKER = 'CANCELING_COLOGNE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER)) {
                opponent.marker.removeMarker(this.CANCELING_COLOGNE_MARKER);
            }
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.CANCELING_COLOGNE_MARKER, this);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        if (effect instanceof game_effects_1.PowerEffect && !effect.power.exemptFromAbilityLock) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const pokemonCard = effect.card;
            const activePokemon = opponent.active.cards[0]; // Assuming activePokemon is the first card in the array
            if (opponent.marker.hasMarker(this.CANCELING_COLOGNE_MARKER)) {
                if (pokemonCard === activePokemon) {
                    effect.preventDefault = true;
                    return state;
                }
            }
        }
        return state;
    }
}
exports.CancelingCologne = CancelingCologne;
