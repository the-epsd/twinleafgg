"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKoko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TapuKoko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Allure',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 110,
                damageCalculation: '+',
                text: ''
            }
        ];
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Tapu Koko';
        this.fullName = 'Tapu Koko DAA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
        }
        return state;
    }
}
exports.TapuKoko = TapuKoko;
