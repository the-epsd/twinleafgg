"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SacredAsh = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    let pokemonsInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach(c => {
        if (c instanceof pokemon_card_1.PokemonCard) {
            pokemonsInDiscard += 1;
        }
    });
    // Player does not have correct cards in discard
    if (pokemonsInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const max = Math.min(5, pokemonsInDiscard);
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: max, max, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    player.discard.moveCardsTo(cards, player.deck);
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class SacredAsh extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'FLF';
        this.name = 'Sacred Ash';
        this.fullName = 'Sacred Ash FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.text = 'Shuffle 5 Pokemon from your discard pile into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SacredAsh = SacredAsh;
