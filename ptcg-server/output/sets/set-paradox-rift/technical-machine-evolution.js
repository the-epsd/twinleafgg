"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalMachineEvolution = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
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
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
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
                if (list.pokemonPlayedTurn >= state.turn) {
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
            // Blocking pokemon cards, that cannot be valid evolutions
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof game_1.PokemonCard && !evolutionNames.includes(card.name)) {
                    blocked.push(index);
                }
            });
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 2, allowCancel: false, blocked }), selected => {
                cards = selected || [];
            });
            cards.forEach(selected => {
                // Canceled by user, he didn't found the card in the deck
                if (cards.length === 0) {
                    return state;
                }
                const evolution = cards[0];
                const blocked2 = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                    if (card.name !== evolution.evolvesFrom) {
                        blocked2.push(target);
                    }
                });
                let targets = [];
                store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked2 }), selection => {
                    targets = selection || [];
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
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.tool) {
            const player = effect.player;
            const tool = effect.player.active.tool;
            if (tool.name === this.name) {
                player.active.moveCardTo(tool, player.discard);
                player.active.tool = undefined;
            }
            return state;
        }
        return state;
    }
}
exports.TechnicalMachineEvolution = TechnicalMachineEvolution;
