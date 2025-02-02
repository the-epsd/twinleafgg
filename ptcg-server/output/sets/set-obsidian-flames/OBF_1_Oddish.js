"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oddish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Oddish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Feelin\' Fine',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw a card.'
            },
            {
                name: 'Stampede',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: ''
            }];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Oddish';
        this.fullName = 'Oddish OBF';
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
exports.Oddish = Oddish;
