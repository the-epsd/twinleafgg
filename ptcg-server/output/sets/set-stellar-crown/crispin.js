"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crispin = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Crispin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '133';
        this.name = 'Crispin';
        this.fullName = 'Crispin SV7';
        this.text = 'Search your deck for up to 2 Basic Energy cards of different types, reveal them, and put 1 of them into your hand. Attach the other to 1 of your Pokémon. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const cardList = new game_1.CardList();
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 1) {
                    if (cards[0].name === cards[1].name) {
                        throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                    }
                }
                store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                player.deck.moveCardsTo(cards, cardList);
                if (cardList.cards.length === 2) {
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, cardList, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1, differentTargets: true }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length === 0) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            cardList.moveCardTo(transfer.card, target);
                        }
                        // Move the remaining card to the player's hand
                        const remainingCard = cardList.cards[0];
                        cardList.moveCardTo(remainingCard, player.hand);
                    });
                }
                if (cardList.cards.length === 1) {
                    const remainingCard = cardList.cards[0];
                    cardList.moveCardTo(remainingCard, player.hand);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Crispin = Crispin;
