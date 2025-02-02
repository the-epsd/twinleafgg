"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shinx = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Shinx extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.FIRE, value: -30 }];
        this.hp = 70;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Curiosity',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent reveals their hand.'
            },
            {
                name: 'Static Shock',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Shinx';
        this.fullName = 'Shinx TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => state);
        }
        return state;
    }
}
exports.Shinx = Shinx;
