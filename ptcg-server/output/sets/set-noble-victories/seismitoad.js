"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seismitoad = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Seismitoad extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Palpitoad';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Round',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Does 30 damage times the number of your Pokémon that have the Round attack.'
            },
            { name: 'Hyper Voice', cost: [W, W, C], damage: 70, text: '' },
        ];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Seismitoad';
        this.fullName = 'Seismitoad NVI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
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
exports.Seismitoad = Seismitoad;
