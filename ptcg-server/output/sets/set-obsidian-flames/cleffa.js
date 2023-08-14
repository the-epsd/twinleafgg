"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cleffa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cleffa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Grasping Draw',
                cost: [],
                damage: 0,
                text: 'Draw cards until you have 7 cards in your hand.'
            }
        ];
        this.set = 'OBF';
        this.name = 'Cleffa';
        this.fullName = 'Cleffa OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardsToDraw = 6 - player.hand.cards.length;
            if (cardsToDraw <= 0) {
                return state;
            }
            player.deck.moveTo(player.hand, cardsToDraw);
        }
        return state;
    }
}
exports.Cleffa = Cleffa;
