"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreedyDice = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GreedyDice extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'STS';
        this.setNumber = '102';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Greedy Dice';
        this.fullName = 'Greedy Dice STS';
        this.text = 'You can play this card only if you took it as a face-down Prize card, before you put it into your hand.' +
            `
    ` +
            'Flip a coin. If heads, take 1 more Prize card.';
        this.cardUsed = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        if (effect instanceof game_effects_1.DrawPrizesEffect) {
            const generator = this.handlePrizeEffect(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
    *handlePrizeEffect(next, store, state, effect) {
        const player = effect.player;
        const prizeCard = effect.prizes.find(cardList => cardList.cards.includes(this));
        // Check if play conditions are met
        if (!prizeCard || !prizeCard.isSecret || effect.destination !== player.hand) {
            return state;
        }
        // Prevent unintended multiple uses
        if (this.cardUsed) {
            return state;
        }
        // Prevent prize card from going to hand until we complete the card effect flow
        effect.preventDefault = true;
        // Ask player if they want to use the card
        let wantToUse = false;
        yield prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
            wantToUse = result;
            next();
        }, game_message_1.GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
        // If the player declines, move the original prize card to hand
        const prizeIndex = player.prizes.findIndex(prize => prize.cards.includes(this));
        const fallback = (prizeIndex) => {
            if (prizeIndex !== -1) {
                prefabs_1.TAKE_SPECIFIC_PRIZES(store, state, player, [player.prizes[prizeIndex]], { skipReduce: true });
            }
            return;
        };
        if (!wantToUse) {
            effect.preventDefault = false;
            fallback(prizeIndex);
            return state;
        }
        // Now that we've confirmed the card can be played, we can update the state
        // (per wording of the card, this still counts as a prize taken even if
        // it does not go to the player's hand)
        this.cardUsed = true;
        player.prizesTaken += 1;
        // If the player agrees, discard Greedy Dice
        for (const [index, prize] of player.prizes.entries()) {
            if (prize.cards.includes(this)) {
                player.prizes[index].moveTo(player.discard);
                break;
            }
        }
        // Handle coin flip
        try {
            const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
            store.reduceEffect(state, coinFlip);
        }
        catch (_a) {
            return state;
        }
        const coinResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
        if (!coinResult) {
            return state;
        }
        player.supporter.moveCardTo(this, player.discard);
        // Handle extra prize (excluding the group this card is in)
        yield prefabs_1.TAKE_X_PRIZES(store, state, player, 1, {
            promptOptions: {
                blocked: effect.prizes.map(p => player.prizes.indexOf(p))
            }
        }, () => next());
        return state;
    }
}
exports.GreedyDice = GreedyDice;
