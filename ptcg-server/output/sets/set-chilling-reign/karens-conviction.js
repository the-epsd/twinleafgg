"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KarensConviction = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const __1 = require("../..");
class KarensConviction extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.regulationMark = 'E';
        this.name = 'Karen\'s Conviction';
        this.fullName = 'Karen\'s Conviction CRE';
        this.text = 'During this turn, your Single Strike Pokémon\'s attacks do 20 more damage to your opponent\'s Active Pokémon for each Prize card your opponent has taken (before applying Weakness and Resistance).';
        this.KARENS_CONVICTION_MARKER = 'KARENS_CONVICTION_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 20;
            player.marker.addMarker(this.KARENS_CONVICTION_MARKER, this);
            if (effect instanceof attack_effects_1.DealDamageEffect) {
                const marker = effect.player.marker;
                if (marker.hasMarker(this.KARENS_CONVICTION_MARKER, this) && effect.damage > 0) {
                    effect.damage += prizesTaken * damagePerPrize;
                }
                return state;
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.KARENS_CONVICTION_MARKER, this)) {
                effect.player.marker.removeMarker(this.KARENS_CONVICTION_MARKER, this);
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.KarensConviction = KarensConviction;
