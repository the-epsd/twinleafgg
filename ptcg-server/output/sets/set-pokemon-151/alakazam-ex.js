"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alakazamex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Alakazamex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kadabra';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 310;
        this.weakness = [{ type: D }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Mind Jack',
                cost: [C, C],
                damage: 90,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Dimensional Manipulation',
                cost: [P, P],
                damage: 120,
                useOnBench: true,
                text: 'You may use this attack even if this Pokemon is on the Bench.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.setNumber = '65';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Alakazam ex';
        this.fullName = 'Alakazam ex MEW';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage += opponentBenched * 30;
        }
        return state;
    }
}
exports.Alakazamex = Alakazamex;
