"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metagross = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Metagross extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metang';
        this.cardType = P;
        this.hp = 170;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [
            { name: 'Wrack Down', cost: [P], damage: 60, text: '' },
            {
                name: 'Zen Headbutt',
                cost: [P, P],
                damage: 130,
                damageCalculation: '+',
                text: 'If you have Beldum and Metang on your Bench, this attack does 150 more damage.',
            },
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Metagross';
        this.fullName = 'Metagross SV9';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let hasBeldum = false;
            let hasMetang = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Beldum') {
                    hasBeldum = true;
                }
                else if (card.name === 'Metang') {
                    hasMetang = true;
                }
            });
            if (hasBeldum && hasMetang) {
                effect.damage += 150;
            }
        }
        return state;
    }
}
exports.Metagross = Metagross;
