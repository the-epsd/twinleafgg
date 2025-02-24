"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cetitan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Cetitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cetoddle';
        this.cardType = W;
        this.hp = 180;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Solid Body',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Dangerous Mouth',
                cost: [W, C, C, C],
                damage: 150,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '54';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cetitan';
        this.fullName = 'Cetitan SSP';
    }
    reduceEffect(store, state, effect) {
        // Solid Body
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this) {
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.opponent, this)) {
                return state;
            }
            effect.damage -= 30;
        }
        return state;
    }
}
exports.Cetitan = Cetitan;
