"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlazikenV = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BlazikenV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_V, game_1.CardTag.RAPID_STRIKE];
        this.cardType = game_1.CardType.FIRE;
        this.hp = 210;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'High Jump Kick',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            },
            {
                name: 'Fire Spin',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 210,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Blaziken V';
        this.fullName = 'Blaziken V CRE';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, game_1.CardType.COLORLESS, 2);
        }
        return state;
    }
}
exports.BlazikenV = BlazikenV;
