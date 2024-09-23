"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorunt = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Snorunt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Bite',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a F Pokémon, this attack does 30 more damage.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Snorunt';
        this.fullName = 'Snorunt PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponentActive = effect.opponent.active;
            const opponentActiveCard = opponentActive.getPokemonCard();
            if ((opponentActiveCard === null || opponentActiveCard === void 0 ? void 0 : opponentActiveCard.cardType) === card_types_1.CardType.FIGHTING) {
                effect.damage += 30;
            }
            return state;
        }
        return state;
    }
}
exports.Snorunt = Snorunt;
