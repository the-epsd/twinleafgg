"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamYellsCheer = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let pokemonOrSupporterInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof game_1.PokemonCard;
        const isSupporter = c instanceof trainer_card_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
        if (isPokemon || isSupporter) {
            pokemonOrSupporterInDiscard += 1;
        }
        else {
            blocked.push(index);
        }
        if (c.name === self.name) {
            blocked.push(index);
            return;
        }
    });
    // Player does not have correct cards in discard
    if (pokemonOrSupporterInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 3, allowCancel: false, blocked: blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
}
class TeamYellsCheer extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.name = 'Team Yell\'s Cheer';
        this.fullName = 'Team Yell\'s Cheer BRS';
        this.text = 'Shuffle up to 3 in any combination of Pokémon and Supporter cards, except for Team Yell\'s Cheer, from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if TrainerToDeckEffect is prevented
            const discardEffect = new play_card_effects_1.TrainerToDeckEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                // If prevented, just discard the card and return
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TeamYellsCheer = TeamYellsCheer;
