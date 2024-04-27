"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamStarGrunt = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class TeamStarGrunt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
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
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), (energy) => {
                const cards = (energy || []).map(e => e.card);
                // Fix error by looping through cards and moving individually
                cards.forEach(card => {
                    deckTop.moveCardTo(card, opponent.deck);
                });
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                player.supporterTurn = 1;
            });
            return state;
        }
        return state;
    }
}
exports.TeamStarGrunt = TeamStarGrunt;
