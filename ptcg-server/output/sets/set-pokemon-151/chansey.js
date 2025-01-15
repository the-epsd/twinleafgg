"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
class Chansey extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.hp = 110;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Lucky Bonus',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you took this Pokémon as a face-down Prize card during your turn and your Bench isn\'t full, before you put it into your hand, you may put it onto your Bench. If you put this Pokémon onto your Bench in this way, flip a coin. If heads, take 1 more Prize card.',
                useWhenInPlay: false
            }
        ];
        this.attacks = [
            {
                name: 'Gentle Slap',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.name = 'Chansey';
        this.fullName = 'Chansey MEW';
    }
    reduceEffect(store, state, effect) {
        return state;
    }
}
exports.Chansey = Chansey;
