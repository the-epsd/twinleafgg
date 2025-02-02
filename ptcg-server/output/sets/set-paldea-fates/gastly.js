"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gastly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gastly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Allure',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 1 card.'
            },
            {
                name: 'Will-O-Wisp',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'PAF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Gastly';
        this.fullName = 'Gastly PAF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.Gastly = Gastly;
