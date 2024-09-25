"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon2 = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Porygon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Porygon';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Double Draw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'UNB';
        this.name = 'Porygon2';
        this.fullName = 'Porygon2 UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.deck.moveTo(player.hand, Math.min(player.deck.cards.length, 2));
            return state;
        }
        return state;
    }
}
exports.Porygon2 = Porygon2;
