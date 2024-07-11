"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorKukui = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ProfessorKukui extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SUM';
        this.name = 'Professor Kukui';
        this.fullName = 'Professor Kukui SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '128';
        this.text = 'Draw 2 cards. During this turn, your Pokémon\'s attacks do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';
        this.PROFESSOR_KUKUI_MARKER = 'PROFESSOR_KUKUI_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.marker.addMarker(this.PROFESSOR_KUKUI_MARKER, this);
            player.hand.moveCardTo(effect.trainerCard, player.discard);
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const marker = effect.player.marker;
            if (marker.hasMarker(this.PROFESSOR_KUKUI_MARKER, this) && effect.damage > 0) {
                effect.damage += 20;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.PROFESSOR_KUKUI_MARKER, this);
            return state;
        }
        return state;
    }
}
exports.ProfessorKukui = ProfessorKukui;
