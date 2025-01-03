"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorersGuidance = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ExplorersGuidance extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TEF';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '147';
        this.regulationMark = 'H';
        this.name = 'Explorer\'s Guidance';
        this.fullName = 'Explorer\'s Guidance TEF';
        this.text = 'Look at the top 6 cards of your deck and put 2 of them into your hand. Discard the other cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.ancientSupporter = false;
        }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 6);
            const min = player.deck.cards.length > 1 ? Math.min(2, deckTop.cards.length) : 1;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min, max: 2, allowCancel: false }), selected => {
                player.ancientSupporter = true;
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.discard);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
            });
        }
        return state;
    }
}
exports.ExplorersGuidance = ExplorersGuidance;
