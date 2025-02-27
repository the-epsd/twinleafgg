"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ponyta = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ponyta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Strike',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage for each heads.'
            }
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Ponyta';
        this.fullName = 'Ponyta SV9a';
    }
    reduceEffect(store, state, effect) {
        // Double Strike
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let heads = 0;
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    heads++;
                }
            });
            prefabs_1.COIN_FLIP_PROMPT(store, state, player, result => {
                if (result) {
                    heads++;
                }
            });
            effect.damage = heads * 10;
        }
        return state;
    }
}
exports.Ponyta = Ponyta;
