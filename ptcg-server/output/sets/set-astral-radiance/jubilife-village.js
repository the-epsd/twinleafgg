"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JubilifeVillage = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
class JubilifeVillage extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.name = 'Jubilife Village';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Jubilife Village ASR';
        this.setNumber = '148';
        this.text = 'Once during each player\'s turn, that player may shuffle their hand into their deck and draw 5 cards. If they do, their turn ends.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0 && player.hand.cards.length == 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.deck);
            state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
            player.deck.moveTo(player.hand, 5);
            effect.preventDefault = true;
            store.log(state, game_message_1.GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
            player.stadiumUsedTurn = state.turn;
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            return store.reduceEffect(state, endTurnEffect);
        }
        return state;
    }
}
exports.JubilifeVillage = JubilifeVillage;
