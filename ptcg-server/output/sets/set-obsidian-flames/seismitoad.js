"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seismitoad = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Seismitoad extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Palpitoad';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Quaking Zone',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon cost [C] more.'
            }];
        this.attacks = [{
                name: 'Echoed Voice',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 120,
                text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 100 more damage (before applying Weakness and Resistance).'
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Seismitoad';
        this.fullName = 'Seismitoad OBF';
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
        this.usedAttack = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect &&
            game_1.StateUtils.getOpponent(state, effect.player).active.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const stub = new game_effects_1.PowerEffect(opponent, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard) {
                effect.cost.push(card_types_1.CardType.COLORLESS);
                return state;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect) {
            this.usedAttack = true;
            console.log('attacked');
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect) {
            if (this.usedAttack) {
                this.usedAttack = false;
                console.log('reset');
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (!this.usedAttack) {
                this.usedAttack = false;
                console.log('did not attack');
                effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
                effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
                console.log('remove all markers');
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
            effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
                console.log('attack added damage');
                effect.damage += 100;
            }
            effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.Seismitoad = Seismitoad;
