"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gladion = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Gladion extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.set = 'CIN';
        this.name = 'Gladion';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.fullName = 'Gladion CIN';
        this.text = 'Look at your face-down Prize cards and put 1 of them into your hand. Then, shuffle this Gladion into your remaining Prize cards and put them back face down. If you didn\'t play this Gladion from your hand, it does nothing.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const prizes = player.prizes.filter(p => p.isSecret);
            const supporterTurn = player.supporterTurn;
            if (prizes.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const cards = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
            const blocked = [];
            player.prizes.forEach((c, index) => {
                if (!c.isSecret) {
                    blocked.push(index);
                }
            });
            // Make prizes no more secret, before displaying prompt
            prizes.forEach(p => { p.isSecret = false; });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 1, blocked: blocked, allowCancel: false }), chosenPrize => {
                const selectedPrize = chosenPrize[0];
                const hand = player.hand;
                const gladion = effect.trainerCard;
                selectedPrize.moveTo(hand);
                const chosenPrizeIndex = player.prizes.indexOf(chosenPrize[0]);
                player.supporter.moveCardTo(gladion, player.prizes[chosenPrizeIndex]);
                prizes.forEach(p => { p.isSecret = true; });
                player.prizes = this.shuffleFaceDownPrizeCards(player.prizes);
            });
            return state;
        }
        return state;
    }
    shuffleFaceDownPrizeCards(array) {
        const faceDownPrizeCards = array.filter(p => p.isSecret && p.cards.length > 0);
        for (let i = faceDownPrizeCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = faceDownPrizeCards[i];
            faceDownPrizeCards[i] = faceDownPrizeCards[j];
            faceDownPrizeCards[j] = temp;
        }
        const prizePositions = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].cards.length === 0 || !array[i].isSecret) {
                prizePositions.push(array[i]);
                continue;
            }
            prizePositions.push(faceDownPrizeCards.splice(0, 1)[0]);
        }
        return prizePositions;
    }
}
exports.Gladion = Gladion;
