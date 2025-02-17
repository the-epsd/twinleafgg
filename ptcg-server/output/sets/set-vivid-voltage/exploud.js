"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exploud = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Exploud extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Loudred';
        this.cardType = C;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Round',
                cost: [C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each of your Pokémon in play that has the Round attack.'
            },
            { name: 'Hyper Voice', cost: [C, C, C], damage: 120, text: '' },
        ];
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Exploud';
        this.fullName = 'Exploud VIV';
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
exports.Exploud = Exploud;
