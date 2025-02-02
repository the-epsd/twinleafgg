"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miriam = void 0;
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
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let pokemonsInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof pokemon_card_1.PokemonCard;
        if (isPokemon) {
            pokemonsInDiscard += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Player does not have correct cards in discard
    if (pokemonsInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 5, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.deck);
    state = store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
    player.deck.moveTo(player.hand, 3);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
}
class Miriam extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '179';
        this.name = 'Miriam';
        this.fullName = 'Miriam SVI';
        this.text = 'Shuffle up to 5 Pokémon from your discard pile into your deck. If you shuffled any cards into your deck in this way, draw 3 cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Miriam = Miriam;
