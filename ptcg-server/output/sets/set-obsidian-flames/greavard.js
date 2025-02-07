"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Greavard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Greavard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Play Rough',
                cost: [C, C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Greavard';
        this.fullName = 'Greavard OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    effect.damage += 30;
                }
            });
        }
        return state;
    }
}
exports.Greavard = Greavard;
