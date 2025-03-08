"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansTyphlosion = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EthansTyphlosion extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ethan\'s Quilava';
        this.tags = [game_1.CardTag.ETHANS];
        this.cardType = R;
        this.hp = 170;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Buddy Blast',
                cost: [R],
                damage: 40,
                damageCalculation: '+',
                text: 'This attack does 60 more damage for each Ethan\'s Adventure card in your discard pile.'
            }, {
                name: 'Steam Artillery',
                cost: [R, R, C],
                damage: 160,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Ethan\'s Typhlosion';
        this.fullName = 'Ethan\'s Typhlosion SV9a';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const adventureCount = player.discard.cards.filter(c => c.name === 'Ethan\'s Adventure').length;
            effect.damage += 60 * adventureCount;
        }
        return state;
    }
}
exports.EthansTyphlosion = EthansTyphlosion;
