"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuskStone = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_manager_1 = require("../../game/cards/card-manager");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const validEvolutions = [
        'Mismagius',
        'Honchkrow',
        'Chandelure',
        'Aegislash',
        'Mismagius-GX',
        'Honchkrow-GX',
        'Chandelure-GX',
        'Aegislash-GX',
    ];
    // Look through all known cards to find out if Pokemon can evolve
    const cm = card_manager_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC && validEvolutions.includes(c.name);
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list.pokemonPlayedTurn - 1 >= state.turn) {
            return;
        }
        const valid = evolutions.filter(e => e.evolvesFrom === card.name);
        valid.forEach(c => {
            if (!evolutionNames.includes(c.name)) {
                evolutionNames.push(c.name);
            }
        });
    });
    // There is nothing that can evolve
    if (evolutionNames.length === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Blocking pokemon cards, that cannot be valid evolutions
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof pokemon_card_1.PokemonCard && !evolutionNames.includes(card.name)) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Canceled by user, he didn't found the card in the deck
    if (cards.length === 0) {
        return state;
    }
    const evolution = cards[0];
    const blocked2 = [];
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.name !== evolution.evolvesFrom) {
            blocked2.push(target);
        }
    });
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    const pokemonCard = targets[0].getPokemonCard();
    if (pokemonCard === undefined) {
        return state; // invalid target?
    }
    // Evolve Pokemon
    player.deck.moveCardTo(evolution, targets[0]);
    targets[0].clearEffects();
    targets[0].pokemonPlayedTurn = state.turn;
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class DuskStone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UNB';
        this.name = 'Dusk Stone';
        this.fullName = 'Dusk Stone UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '167';
        this.text = 'Search your deck for a Mismagius, Honchkrow, Chandelure, or Aegislash, including Pokémon-GX, that evolves from 1 of your Pokémon in play, and put it onto that Pokémon to evolve it. Then, shuffle your deck. You can use this card during your first turn or on a Pokémon that was put into play this turn.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.DuskStone = DuskStone;
