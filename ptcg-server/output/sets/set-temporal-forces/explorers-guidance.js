"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorersGuidance = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
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
        this.text = 'Heal all damage from 1 of your Pokémon that has 30 HP or less remaining.';
    }
    reduceEffect(store, state, effect) {
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
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 6);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 2, max: 2, allowCancel: false }), selected => {
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.discard);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                player.supporterTurn += 1;
            });
        }
        return state;
    }
}
exports.ExplorersGuidance = ExplorersGuidance;
