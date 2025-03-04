"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCsHypeUp = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MCsHypeUp extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SV9a';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'MC\'s Hype Up';
        this.fullName = 'MC\'s Hype Up SV9a';
        this.text = 'Draw 2 cards. If your opponent has 3 or fewer Prize cards remaining, draw 2 more cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Move to supporter pile
            state = store.reduceEffect(state, new game_effects_1.MoveCardsEffect(player.hand, player.supporter, { cards: [effect.trainerCard] }));
            effect.preventDefault = true;
            prefabs_1.DRAW_CARDS(player, 2);
            if (opponent.getPrizeLeft() <= 3) {
                prefabs_1.DRAW_CARDS(player, 2);
            }
            player.supporter.moveTo(player.discard);
        }
        return state;
    }
}
exports.MCsHypeUp = MCsHypeUp;
