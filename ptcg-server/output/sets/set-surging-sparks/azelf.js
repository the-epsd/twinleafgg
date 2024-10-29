"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azelf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Azelf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Heart Fulfilment',
                cost: [P, C],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on your opponent\'s Pokémon.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '80';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Azelf';
        this.fullName = 'Azelf SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let totalDamage = 0;
            // Check active Pokémon
            totalDamage += opponent.active.damage;
            // Check bench Pokémon
            opponent.bench.forEach(benchPokemon => {
                totalDamage += benchPokemon.damage;
            });
            effect.damage = totalDamage + 10;
        }
        return state;
    }
}
exports.Azelf = Azelf;
