"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grant = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
class Grant extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.name = 'Grant';
        this.fullName = 'Grant ASR';
        this.text = 'During this turn, your [F] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).' +
            '' +
            'During your turn, if this Grant is in your discard pile, you may discard 2 cards, except any Grant, from your hand. If you do, put this Grant into your hand. (This effect doesn\'t use up your Supporter card for the turn.)';
        this.GRANT_MARKER = 'GRANT_MARKER';
        this.RETURN_TO_HAND_MARKER = 'RETURN_TO_HAND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.marker.addMarker(this.GRANT_MARKER, this);
            if (effect instanceof attack_effects_1.DealDamageEffect) {
                const marker = effect.player.marker;
                if (marker.hasMarker(this.GRANT_MARKER, this) && effect.damage > 0) {
                    effect.damage += 30;
                }
                // Check if card is in the discard
                if (player.discard.cards.includes(this) === false) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                }
                // Power already used
                if (player.marker.hasMarker(this.RETURN_TO_HAND_MARKER, this)) {
                    throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                }
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 2, max: 2, allowCancel: true }), selected => {
                    cards = selected || [];
                    // Operation canceled by the user
                    if (cards.length === 0) {
                        return state;
                    }
                    player.marker.addMarker(this.RETURN_TO_HAND_MARKER, this);
                    player.hand.moveCardsTo(cards, player.discard);
                    player.discard.moveCardTo(this, player.hand);
                });
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                effect.player.marker.removeMarker(this.RETURN_TO_HAND_MARKER, this);
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                effect.player.marker.removeMarker(this.GRANT_MARKER, this);
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Grant = Grant;
