"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tympole = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tympole extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            { name: 'Get Loud', cost: [W], damage: 10, text: '' },
            {
                name: 'Round',
                cost: [C, C],
                damage: 10,
                damageCalculation: 'x',
                text: 'This attack does 10 damage times the number of your Pokémon that have the Round attack.'
            },
        ];
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Tympole';
        this.fullName = 'Tympole BKP';
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
exports.Tympole = Tympole;
