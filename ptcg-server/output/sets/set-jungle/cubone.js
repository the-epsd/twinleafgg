"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cubone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Cubone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [{ type: card_types_1.CardType.LIGHTNING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Snivel',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If the Defending Pokémon attacks Cubone during your opponent\'s next turn, any damage done by the attack is reduced by 20 (after applying Weakness and Resistance). (Benching either Pokémon ends this effect.)'
            },
            {
                name: 'Rage',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 10,
                text: 'Does 10 damage plus 10 more damage for each damage counter on Cubone.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Cubone';
        this.fullName = 'Cubone JU';
        this.REDUCE_DAMAGE_MARKER = 'REDUCE_DAMAGE_MARKER';
        this.CLEAR_REDUCE_DAMAGE_MARKER = 'CLEAR_REDUCE_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.REDUCE_DAMAGE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.damage = effect.player.active.damage * 10;
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.REDUCE_DAMAGE_MARKER)) {
            effect.damage -= 20;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.REDUCE_DAMAGE_MARKER, this);
            });
        }
        return state;
    }
}
exports.Cubone = Cubone;
