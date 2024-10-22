"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Absolex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Absolex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Future Sight',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Look at the top 3 cards of either player\'s deck and put them back in any order.'
            },
            {
                name: 'Cursed Slug',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'If your opponent has 3 or fewer cards in their hand, this attack does 120 more damage.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '135';
        this.name = 'Absol ex';
        this.fullName = 'Absol ex OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_1.GameMessage.CHOOSE_OPTION,
                    action: () => {
                        const opponentDeckTop = new game_1.CardList();
                        opponent.deck.moveTo(opponentDeckTop, 3);
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, opponentDeckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            opponentDeckTop.applyOrder(order);
                            opponentDeckTop.moveToTopOfDestination(opponent.deck);
                        });
                    }
                },
                {
                    message: game_1.GameMessage.CHOOSE_OPTION,
                    action: () => {
                        const player = effect.player;
                        const playerDeckTop = new game_1.CardList();
                        player.deck.moveTo(playerDeckTop, 3);
                        return store.prompt(state, new game_1.OrderCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARDS_ORDER, playerDeckTop, { allowCancel: false }), order => {
                            if (order === null) {
                                return state;
                            }
                            playerDeckTop.applyOrder(order);
                            playerDeckTop.moveToTopOfDestination(player.deck);
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const handCount = opponent.hand.cards.length;
            if (handCount <= 3) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.Absolex = Absolex;
