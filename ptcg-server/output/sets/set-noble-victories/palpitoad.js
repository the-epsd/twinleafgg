"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palpitoad = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Palpitoad extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tympole';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            { name: 'Mud Shot', cost: [W], damage: 20, text: '' },
            {
                name: 'Round',
                cost: [C, C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the number of your Pokémon that have the Round attack.'
            },
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Palpitoad';
        this.fullName = 'Palpitoad NVI';
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
exports.Palpitoad = Palpitoad;
