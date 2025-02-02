"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Braixen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Braixen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fennekin';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Combustion',
                cost: [card_types_1.CardType.FIRE],
                damage: 30,
                text: ''
            },
            {
                name: 'Flare Parade',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: 'x',
                text: 'This attack does 60 damage for each Serena card in your discard pile.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Braixen';
        this.fullName = 'Braixen SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const cards = effect.player.discard.cards.filter(c => c.name === 'Serena');
            effect.damage = cards.length * 60;
            return state;
        }
        return state;
    }
}
exports.Braixen = Braixen;
