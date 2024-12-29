"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FossilExcavationMap = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class FossilExcavationMap extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.set = 'FLI';
        this.name = 'Fossil Excavation Map';
        this.fullName = 'Fossil Excavation Map FLI';
        this.text = 'Choose 1:\n' +
            '• Search your deck for an Unidentified Fossil card, reveal it, and put it into your hand. Then, shuffle your deck.\n' +
            '• Put an Unidentified Fossil card from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const options = [
                {
                    message: game_1.GameMessage.DISCARD_AND_DRAW,
                    action: () => {
                        let cards = [];
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { name: 'Unidentified Fossil' }, { min: 0, max: 1, allowCancel: false }), selected => {
                            cards = selected || [];
                        });
                        player.deck.moveCardsTo(cards, player.hand);
                        if (cards.length > 0) {
                            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                        }
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    }
                },
                {
                    message: game_1.GameMessage.SWITCH_POKEMON,
                    action: () => {
                        let cards = [];
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { name: 'Unidentified Fossil' }, { min: 0, max: 1, allowCancel: false }), selected => {
                            cards = selected || [];
                        });
                        player.discard.moveCardsTo(cards, player.hand);
                        if (cards.length > 0) {
                            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                        }
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    }
                }
            ];
            const hasFossilInDiscard = player.discard.cards.some(card => card.name === 'Unidentified Fossil');
            if (!hasFossilInDiscard) {
                options.splice(0, 1);
            }
            if (player.deck.cards.length === 0) {
                options.splice(0, 1);
            }
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.FossilExcavationMap = FossilExcavationMap;
