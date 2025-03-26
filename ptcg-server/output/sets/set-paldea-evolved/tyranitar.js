"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyranitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tyranitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pupitar';
        this.cardType = D;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Rout',
                cost: [D],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Dread Mountain',
                cost: [D, D],
                damage: 230,
                text: 'Discard the top 4 cards of your deck.'
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Tyranitar';
        this.fullName = 'Tyranitar PAL';
    }
    reduceEffect(store, state, effect) {
        // Rout
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage += opponentBenched * 30;
        }
        // Dread Mountain
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            effect.player.deck.moveTo(effect.player.discard, 4);
        }
        return state;
    }
}
exports.Tyranitar = Tyranitar;
