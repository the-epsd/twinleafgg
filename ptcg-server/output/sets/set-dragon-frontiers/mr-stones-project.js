"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrStonesProject = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MrStonesProject extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Mr. Stone\'s Project';
        this.fullName = 'Mr. Stone\'s Project DF';
        this.text = 'Search your deck for up to 2 Basic cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward. Or, search your discard pile for up to 2 Basic cards, show them to your opponent, and put them into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.discard.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const options = [
                {
                    message: game_1.GameMessage.CHOOSE_ENERGY_FROM_DECK,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
                            cards = selected || [];
                            if (cards.length > 0) {
                                store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                            }
                            player.deck.moveCardsTo(cards, player.hand);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                            store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                player.deck.applyOrder(order);
                            });
                        });
                        return state;
                    }
                },
                {
                    message: game_1.GameMessage.CHOOSE_ENERGY_FROM_DISCARD,
                    action: () => {
                        let cards = [];
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 2, allowCancel: false }), selected => {
                            cards = selected || [];
                            if (cards.length > 0) {
                                store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                            }
                            player.discard.moveCardsTo(cards, player.hand);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        });
                        return state;
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.MrStonesProject = MrStonesProject;
