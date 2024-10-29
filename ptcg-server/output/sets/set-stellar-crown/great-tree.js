"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreatTree = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* useStadium(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof game_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
    });
    // Build possible evolution card names
    const evolutionNames = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, list);
        store.reduceEffect(state, playedTurnEffect);
        if (card.stage !== card_types_1.Stage.BASIC || playedTurnEffect.pokemonPlayedTurn === state.turn) {
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
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.stage !== card_types_1.Stage.BASIC) {
            blocked2.push(target);
        }
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false, blocked: blocked2 }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state; // canceled by user
    }
    const target = targets[0];
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
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_1, evolvesFrom: pokemonCard.name }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Canceled by user, he didn't find the card in the deck
    if (cards.length === 0) {
        return state;
    }
    const evolution = cards[0];
    // Evolve Pokemon
    player.deck.moveCardTo(evolution, target);
    target.clearEffects();
    target.pokemonPlayedTurn = state.turn;
    // Check if there's a Stage 2 evolution available
    const stage2Evolutions = evolutions.filter(e => e.evolvesFrom === evolution.name);
    if (stage2Evolutions.length > 0) {
        // Blocking pokemon cards, that cannot be valid evolutions
        const blockedStage2 = [];
        player.deck.cards.forEach((card, index) => {
            if (card instanceof game_1.PokemonCard && card.evolvesFrom !== evolution.name) {
                blockedStage2.push(index);
            }
        });
        let stage2Cards = [];
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_2, evolvesFrom: evolution.name }, { min: 1, max: 1, allowCancel: true, blocked: blockedStage2 }), selected => {
            stage2Cards = selected || [];
            next();
        });
        if (stage2Cards.length > 0) {
            const stage2Evolution = stage2Cards[0];
            player.deck.moveCardTo(stage2Evolution, target);
            target.clearEffects();
            target.pokemonPlayedTurn = state.turn;
        }
    }
    return state;
}
class GreatTree extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.regulationMark = 'H';
        this.name = 'Grand Tree';
        this.fullName = 'Great Tree SV7';
        this.text = 'Once during each player\'s turn, that player may search their deck for a Stage 1 Pokémon that evolves from 1 of their Basic Pokémon and put it onto that Pokémon to evolve it.If that Pokémon was evolved in this way, that player may search their deck for a Stage 2 Pokémon that evolves from that Pokémon and put it onto that Pokémon to evolve it.Then, that player shuffles their deck. (Players can\'t evolve a Basic Pokémon during their first turn or a Basic Pokémon that was put into play this turn.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const generator = useStadium(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.GreatTree = GreatTree;
