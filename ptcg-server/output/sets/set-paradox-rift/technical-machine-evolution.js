"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalMachineEvolution = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* playCard(next, store, state, effect) {
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
        yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: true, blocked }), selected => {
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
class TechnicalMachineEvolution extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '178';
        this.name = 'Technical Machine: Evolution';
        this.fullName = 'Technical Machine: Evolution PAR';
        this.attacks = [{
                name: 'Evolution',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Choose up to 2 of your Benched Pokémon. For each of those Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck.'
            }];
        this.text = 'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                    cardList.tool = undefined;
                }
            });
            return state;
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const colorlessReudction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < colorlessReudction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
            if (pokemonCard && 'getDarkReduction' in pokemonCard) {
                const darkReduction = pokemonCard.getDarkReduction(state);
                for (let i = 0; i < darkReduction && effect.cost.includes(card_types_1.CardType.DARK); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.DARK);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
            if (pokemonCard && 'getWaterReduction' in pokemonCard) {
                const waterReduction = pokemonCard.getWaterReduction(state);
                for (let i = 0; i < waterReduction && effect.cost.includes(card_types_1.CardType.WATER); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.WATER);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TechnicalMachineEvolution = TechnicalMachineEvolution;
