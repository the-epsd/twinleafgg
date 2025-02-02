"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyLoto = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class EnergyLoto extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '140';
        this.name = 'Energy Loto';
        this.fullName = 'Energy Loto ASR';
        this.text = 'Look at the top 7 cards of your deck. You may reveal an Energy card you find there and put it into your hand. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const temp = new game_1.CardList();
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.deck.moveTo(temp, 7);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, temp, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), chosenCards => {
                if (chosenCards.length == 0) {
                    // No Energy chosen, shuffle all back
                    temp.cards.forEach(card => {
                        temp.moveCardTo(card, player.deck);
                    });
                    player.supporter.moveCardTo(this, player.discard);
                }
                if (chosenCards.length > 0) {
                    // Move chosen Energy to hand
                    const energyCard = chosenCards[0];
                    temp.moveCardTo(energyCard, player.hand);
                    player.supporter.moveCardTo(this, player.discard);
                    temp.moveTo(player.deck);
                    chosenCards.forEach((card, index) => {
                        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    });
                    if (chosenCards.length > 0) {
                        state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenCards), () => state);
                    }
                }
                player.supporter.moveCardTo(this, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.EnergyLoto = EnergyLoto;
