"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotom = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Rotom extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Astonish',
                cost: [L],
                damage: 20,
                text: 'Choose a random card from your opponent\'s hand. Your opponent reveals it and shuffles it into their deck.'
            }, {
                name: 'Gadget Show',
                cost: [C, C],
                damage: 30,
                text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokemon.',
            }];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rotom';
        this.fullName = 'Rotom SV9a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1, isSecret: true }), cards => {
                cards = cards || [];
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => []);
                opponent.hand.moveCardsTo(cards, opponent.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let toolCount = 0;
            [player.active, ...player.bench].forEach(list => {
                list.cards.forEach(card => {
                    if (card instanceof game_1.PokemonCard && card.tools.length > 0) {
                        toolCount += card.tools.length;
                    }
                });
            });
            effect.damage = 30 * toolCount;
        }
        return state;
    }
}
exports.Rotom = Rotom;
