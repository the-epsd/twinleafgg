"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonBreedersNurturing = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, list);
        store.reduceEffect(state, playedTurnEffect);
        if (playedTurnEffect.pokemonPlayedTurn = state.turn) {
            blocked2.push(target);
        }
    });
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof game_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const valid = evolutions.filter(e => e.evolvesFrom === card.name);
        valid.forEach(c => {
            if (!evolutionNames.includes(c.name)) {
                evolutionNames.push(c.name);
            }
        });
    });
    // There is nothing that can evolve
    if (evolutionNames.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    for (const target of targets) {
        const pokemonCard = target.getPokemonCard();
        if (pokemonCard === undefined) {
            return state; // invalid target?
        }
        // Blocking pokemon cards, that cannot be valid evolutions
        const blocked = [];
        player.deck.cards.forEach((card, index) => {
            if (card instanceof game_1.PokemonCard && card.evolvesFrom !== pokemonCard.name) {
                blocked.push(index);
            }
        });
        let cards = [];
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
            cards = selected || [];
            next();
        });
        if (cards.length === 0) {
            continue;
        }
        const evolution = cards[0];
        // Evolve Pokemon
        player.deck.moveCardTo(evolution, target);
        target.clearEffects();
        target.pokemonPlayedTurn = state.turn;
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class PokemonBreedersNurturing extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.name = 'Pokémon Breeder\'s Nurturing';
        this.fullName = 'Pokémon Breeder\'s Nurturing DAA';
        this.text = 'Choose up to 2 of your Pokémon in play. For each of those Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck. You can\'t use this card during your first turn or on a Pokémon that was put into play this turn.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokemonBreedersNurturing = PokemonBreedersNurturing;
