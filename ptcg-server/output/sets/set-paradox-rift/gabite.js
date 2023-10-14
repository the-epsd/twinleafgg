"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gabite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gabite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gible';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Power Blast',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 50,
                text: 'Discard an Energy from this Pokémon.',
                effect: (store, state, effect) => {
                    prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
                }
            },
        ];
        this.set = 'PAR';
        this.name = 'Gabite';
        this.fullName = 'Gabite PAR';
    }
}
exports.Gabite = Gabite;
