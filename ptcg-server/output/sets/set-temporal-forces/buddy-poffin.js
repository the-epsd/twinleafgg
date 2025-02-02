"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyPoffin = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BuddyPoffin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.regulationMark = 'H';
        this.name = 'Buddy Poffin';
        this.fullName = 'Buddy Poffin SV5';
        this.text = 'Search your deck for up to 2 Basic Pokémon with 70 HP or less and put them onto your Bench. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            let pokemons = 0;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.BASIC && c.hp <= 70) {
                    pokemons += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // Allow player to search deck and choose up to 2 Basic Pokemon
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            else {
                // Check if bench has open slots
                const openSlots = player.bench.filter(b => b.cards.length === 0);
                if (openSlots.length === 0) {
                    // No open slots, throw error
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                const maxPokemons = Math.min(pokemons, 2);
                // We will discard this card after prompt confirmation
                effect.preventDefault = true;
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 2, allowCancel: false, blocked, maxPokemons }), selectedCards => {
                    cards = selectedCards || [];
                    cards.forEach((card, index) => {
                        player.deck.moveCardTo(card, slots[index]);
                        slots[index].pokemonPlayedTurn = state.turn;
                    });
                    player.supporter.moveCardTo(this, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
            }
        }
        return state;
    }
}
exports.BuddyPoffin = BuddyPoffin;
