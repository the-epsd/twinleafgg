"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryogonalUNM = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class CryogonalUNM extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.set = 'UNM';
        this.setNumber = '46';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cryogonal';
        this.fullName = 'Cryogonal UNM';
        this.attacks = [
            {
                name: 'Frozen Lock',
                cost: [game_1.CardType.WATER],
                damage: 10,
                text: 'Your opponent can\'t play any Item cards from their hand during their next turn.'
            },
        ];
        this.FROZEN_LOCK_MARKER = 'FROZEN_LOCK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Frozen Lock
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            opponent.marker.addMarker(this.FROZEN_LOCK_MARKER, this);
        }
        // Block item cards while we have the marker
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.player.marker.hasMarker(this.FROZEN_LOCK_MARKER)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
        }
        // Remove marker at the end of a player's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.FROZEN_LOCK_MARKER);
        }
        return state;
    }
}
exports.CryogonalUNM = CryogonalUNM;
