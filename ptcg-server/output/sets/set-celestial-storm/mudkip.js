"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mudkip = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Mudkip extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Water Reserve',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 3 [W] Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }
        ];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Mudkip';
        this.fullName = 'Mudkip CES';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 3, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                    cards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (cards.length > 0) {
                        state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                    }
                }
            });
        }
        return state;
    }
}
exports.Mudkip = Mudkip;
