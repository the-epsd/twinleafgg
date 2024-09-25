"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minun = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Minun extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Negative Ion',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 30 (before applying Weakness and Resistance).'
            },
            {
                name: 'Electrishower',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Minun';
        this.fullName = 'Minun DEX';
        this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            effect.damage = 10;
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            if (effect.source.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this)) {
                effect.damage -= 30;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER, this);
            });
        }
        return state;
    }
}
exports.Minun = Minun;
