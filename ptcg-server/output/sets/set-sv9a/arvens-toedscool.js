"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvensToedscool = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArvensToedscool extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.tags = [card_types_1.CardTag.ARVENS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slight Intrusion',
                cost: [C],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            }
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Arven\'s Toedscool';
        this.fullName = 'Arven\'s Toedscool SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
        return state;
    }
}
exports.ArvensToedscool = ArvensToedscool;
