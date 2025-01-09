"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeraoraV = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ZeraoraV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 210;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Thunderous Bolt',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS],
                damage: 190,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'CRZ';
        this.name = 'Zeraora V';
        this.fullName = 'Zeraora V CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.ZeraoraV = ZeraoraV;
