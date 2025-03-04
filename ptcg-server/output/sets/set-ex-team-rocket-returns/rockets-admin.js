"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsAdmin = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class RocketsAdmin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Rocket\'s Admin';
        this.fullName = 'Rocket\'s Admin TRR';
        this.text = 'Each player shuffles his or her hand into his or her deck. Then, each player counts his or her Prize cards left and draws up to that many cards. (You draw your cards first.)';
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
            const cards = player.hand.cards.filter(c => c !== this);
            const opponentCards = opponent.hand.cards.filter(c => c !== this);
            if (cards.length === 0 && player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardsTo(cards, player.deck);
            opponent.hand.moveCardsTo(opponentCards, opponent.deck);
            store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
            store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
            });
            const maxPlayerDraw = player.getPrizeLeft();
            const maxOpponentDraw = opponent.getPrizeLeft();
            if (maxPlayerDraw > 0) {
                const options = [];
                for (let i = maxPlayerDraw; i >= 0; i--) {
                    options.push({ message: `Draw ${i} card(s)`, value: i });
                }
                store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.WANT_TO_DRAW_CARDS, options.map(c => c.message), { allowCancel: false }), choice => {
                    const numCardsToDraw = options[choice].value;
                    player.deck.moveTo(player.hand, numCardsToDraw);
                    if (maxOpponentDraw > 0) {
                        const opponentOptions = [];
                        for (let i = maxOpponentDraw; i >= 0; i--) {
                            opponentOptions.push({ message: `Draw ${i} card(s)`, value: i });
                        }
                        store.prompt(state, new game_1.SelectPrompt(opponent.id, game_1.GameMessage.WANT_TO_DRAW_CARDS, opponentOptions.map(c => c.message), { allowCancel: false }), opponentChoice => {
                            const opponentNumCardsToDraw = opponentOptions[opponentChoice].value;
                            opponent.deck.moveTo(opponent.hand, opponentNumCardsToDraw);
                        });
                    }
                });
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.RocketsAdmin = RocketsAdmin;
