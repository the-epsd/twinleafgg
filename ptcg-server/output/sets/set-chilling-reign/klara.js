"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klara = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const show_cards_prompt_1 = require("../../game/store/prompts/show-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    let cards = [];
    const pokemonAndEnergyInDiscardPile = player.discard.cards.filter(c => c instanceof game_1.PokemonCard || (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)).length;
    if (pokemonAndEnergyInDiscardPile === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let pokemons = 0;
    let energies = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            energies += 1;
        }
        else if (c instanceof game_1.PokemonCard) {
            pokemons += 1;
        }
        else {
            blocked.push(index);
        }
    });
    const maxPokemons = Math.min(pokemons, 2);
    const maxEnergies = Math.min(energies, 2);
    const count = maxPokemons + maxEnergies;
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }), selected => {
        cards = selected || [];
        next();
    });
    cards.forEach((card, index) => {
        store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    player.discard.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    if (cards.length > 0) {
        yield store.prompt(state, new show_cards_prompt_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return state;
}
class Klara extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.regulationMark = 'E';
        this.name = 'Klara';
        this.fullName = 'Klara CRE 145';
        this.text = 'Choose 1 or both:' +
            '' +
            'Put up to 2 Pokémon from your discard pile into your hand.' +
            'Put up to 2 basic Energy cards from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
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
exports.Klara = Klara;
