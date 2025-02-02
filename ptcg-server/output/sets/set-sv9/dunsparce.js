"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dunsparce = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dunsparce extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Trading Places',
                cost: [C],
                damage: 0,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            { name: 'Ram', cost: [C, C], damage: 20, text: '' },
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Dunsparce';
        this.fullName = 'Dunsparce SV9';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this))
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
        return state;
    }
}
exports.Dunsparce = Dunsparce;
