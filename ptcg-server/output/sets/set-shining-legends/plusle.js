"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plusle = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Plusle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tag Team Boost',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                damageCalculation: '+',
                text: 'If Minun is on your Bench, this attack does 50 more damage.',
            }];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Plusle';
        this.fullName = 'Plusle SLG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const minunIsOnBench = player.bench.some(c => c.cards.some(card => card.name === 'Minun'));
            if (minunIsOnBench) {
                effect.damage += 50;
            }
            return state;
        }
        return state;
    }
}
exports.Plusle = Plusle;
