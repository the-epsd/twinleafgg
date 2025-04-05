"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantHeatran = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class RadiantHeatran extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RADIANT];
        this.regulationMark = 'F';
        this.cardType = R;
        this.hp = 160;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Raging Blast',
                cost: [R, C, C],
                damage: 70,
                damageCalculation: 'x',
                text: 'This attack does 70 damage for each damage counter on this Pokémon.'
            },
        ];
        this.set = 'ASR';
        this.name = 'Radiant Heatran';
        this.fullName = 'Radiant Heatran ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.damage = effect.player.active.damage * 7;
            return state;
        }
        return state;
    }
}
exports.RadiantHeatran = RadiantHeatran;
