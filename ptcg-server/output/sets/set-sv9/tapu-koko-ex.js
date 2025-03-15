"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TapuKokoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 200;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Thunder Connect',
                cost: [L, C],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each of your Benched Pokémon.'
            },
        ];
        this.set = 'SVM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Tapu Koko ex';
        this.fullName = 'Tapu Koko ex SVM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            effect.damage += (effect.player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 20);
        return state;
    }
}
exports.TapuKokoex = TapuKokoex;
