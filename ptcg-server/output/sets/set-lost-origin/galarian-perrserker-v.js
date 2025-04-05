"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianPerrserkerV = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GalarianPerrserkerV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = M;
        this.hp = 200;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Feelin\' Fine',
                cost: [C],
                damage: 0,
                text: 'Draw 3 cards.'
            },
            {
                name: 'Treasure Rush',
                cost: [M, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each card in your hand.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Galarian Perrserker V';
        this.fullName = 'Galarian Perrserker V SV9';
    }
    reduceEffect(store, state, effect) {
        // Feelin' Fine
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DRAW_CARDS(effect.player, 3);
        }
        // Treasure Rush
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.damage = 20 * effect.player.hand.cards.length;
        }
        return state;
    }
}
exports.GalarianPerrserkerV = GalarianPerrserkerV;
