"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingCourt = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let basicEnergyInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        if (isPokemon) {
            basicEnergyInDiscard += 1;
        }
        else {
            blocked.push(index);
        }
    });
    if (basicEnergyInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false, blocked }), selectedCards => {
        cards = selectedCards || [];
        // Operation canceled by the user
        if (cards.length === 0) {
            return state;
        }
        if (cards.length > 0) {
            store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
        }
        cards.forEach((card, index) => {
            player.discard.moveCardTo(card, player.hand);
        });
        cards.forEach((card, index) => {
            store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });
    });
}
class TrainingCourt extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'RCL';
        this.name = 'Training Court';
        this.fullName = 'Training Court RCL';
        this.text = 'Once during each player\'s turn, that player may put a basic Energy card from their discard pile into their hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.stadium, player.discard);
                return state;
            }
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TrainingCourt = TrainingCourt;
