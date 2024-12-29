"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamStarGrunt = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class TeamStarGrunt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'G';
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '195';
        this.name = 'Team Star Grunt';
        this.fullName = 'Team Star Grunt SVI';
        this.text = 'Put an Energy attached to your opponent\'s Active Pokémon on top of their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const deckTop = new game_1.CardList();
            const target = opponent.active;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: true }), energy => {
                const cards = (energy || []).map(e => e.cards);
                if (cards.length > 0) {
                    target.moveCardsTo(energy, deckTop);
                    deckTop.moveToTopOfDestination(opponent.deck);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
            return state;
        }
        return state;
    }
}
exports.TeamStarGrunt = TeamStarGrunt;
