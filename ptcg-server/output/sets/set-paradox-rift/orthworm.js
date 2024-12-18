"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orthworm = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Orthworm extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Punch and Draw', cost: [card_types_1.CardType.METAL], damage: 20, text: 'Draw 2 cards.' },
            { name: 'Crunch-Time Rush', cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 90, text: 'If there are 3 or fewer cards in your deck, this attack does 150 more damage.' }
        ];
        this.set = 'PAR';
        this.name = 'Orthworm';
        this.fullName = 'Orthworm PAR';
        this.setNumber = '138';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Punch and Draw
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
        }
        // Crunch-Time Rush
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.deck.cards.length <= 3) {
                effect.damage += 150;
            }
        }
        return state;
    }
}
exports.Orthworm = Orthworm;
