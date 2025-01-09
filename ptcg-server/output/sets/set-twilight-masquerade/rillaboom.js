"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rillaboom = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Rillaboom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.evolvesFrom = 'Thwackey';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 180;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Drum Beating',
                cost: [game_1.CardType.GRASS],
                damage: 60,
                text: 'During your opponent\'s next turn, attacks used by the Defending Pokémon cost [C] more, and its Retreat Cost is [C] more.'
            },
            {
                name: 'Wood Hammer',
                cost: [game_1.CardType.GRASS, game_1.CardType.GRASS],
                damage: 180,
                text: 'This Pokémon also does 50 damage to itself.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Rillaboom';
        this.fullName = 'Rillaboom TWM';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                const index = effect.cost.indexOf(game_1.CardType.COLORLESS);
                if (index > -1) {
                    effect.cost.splice(index, 0, game_1.CardType.COLORLESS);
                }
                else {
                    effect.cost.push(game_1.CardType.COLORLESS);
                }
            }
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                const index = effect.cost.indexOf(game_1.CardType.COLORLESS);
                if (index > -1) {
                    effect.cost.splice(index, 0, game_1.CardType.COLORLESS);
                }
                else {
                    effect.cost.push(game_1.CardType.COLORLESS);
                }
                return state;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 50);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Rillaboom = Rillaboom;
