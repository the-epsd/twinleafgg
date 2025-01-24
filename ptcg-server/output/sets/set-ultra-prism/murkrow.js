"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Murkrow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Murkrow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mean Look',
                cost: [card_types_1.CardType.DARK],
                damage: 10,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '71';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Murkrow';
        this.fullName = 'Murkrow UPR';
        this.MEAN_LOOK_MARKER = 'MEAN_LOOK_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Mean Look
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.MEAN_LOOK_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.MEAN_LOOK_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.MEAN_LOOK_MARKER, this);
        }
        return state;
    }
}
exports.Murkrow = Murkrow;
