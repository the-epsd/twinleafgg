"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scorbunny = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Scorbunny extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Me First',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Live Coal',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'D';
        this.set = 'SWSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Scorbunny';
        this.fullName = 'Scorbunny SWSH';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.deck.moveTo(player.hand, 1);
        }
        return state;
    }
}
exports.Scorbunny = Scorbunny;
