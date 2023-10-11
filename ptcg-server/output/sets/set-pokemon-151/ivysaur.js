"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/effect-factories/prefabs");
class Ivysaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bulbasaur';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leech Seed',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Heal 20 damage from this Pokémon.',
                effect: (store, state, effect) => {
                    prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
                }
            },
            {
                name: 'Vine Whip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: '',
                effect: undefined
            }
        ];
        this.set = '151';
        this.set2 = '151';
        this.setNumber = '2';
        this.name = 'Ivysaur';
        this.fullName = 'Ivysaur MEW 002';
    }
}
exports.Ivysaur = Ivysaur;
