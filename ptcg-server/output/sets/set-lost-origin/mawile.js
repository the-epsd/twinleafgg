"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mawile = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Mawile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tempting Trap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your opponen\'s next turn, the Defending Pokémon can\'t retreat. During your next turn, the Defending Pokémon takes 90 more damage from attacks (after applying Weakness and Resistance).'
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }
        ];
        this.set = 'EVS';
        this.set2 = 'evolvingskies';
        this.setNumber = '94';
        this.name = 'Umbreon V';
        this.fullName = 'Umbreon V EVS';
        this.TEMPTING_TRAP_MARKER = 'TEMPTING_TRAP_MARKER';
        this.CLEAR_TEMPTING_TRAP_MARKER = 'CLEAR_TEMPTING_TRAP_MARKER';
        this.RETREAT_MARKER = 'RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.TEMPTING_TRAP_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_TEMPTING_TRAP_MARKER, this);
            opponent.active.marker.addMarker(this.RETREAT_MARKER, this);
            if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.RETREAT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (effect instanceof attack_effects_1.PutDamageEffect
                && effect.target.marker.hasMarker(this.CLEAR_TEMPTING_TRAP_MARKER)) {
                effect.damage += 90;
                return state;
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect
                && effect.player.marker.hasMarker(this.CLEAR_TEMPTING_TRAP_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_TEMPTING_TRAP_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.TEMPTING_TRAP_MARKER, this);
                    opponent.active.marker.addMarker(this.RETREAT_MARKER, this);
                });
            }
            return state;
        }
        return state;
    }
}
exports.Mawile = Mawile;
