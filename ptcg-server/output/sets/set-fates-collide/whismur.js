"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whismur = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Whismur extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Pound', cost: [C], damage: 10, text: '' },
            {
                name: 'Round',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage times the number of your Pokémon that have the Round attack.'
            },
        ];
        this.set = 'FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Whismur';
        this.fullName = 'Whismur FCO';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            let roundPokemon = 0;
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.attacks.some(attack => attack.name === 'Round')) {
                    roundPokemon += 1;
                }
            });
            effect.damage = effect.attack.damage * roundPokemon;
        }
        return state;
    }
}
exports.Whismur = Whismur;
