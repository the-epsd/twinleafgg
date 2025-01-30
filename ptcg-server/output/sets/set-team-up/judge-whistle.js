"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgeWhistle = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class JudgeWhistle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TEU';
        this.name = 'Judge Whistle';
        this.fullName = 'Judge Whistle TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.text = 'Choose 1:' +
            '' +
            '• Draw a card.' +
            '• Put a Judge card from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let isJudgeInDiscard = false;
            player.discard.cards.forEach(card => {
                if (card instanceof trainer_card_1.TrainerCard && card.name === 'Judge') {
                    isJudgeInDiscard = true;
                }
            });
            if (!isJudgeInDiscard && player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // if there's no judge, just draw
            if (!isJudgeInDiscard) {
                player.deck.moveTo(player.hand, 1);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            }
            if (isJudgeInDiscard) {
                const options = [
                    {
                        // grab a judge
                        message: game_1.GameMessage.CHOOSE_SUPPORTER_FROM_DISCARD,
                        action: () => {
                            const blocked = [];
                            player.discard.cards.forEach((c, index) => {
                                const isJudge = c instanceof trainer_card_1.TrainerCard && c.name === 'Judge';
                                if (isJudge) {
                                    return;
                                }
                                else {
                                    blocked.push(index);
                                }
                            });
                            let cards = [];
                            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                                cards = selected || [];
                                cards.forEach((card, index) => {
                                    store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_CARD_TO_HAND, { name: player.name, card: card.name });
                                });
                                player.discard.moveCardsTo(cards, player.hand);
                                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                                    player.deck.applyOrder(order);
                                });
                            });
                        }
                    },
                    {
                        message: game_1.GameMessage.DRAW,
                        action: () => {
                            player.deck.moveTo(player.hand, 1);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        }
                    }
                ];
                return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                    const option = options[choice];
                    option.action();
                });
            }
        }
        return state;
    }
}
exports.JudgeWhistle = JudgeWhistle;
