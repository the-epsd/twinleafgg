"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Varoom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Varoom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Spinning Draw',
                cost: [card_types_1.CardType.METAL],
                damage: 10,
                text: 'Draw a card.'
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.name = 'Varoom';
        this.fullName = 'Varoom OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 1);
        }
        return state;
    }
}
exports.Varoom = Varoom;
