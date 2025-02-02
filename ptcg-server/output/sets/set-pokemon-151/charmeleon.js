"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmeleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Charmeleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charmander';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Combustion',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                text: '',
            },
            {
                name: 'Fire Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 70,
                text: 'Discard an Energy from this Pokémon.',
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Charmeleon';
        this.fullName = 'Charmeleon MEW';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
        }
        return state;
    }
}
exports.Charmeleon = Charmeleon;
