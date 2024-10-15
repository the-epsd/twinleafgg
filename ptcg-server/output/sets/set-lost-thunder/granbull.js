"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Granbull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
// LOT Granbull 138 (https://limitlesstcg.com/cards/LOT/138)
class Granbull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snubbull';
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [{ type: card_types_1.CardType.DARK, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'All Out',
                cost: [card_types_1.CardType.FAIRY],
                damage: 30,
                text: 'If you have no cards in your hand, this attack does 130 more damage.'
            },
            {
                name: 'Giant Fangs',
                cost: [card_types_1.CardType.FAIRY, card_types_1.CardType.FAIRY, card_types_1.CardType.FAIRY],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'LOT';
        this.name = 'Granbull';
        this.fullName = 'Granbull LOT';
        this.setNumber = '138';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // All Out
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                effect.damage += 130;
            }
        }
        return state;
    }
}
exports.Granbull = Granbull;
