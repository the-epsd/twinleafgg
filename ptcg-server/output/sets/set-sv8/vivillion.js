"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vivillion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
function* useEvolutionPowder(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Look through all known cards to find out if Pokemon can evolve
    const cm = game_1.CardManager.getInstance();
    const evolutions = cm.getAllCards().filter(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
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
        throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    });
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 5, allowCancel: false, blocked: blocked2 }), selection => {
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
            if (card instanceof pokemon_card_1.PokemonCard && card.evolvesFrom !== pokemonCard.name) {
                blocked.push(index);
            }
        });
        let cards = [];
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
            cards = selected || [];
            next();
        });
        // Canceled by user, he didn't found the card in the deck
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
class Vivillion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = G;
        this.hp = 120;
        this.retreat = [C];
        this.weakness = [{ type: R }];
        this.evolvesFrom = 'Spewpa';
        this.attacks = [
            {
                name: 'Evolution Powder',
                cost: [C],
                damage: 0,
                text: 'For each of your Benched Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck.'
            },
            {
                name: 'Cutting Wind',
                cost: [G],
                damage: 90,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.name = 'Vivillion';
        this.fullName = 'Vivillion SV8';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useEvolutionPowder(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Vivillion = Vivillion;
